#!/usr/bin/env python3

import argparse
import json
import os
import sys
from typing import Any, Dict, List

import requests
import urllib3


urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def hue_request(
    method: str,
    bridge_ip: str,
    app_key: str | None,
    path: str,
    body: dict | None = None,
) -> Any:
    headers = {
        "Content-Type": "application/json",
    }

    if app_key:
        headers["hue-application-key"] = app_key

    url = f"https://{bridge_ip}{path}"

    response = requests.request(
        method=method,
        url=url,
        headers=headers,
        json=body,
        timeout=10,
        verify=False,  # Hue Bridge uses a local/self-signed certificate
    )

    try:
        data = response.json()
    except ValueError:
        raise RuntimeError(f"Non-JSON response from bridge: {response.text}")

    if response.status_code >= 400:
        raise RuntimeError(f"HTTP {response.status_code}: {data}")

    if isinstance(data, dict) and data.get("errors"):
        raise RuntimeError(f"Hue API errors: {data['errors']}")

    return data


def discover_bridge_ip() -> str:
    response = requests.get("https://discovery.meethue.com", timeout=10)
    response.raise_for_status()

    bridges = response.json()
    if not bridges:
        raise RuntimeError("No Hue Bridge found via discovery.meethue.com")

    return bridges[0]["internalipaddress"]


def create_app_key(bridge_ip: str) -> str:
    print("Press the physical link button on your Hue Bridge, then press Enter.")
    input()

    body = {
        "devicetype": "hue_v2_rename_lights#python",
        "generateclientkey": True,
    }

    # App-key creation still uses /api, even when you then use API v2.
    data = hue_request("POST", bridge_ip, None, "/api", body)

    for item in data:
        if "success" in item and "username" in item["success"]:
            return item["success"]["username"]

    raise RuntimeError(f"Could not create app key. Response: {data}")


def list_lights(bridge_ip: str, app_key: str) -> List[Dict[str, Any]]:
    data = hue_request(
        "GET",
        bridge_ip,
        app_key,
        "/clip/v2/resource/light",
    )

    lights = data.get("data", [])
    if not isinstance(lights, list):
        raise RuntimeError(f"Unexpected lights response: {data}")

    return lights


def get_light_name(light: Dict[str, Any]) -> str:
    return light.get("metadata", {}).get("name", "<unnamed>")


def print_lights(lights: List[Dict[str, Any]]) -> None:
    print("\nCurrent Hue lights:")

    for light in sorted(lights, key=lambda x: get_light_name(x).lower()):
        light_id = light.get("id")
        id_v1 = light.get("id_v1", "")
        name = get_light_name(light)

        print(f"  {name}")
        print(f"    v2 id: {light_id}")
        if id_v1:
            print(f"    v1 id: {id_v1}")


def rename_light(
    bridge_ip: str,
    app_key: str,
    light_id: str,
    new_name: str,
    dry_run: bool,
) -> None:
    path = f"/clip/v2/resource/light/{light_id}"
    body = {
        "metadata": {
            "name": new_name,
        }
    }

    if dry_run:
        print(f"[dry-run] Would rename {light_id} to {new_name!r}")
        return

    hue_request("PUT", bridge_ip, app_key, path, body)
    print(f"Renamed {light_id} to {new_name!r}")


def resolve_light_id(lights: List[Dict[str, Any]], key: str) -> str:
    key = key.strip()

    # Match exact v2 UUID.
    for light in lights:
        if light.get("id") == key:
            return light["id"]

    # Match old v1 numeric ID, e.g. "8" against id_v1 "/lights/8".
    for light in lights:
        id_v1 = light.get("id_v1", "")
        if id_v1 == f"/lights/{key}":
            return light["id"]

    # Match exact current name.
    matches = [
        light["id"]
        for light in lights
        if get_light_name(light) == key
    ]

    if len(matches) == 1:
        return matches[0]

    if len(matches) > 1:
        raise RuntimeError(
            f"Multiple lights named {key!r}; use the v2 id instead."
        )

    raise RuntimeError(f"No light found matching v2 id, v1 id, or exact name: {key!r}")


def parse_renames(values: list[str]) -> Dict[str, str]:
    renames: Dict[str, str] = {}

    for value in values:
        if "=" not in value:
            raise RuntimeError(
                f"Invalid rename format: {value!r}. Use ID=New Name or Old Name=New Name."
            )

        old, new = value.split("=", 1)
        old = old.strip()
        new = new.strip()

        if not old or not new:
            raise RuntimeError(f"Invalid rename format: {value!r}")

        renames[old] = new

    return renames


def load_mapping(path: str | None) -> Dict[str, str]:
    if not path:
        return {}

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise RuntimeError("Mapping file must be a JSON object.")

    return {str(key): str(value) for key, value in data.items()}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Rename Philips Hue lights using Hue API v2."
    )

    parser.add_argument(
        "--bridge-ip",
        default=os.getenv("HUE_BRIDGE_IP"),
        help="Hue Bridge IP. Defaults to HUE_BRIDGE_IP, then auto-discovery.",
    )
    parser.add_argument(
        "--app-key",
        default=os.getenv("HUE_APP_KEY") or os.getenv("HUE_USERNAME"),
        help="Hue API app key. Defaults to HUE_APP_KEY or HUE_USERNAME.",
    )
    parser.add_argument(
        "--create-key",
        action="store_true",
        help="Create a Hue app key. Press the bridge button when prompted.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List lights and exit.",
    )
    parser.add_argument(
        "--rename",
        action="append",
        default=[],
        help='Rename one light. Use v2-id=New Name, v1-id=New Name, or "Old Name=New Name". Repeatable.',
    )
    parser.add_argument(
        "--map",
        help='JSON mapping file, e.g. {"8": "Kitchen Lamp", "Old Name": "New Name"}.',
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show planned changes without writing them.",
    )

    args = parser.parse_args()

    bridge_ip = args.bridge_ip or discover_bridge_ip()
    print(f"Using Hue Bridge: {bridge_ip}")

    if args.create_key:
        app_key = create_app_key(bridge_ip)
        print("\nCreated Hue API app key:")
        print(app_key)
        print("\nSave it for next time:")
        print(f"export HUE_BRIDGE_IP='{bridge_ip}'")
        print(f"export HUE_APP_KEY='{app_key}'")
        return 0

    if not args.app_key:
        print("Missing Hue app key.")
        print("Run this first:")
        print("python hue_v2_rename_lights.py --create-key")
        return 2

    lights = list_lights(bridge_ip, args.app_key)

    if args.list or not args.rename and not args.map:
        print_lights(lights)
        return 0

    renames = {}
    renames.update(load_mapping(args.map))
    renames.update(parse_renames(args.rename))

    print_lights(lights)
    print("\nRenaming:")

    for key, new_name in renames.items():
        light_id = resolve_light_id(lights, key)
        old_name = next(
            get_light_name(light)
            for light in lights
            if light["id"] == light_id
        )

        print(f"  {old_name!r} -> {new_name!r}")
        rename_light(args.bridge_ip or bridge_ip, args.app_key, light_id, new_name, args.dry_run)

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)
from __future__ import annotations

from pathlib import Path
from typing import Any
import re

from ..chunks import KnowledgeChunk, redact_value, source_file_label, stable_hash
from ..collections import REFERENCE_OBJECT_TYPES, collection_for_home_assistant_object

try:
    import yaml
except Exception:  # pragma: no cover
    yaml = None

ENTITY_RE = re.compile(
    r"\b(?:sensor|binary_sensor|switch|light|automation|script|input_boolean|input_text|input_number|input_select|timer|climate|media_player|person|zone|button|number|select|device_tracker|calendar|weather|vacuum|fan|humidifier|remote|update|conversation|todo)\.[a-zA-Z0-9_]+\b"
)
ROOM_RE = re.compile(
    r"\b(?:Alpha|Beta|Bedroom 1|Bedroom 2|Bathroom 1|Ensuite|Hallway|Kitchen|Laundry|Open Plan|Pass|Primary Bedroom|Rear Bathroom|Rear Bedroom|Storage|Walk-in Wardrobe)\b",
    re.IGNORECASE,
)

DIRECT_CONFIG_SECTIONS = REFERENCE_OBJECT_TYPES | {
    "automation",
    "blueprint",
    "scene",
    "script",
}

AUTOMATION_KEYS = {"action", "actions", "condition", "conditions", "sequence", "trigger", "triggers"}
SCRIPT_SHAPE_KEYS = {"alias", "fields", "mode", "sequence"}


class TaggedValue:
    def __init__(self, tag: str, value: Any):
        self.tag = tag
        self.value = value

    def to_plain(self) -> Any:
        if self.tag == "!secret":
            return {"tag": self.tag, "value": "<redacted>"}
        return {"tag": self.tag, "value": to_plain(self.value)}

    def __repr__(self) -> str:
        if self.tag == "!secret":
            return "!secret <redacted>"
        return f"{self.tag} {self.value}"


class HomeAssistantLoader(yaml.SafeLoader if yaml is not None else object):
    pass


def _construct_unknown_tag(loader: Any, tag_suffix: str, node: Any) -> TaggedValue:
    tag = f"!{tag_suffix}"
    if tag == "!secret":
        return TaggedValue(tag, "<redacted>")
    if isinstance(node, yaml.ScalarNode):
        value = loader.construct_scalar(node)
    elif isinstance(node, yaml.SequenceNode):
        value = loader.construct_sequence(node)
    elif isinstance(node, yaml.MappingNode):
        value = loader.construct_mapping(node)
    else:
        value = None
    return TaggedValue(tag, value)


if yaml is not None:
    HomeAssistantLoader.add_multi_constructor("!", _construct_unknown_tag)


def to_plain(value: Any) -> Any:
    if isinstance(value, TaggedValue):
        return value.to_plain()
    if isinstance(value, list):
        return [to_plain(item) for item in value]
    if isinstance(value, tuple):
        return [to_plain(item) for item in value]
    if isinstance(value, dict):
        return {str(to_plain(key)): to_plain(item) for key, item in value.items()}
    return value


def extract_entities(value: Any) -> list[str]:
    found: set[str] = set()

    def walk(item: Any, parent_key: str = "") -> None:
        if isinstance(item, TaggedValue):
            walk(item.value, parent_key)
            return
        if isinstance(item, dict):
            for key, child in item.items():
                walk(child, str(key))
            return
        if isinstance(item, list):
            for child in item:
                walk(child, parent_key)
            return
        if isinstance(item, str) and parent_key not in {"action", "service"}:
            found.update(ENTITY_RE.findall(item))

    walk(value)
    return sorted(found)


def extract_services(value: Any) -> list[str]:
    services: set[str] = set()

    def walk(item: Any) -> None:
        if isinstance(item, TaggedValue):
            walk(item.value)
            return
        if isinstance(item, dict):
            for key, child in item.items():
                if key in {"action", "service"} and isinstance(child, str):
                    services.add(child)
                walk(child)
            return
        if isinstance(item, list):
            for child in item:
                walk(child)
            return

    walk(value)
    return sorted(services)


def extract_domains(value: Any, object_type: str = "") -> list[str]:
    domains = {object_type} if object_type else set()
    for entity in extract_entities(value):
        domains.add(entity.split(".", 1)[0])
    for service in extract_services(value):
        domains.add(service.split(".", 1)[0])
    return sorted(domain for domain in domains if domain)


def extract_rooms(value: Any, path: str | Path = "") -> list[str]:
    text = f"{path} {to_plain(value)}"
    return sorted({match.group(0).lower() for match in ROOM_RE.finditer(text)})


def extract_tags(value: Any) -> list[str]:
    tags: set[str] = set()

    def walk(item: Any) -> None:
        if isinstance(item, TaggedValue):
            tags.add(f"ha_tag:{item.tag}")
            if item.tag == "!input" and item.value:
                tags.add(f"input:{item.value}")
            walk(item.value)
            return
        if isinstance(item, dict):
            for key, child in item.items():
                if key in AUTOMATION_KEYS:
                    tags.add(str(key))
                walk(child)
            return
        if isinstance(item, list):
            for child in item:
                walk(child)

    walk(value)
    return sorted(tags)


def infer_top_level_script(name: str, body: Any, source_path: Path) -> bool:
    if source_path.name in {"scripts.yaml", "scripts.yml"} and isinstance(body, dict):
        return bool(SCRIPT_SHAPE_KEYS & set(body.keys()))
    return False


def _object_name(raw_name: Any, raw: Any) -> str:
    if isinstance(raw, dict):
        for key in ("alias", "id", "name"):
            value = raw.get(key)
            if isinstance(value, str) and value:
                return value
    return str(raw_name)


def _chunk_id(source_path: Path, source_path_label: str) -> str:
    safe_path = re.sub(r"[^a-zA-Z0-9_.-]+", "_", source_path_label).strip("_")
    digest = stable_hash(f"{source_path}:{source_path_label}")[:12]
    return f"home_ha.{source_path.stem}.{safe_path}.{digest}"


def _build_chunk(
    source_path: Path,
    object_type: str,
    object_name: str,
    source_path_label: str,
    raw: Any,
    package: str | None = None,
) -> KnowledgeChunk:
    plain_raw = redact_value(to_plain(raw))
    entities = extract_entities(raw)
    services = extract_services(raw)
    domains = extract_domains(raw, object_type)
    rooms = extract_rooms(raw, source_path)
    tags = extract_tags(raw)
    if package:
        tags.append(f"package:{package}")
    if object_type in {"automation", "blueprint", "script"}:
        tags.append("action_surface")
    if object_type in REFERENCE_OBJECT_TYPES:
        tags.append("reference")

    summary = [
        f"Home Assistant {object_type} `{object_name}`.",
        f"Source path: {source_path_label}.",
    ]
    if package:
        summary.append(f"Package: {package}.")
    if entities:
        summary.append(f"Entities: {', '.join(entities)}.")
    if services:
        summary.append(f"Service/action calls: {', '.join(services)}.")
    if rooms:
        summary.append(f"Rooms: {', '.join(rooms)}.")

    text = "\n".join(summary) + f"\n\nRaw object:\n{plain_raw}"
    return KnowledgeChunk(
        chunk_id=_chunk_id(source_path, source_path_label),
        collection=collection_for_home_assistant_object(object_type),
        text=text,
        source_type="home_assistant",
        source_file=source_file_label(source_path),
        source_path=source_path_label,
        entities=entities,
        rooms=rooms,
        domains=domains,
        services=services,
        tags=tags,
        provenance={
            "loader": "home_assistant_yaml",
            "package": package,
            "object_type": object_type,
            "object_name": object_name,
        },
        raw=plain_raw,
    )


def _iter_section_items(section_body: Any) -> list[tuple[str, Any]]:
    if isinstance(section_body, dict):
        return [(str(name), raw) for name, raw in section_body.items()]
    if isinstance(section_body, list):
        return [(str(index), raw) for index, raw in enumerate(section_body)]
    return [("value", section_body)]


def _chunk_blueprint(source_path: Path, data: dict[str, Any]) -> list[KnowledgeChunk]:
    blueprint = data.get("blueprint") if isinstance(data.get("blueprint"), dict) else {}
    object_name = blueprint.get("name", source_path.stem)
    return [
        _build_chunk(
            source_path=source_path,
            object_type="blueprint",
            object_name=str(object_name),
            source_path_label=f"blueprint.{object_name}",
            raw=data,
        )
    ]


def _chunk_direct_sections(source_path: Path, data: dict[str, Any]) -> list[KnowledgeChunk]:
    chunks: list[KnowledgeChunk] = []
    for section, section_body in data.items():
        if section in DIRECT_CONFIG_SECTIONS:
            for raw_name, raw in _iter_section_items(section_body):
                object_name = _object_name(raw_name, raw)
                chunks.append(
                    _build_chunk(
                        source_path=source_path,
                        object_type=section,
                        object_name=object_name,
                        source_path_label=f"{section}.{raw_name}",
                        raw=raw,
                    )
                )
        elif infer_top_level_script(section, section_body, source_path):
            object_name = _object_name(section, section_body)
            chunks.append(
                _build_chunk(
                    source_path=source_path,
                    object_type="script",
                    object_name=object_name,
                    source_path_label=f"script.{section}",
                    raw=section_body,
                )
            )
    return chunks


def _chunk_package_sections(source_path: Path, data: dict[str, Any]) -> list[KnowledgeChunk]:
    chunks: list[KnowledgeChunk] = []
    for package_name, package_body in data.items():
        if not isinstance(package_body, dict):
            continue
        for section, section_body in package_body.items():
            if section not in DIRECT_CONFIG_SECTIONS:
                continue
            for raw_name, raw in _iter_section_items(section_body):
                object_name = _object_name(raw_name, raw)
                chunks.append(
                    _build_chunk(
                        source_path=source_path,
                        object_type=section,
                        object_name=object_name,
                        source_path_label=f"{package_name}.{section}.{raw_name}",
                        raw=raw,
                        package=str(package_name),
                    )
                )
    return chunks


def chunk_home_assistant_yaml(path: str | Path) -> list[KnowledgeChunk]:
    if yaml is None:
        raise RuntimeError("PyYAML is required. Install with: pip install pyyaml")

    source_path = Path(path)
    data = yaml.load(source_path.read_text(encoding="utf-8"), Loader=HomeAssistantLoader) or {}
    if not isinstance(data, dict):
        return []

    if "blueprint" in data:
        return _chunk_blueprint(source_path, data)

    direct_chunks = _chunk_direct_sections(source_path, data)
    if direct_chunks:
        return direct_chunks

    return _chunk_package_sections(source_path, data)

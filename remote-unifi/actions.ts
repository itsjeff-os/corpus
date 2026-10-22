import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UniFiClient } from "../services/unifi.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerActionTools(server: McpServer, client: UniFiClient) {

  // ── DEVICE ACTIONS ──────────────────────────────────────────────────────────

  server.registerTool("unifi_restart_device", {
    title: "Restart Device",
    description: "Restart an adopted UniFi device (AP, switch, gateway). Use unifi_list_devices to get the device UUID first.",
    inputSchema: { deviceId: z.string().describe("Device UUID") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ deviceId }) =>
    ok(await client.site(`/devices/${deviceId}/actions`, "POST", { action: "RESTART" })));

  server.registerTool("unifi_power_cycle_port", {
    title: "Power Cycle PoE Port",
    description: "Power-cycle a PoE port on a UniFi switch. Useful for resetting hung devices.",
    inputSchema: {
      deviceId: z.string().describe("Switch device UUID"),
      portIdx:  z.number().int().min(1).describe("Port index (1-based)"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ deviceId, portIdx }) =>
    ok(await client.site(`/devices/${deviceId}/interfaces/ports/${portIdx}/actions`, "POST", { action: "POWER_CYCLE" })));

  server.registerTool("unifi_adopt_devices", {
    title: "Adopt Devices",
    description: "Adopt one or more pending devices into the site. Get device UUIDs from unifi_list_pending_devices.",
    inputSchema: {
      deviceIds: z.array(z.string()).min(1).describe("Array of device UUIDs to adopt"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ deviceIds }) =>
    ok(await client.site("/devices", "POST", { deviceIds })));

  // ── CLIENT ACTIONS ──────────────────────────────────────────────────────────

  server.registerTool("unifi_block_client", {
    title: "Block Client",
    description: "Block a client from the network by MAC address (legacy API — works for any client type).",
    inputSchema: { mac: z.string().describe("Client MAC address e.g. aa:bb:cc:dd:ee:ff") },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ mac }) =>
    ok(await client.legacyCmd("stamgr", "block-sta", { mac })));

  server.registerTool("unifi_unblock_client", {
    title: "Unblock Client",
    description: "Unblock a previously blocked client by MAC address (legacy API).",
    inputSchema: { mac: z.string().describe("Client MAC address") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ mac }) =>
    ok(await client.legacyCmd("stamgr", "unblock-sta", { mac })));

  server.registerTool("unifi_kick_client", {
    title: "Kick Client",
    description: "Forcibly disconnect a client from the network (they can reconnect). Useful for forcing a re-auth or channel switch.",
    inputSchema: { mac: z.string().describe("Client MAC address") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ mac }) =>
    ok(await client.legacyCmd("stamgr", "kick-sta", { mac })));

  server.registerTool("unifi_reconnect_client", {
    title: "Reconnect Client",
    description: "Force a client to reconnect (kick + allow immediate reconnect). Useful for applying new VLAN assignments.",
    inputSchema: { mac: z.string().describe("Client MAC address") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ mac }) =>
    ok(await client.legacyCmd("stamgr", "kick-sta", { mac })));

  server.registerTool("unifi_authorize_guest", {
    title: "Authorize Guest Client",
    description: "Authorize a guest client with optional time, data, and rate limits. Cancels existing authorization.",
    inputSchema: {
      clientId:             z.string().describe("Client UUID from unifi_list_clients"),
      timeLimitMinutes:     z.number().int().min(1).max(1000000).optional().describe("Session time limit"),
      rxRateLimitKbps:      z.number().int().min(2).max(100000).optional().describe("Download rate limit kbps"),
      txRateLimitKbps:      z.number().int().min(2).max(100000).optional().describe("Upload rate limit kbps"),
      dataUsageLimitMBytes: z.number().int().min(1).max(1048576).optional().describe("Data cap in MB"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ clientId, ...limits }) =>
    ok(await client.site(`/clients/${clientId}/actions`, "POST", {
      action: "AUTHORIZE_GUEST_ACCESS",
      ...limits,
    })));

  server.registerTool("unifi_unauthorize_guest", {
    title: "Unauthorize Guest Client",
    description: "Revoke guest network access for a client.",
    inputSchema: { clientId: z.string().describe("Client UUID") },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ clientId }) =>
    ok(await client.site(`/clients/${clientId}/actions`, "POST", { action: "UNAUTHORIZE_GUEST_ACCESS" })));

  server.registerTool("unifi_set_client_name", {
    title: "Set Client Name / Alias",
    description: "Set a friendly name/alias for a client device (legacy API).",
    inputSchema: {
      mac:  z.string().describe("Client MAC address"),
      name: z.string().min(1).describe("Friendly name/alias"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ mac, name }) =>
    ok(await client.legacy(`/upd/user/${mac}`, "PUT", { name })));

  // ── WIFI ────────────────────────────────────────────────────────────────────

  server.registerTool("unifi_create_wifi", {
    title: "Create WiFi Broadcast",
    description: `Create a new WiFi SSID. Get networkId from unifi_list_networks first.
Security types: OPEN (no password) or WPA2 (requires password).
Type: STANDARD for regular WiFi, IOT_OPTIMIZED for smart home devices.`,
    inputSchema: {
      name:                   z.string().min(1).max(32).describe("SSID name"),
      networkId:              z.string().describe("Network UUID to associate this SSID with"),
      type:                   z.enum(["STANDARD", "IOT_OPTIMIZED"]).default("STANDARD"),
      enabled:                z.boolean().default(true),
      securityType:           z.enum(["OPEN", "WPA2"]).default("WPA2"),
      password:               z.string().min(8).optional().describe("Required for WPA2"),
      clientIsolationEnabled: z.boolean().default(false).describe("Prevent clients from talking to each other"),
      hideName:               z.boolean().default(false).describe("Hide SSID from broadcasts"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ name, networkId, type, enabled, securityType, password, clientIsolationEnabled, hideName }) =>
    ok(await client.site("/wifi/broadcasts", "POST", {
      name, type, enabled, hideName, clientIsolationEnabled,
      channel2gLockedTo6: false,
      dtimPeriod2gLockedTo3: false,
      multicastToUnicastConversionEnabled: false,
      uapsdEnabled: false,
      network: { id: networkId },
      securityConfiguration: securityType === "OPEN"
        ? { type: "OPEN" }
        : { type: "WPA2", password },
    })));

  server.registerTool("unifi_delete_wifi", {
    title: "Delete WiFi Broadcast",
    description: "Delete a WiFi SSID. Get wifiBroadcastId from unifi_list_wifi_broadcasts.",
    inputSchema: { wifiBroadcastId: z.string().describe("WiFi broadcast UUID") },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ wifiBroadcastId }) =>
    ok(await client.site(`/wifi/broadcasts/${wifiBroadcastId}`, "DELETE")));

  server.registerTool("unifi_toggle_wifi", {
    title: "Enable/Disable WiFi Broadcast",
    description: "Enable or disable a WiFi SSID without deleting it.",
    inputSchema: {
      wifiBroadcastId: z.string().describe("WiFi broadcast UUID"),
      enabled:         z.boolean().describe("true to enable, false to disable"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ wifiBroadcastId, enabled }) =>
    ok(await client.site(`/wifi/broadcasts/${wifiBroadcastId}`, "PUT", { enabled })));

  // ── FIREWALL ────────────────────────────────────────────────────────────────

  server.registerTool("unifi_create_firewall_policy", {
    title: "Create Firewall Policy",
    description: `Create a firewall policy between two zones.
ALWAYS call unifi_list_firewall_zones first to get zone UUIDs.
Action types: ALLOW (optionally with return traffic), BLOCK, REJECT.
Supports scheduling: EVERY_DAY or EVERY_WEEK with time windows in HH:MM 24h format.`,
    inputSchema: {
      name:               z.string().min(1).describe("Policy name"),
      description:        z.string().optional(),
      enabled:            z.boolean().default(true),
      actionType:         z.enum(["ALLOW", "BLOCK", "REJECT"]),
      allowReturnTraffic: z.boolean().optional().describe("ALLOW only — auto-create reverse rule"),
      sourceZoneId:       z.string().describe("Source firewall zone UUID"),
      destinationZoneId:  z.string().describe("Destination firewall zone UUID"),
      ipVersion:          z.enum(["IPV4", "IPV6", "IPV4_AND_IPV6"]).default("IPV4"),
      scheduleMode:       z.enum(["EVERY_DAY", "EVERY_WEEK"]).optional().describe("Omit for always-active"),
      scheduleDays:       z.array(z.enum(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"])).optional(),
      scheduleStartTime:  z.string().regex(/^\d{2}:\d{2}$/).optional().describe("HH:MM 24h"),
      scheduleStopTime:   z.string().regex(/^\d{2}:\d{2}$/).optional().describe("HH:MM 24h"),
      loggingEnabled:     z.boolean().default(false),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ name, description, enabled, actionType, allowReturnTraffic, sourceZoneId, destinationZoneId, ipVersion, scheduleMode, scheduleDays, scheduleStartTime, scheduleStopTime, loggingEnabled }) => {
    const action = actionType === "ALLOW"
      ? { type: "ALLOW", allowReturnTraffic: allowReturnTraffic ?? true }
      : { type: actionType };

    const timeFilter = scheduleStartTime && scheduleStopTime
      ? { startTime: scheduleStartTime, stopTime: scheduleStopTime }
      : undefined;

    const schedule = scheduleMode === "EVERY_DAY"
      ? { mode: "EVERY_DAY", ...(timeFilter && { timeFilter }) }
      : scheduleMode === "EVERY_WEEK"
      ? { mode: "EVERY_WEEK", repeatOnDays: scheduleDays, ...(timeFilter && { timeFilter }) }
      : undefined;

    return ok(await client.site("/firewall/policies", "POST", {
      name, description, enabled, loggingEnabled, action,
      source:          { zoneId: sourceZoneId },
      destination:     { zoneId: destinationZoneId },
      ipProtocolScope: { ipVersion },
      ...(schedule && { schedule }),
    }));
  });

  server.registerTool("unifi_delete_firewall_policy", {
    title: "Delete Firewall Policy",
    description: "Delete a firewall policy. Get firewallPolicyId from unifi_list_firewall_policies.",
    inputSchema: { firewallPolicyId: z.string().describe("Firewall policy UUID") },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ firewallPolicyId }) =>
    ok(await client.site(`/firewall/policies/${firewallPolicyId}`, "DELETE")));

  server.registerTool("unifi_toggle_firewall_policy", {
    title: "Enable/Disable Firewall Policy",
    description: "Enable or disable a firewall policy without deleting it.",
    inputSchema: {
      firewallPolicyId: z.string().describe("Firewall policy UUID"),
      enabled:          z.boolean(),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ firewallPolicyId, enabled }) =>
    ok(await client.site(`/firewall/policies/${firewallPolicyId}`, "PATCH", { enabled })));

  server.registerTool("unifi_create_firewall_zone", {
    title: "Create Firewall Zone",
    description: "Create a custom firewall zone. Default zones (LAN, WAN, etc.) are created automatically.",
    inputSchema: { name: z.string().min(1).describe("Zone name") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ name }) =>
    ok(await client.site("/firewall/zones", "POST", { name })));

  // ── ACL ─────────────────────────────────────────────────────────────────────

  server.registerTool("unifi_create_acl_rule", {
    title: "Create ACL Rule",
    description: "Create an ACL rule for switch-level traffic control (layer 2/3). Type IPV4 or MAC.",
    inputSchema: {
      name:        z.string().min(1),
      description: z.string().optional(),
      action:      z.enum(["ALLOW", "BLOCK"]),
      type:        z.enum(["IPV4", "MAC"]),
      enabled:     z.boolean().default(true),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) =>
    ok(await client.site("/acl-rules", "POST", params)));

  server.registerTool("unifi_delete_acl_rule", {
    title: "Delete ACL Rule",
    description: "Delete an ACL rule. Get aclRuleId from unifi_list_acl_rules.",
    inputSchema: { aclRuleId: z.string() },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ aclRuleId }) =>
    ok(await client.site(`/acl-rules/${aclRuleId}`, "DELETE")));

  // ── DNS ─────────────────────────────────────────────────────────────────────

  server.registerTool("unifi_create_dns_policy", {
    title: "Create DNS Policy",
    description: "Create a local DNS record or domain forwarding policy.",
    inputSchema: {
      type:    z.enum(["A_RECORD","AAAA_RECORD","CNAME_RECORD","MX_RECORD","SRV_RECORD","TXT_RECORD","FORWARD_DOMAIN"]),
      domain:  z.string().min(1).describe("Domain name e.g. mydevice.local"),
      enabled: z.boolean().default(true),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) =>
    ok(await client.site("/dns/policies", "POST", params)));

  server.registerTool("unifi_delete_dns_policy", {
    title: "Delete DNS Policy",
    description: "Delete a DNS policy. Get dnsPolicyId from unifi_list_dns_policies.",
    inputSchema: { dnsPolicyId: z.string() },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ dnsPolicyId }) =>
    ok(await client.site(`/dns/policies/${dnsPolicyId}`, "DELETE")));

  // ── TRAFFIC MATCHING ────────────────────────────────────────────────────────

  server.registerTool("unifi_create_traffic_matching_list", {
    title: "Create Traffic Matching List",
    description: "Create a named list of IPs or ports for use as firewall policy targets.",
    inputSchema: {
      name: z.string().min(1),
      type: z.enum(["IPV4_ADDRESSES", "IPV6_ADDRESSES", "PORTS"]),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (params) =>
    ok(await client.site("/traffic-matching-lists", "POST", params)));

  server.registerTool("unifi_delete_traffic_matching_list", {
    title: "Delete Traffic Matching List",
    description: "Delete a traffic matching list.",
    inputSchema: { trafficMatchingListId: z.string() },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ trafficMatchingListId }) =>
    ok(await client.site(`/traffic-matching-lists/${trafficMatchingListId}`, "DELETE")));

  // ── LEGACY EXTRAS ───────────────────────────────────────────────────────────

  server.registerTool("unifi_forget_client", {
    title: "Forget Client",
    description: "Remove a client from history entirely (legacy API). The client can rejoin as new.",
    inputSchema: {
      macs: z.array(z.string()).min(1).describe("Array of MAC addresses to forget"),
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ macs }) =>
    ok(await client.legacyCmd("stamgr", "forget-sta", { macs })));

  server.registerTool("unifi_upgrade_device", {
    title: "Upgrade Device Firmware",
    description: "Trigger a firmware upgrade for a device (legacy API). Device will reboot after upgrade.",
    inputSchema: { mac: z.string().describe("Device MAC address") },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ mac }) =>
    ok(await client.legacyCmd("devmgr", "upgrade", { mac })));

  server.registerTool("unifi_locate_device", {
    title: "Locate Device (LED Flash)",
    description: "Flash a device's LED to physically locate it. Toggle the locate mode.",
    inputSchema: {
      mac:    z.string().describe("Device MAC address"),
      enable: z.boolean().describe("true to start flashing, false to stop"),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ mac, enable }) =>
    ok(await client.legacyCmd("devmgr", enable ? "set-locate" : "unset-locate", { mac })));
}

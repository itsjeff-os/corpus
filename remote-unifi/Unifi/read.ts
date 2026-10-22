import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UniFiClient } from "../services/unifi.js";

function ok(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function registerReadTools(server: McpServer, client: UniFiClient) {

  server.registerTool("unifi_get_site_info", {
    title: "Get Site Info",
    description: "Get UniFi application and controller info.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.v1("/info")));

  server.registerTool("unifi_list_devices", {
    title: "List Devices",
    description: "List all adopted UniFi devices (APs, switches, gateways) with status, uptime, and firmware.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/devices")));

  server.registerTool("unifi_get_device", {
    title: "Get Device",
    description: "Get full details for a single adopted device by UUID.",
    inputSchema: { deviceId: z.string().describe("Device UUID from unifi_list_devices") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ deviceId }) => ok(await client.site(`/devices/${deviceId}`)));

  server.registerTool("unifi_get_device_stats", {
    title: "Get Device Statistics",
    description: "Get latest statistics for a device — throughput, CPU, memory, radio stats.",
    inputSchema: { deviceId: z.string().describe("Device UUID") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ deviceId }) => ok(await client.site(`/devices/${deviceId}/statistics/latest`)));

  server.registerTool("unifi_list_clients", {
    title: "List Connected Clients",
    description: "List all currently connected clients with IP, MAC, SSID, signal, and throughput.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/clients")));

  server.registerTool("unifi_get_client", {
    title: "Get Client Details",
    description: "Get full details for a single connected client by UUID.",
    inputSchema: { clientId: z.string().describe("Client UUID from unifi_list_clients") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ clientId }) => ok(await client.site(`/clients/${clientId}`)));

  server.registerTool("unifi_get_client_history", {
    title: "Get Client History",
    description: "Get connection history for a client by MAC address (legacy API — richer historical data).",
    inputSchema: { mac: z.string().describe("Client MAC address e.g. aa:bb:cc:dd:ee:ff") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ mac }) => ok(await client.legacy(`/stat/user/${mac}`)));

  server.registerTool("unifi_list_wans", {
    title: "List WAN Interfaces",
    description: "Get WAN interface details — IPs, uptime, ISP info.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/wans")));

  server.registerTool("unifi_get_wan_health", {
    title: "Get WAN Health",
    description: "Get WAN health stats including uptime, latency, and packet loss (legacy API).",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.legacy("/stat/health")));

  server.registerTool("unifi_list_networks", {
    title: "List Networks",
    description: "List all networks (VLANs, subnets, corporate, guest, IoT).",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/networks")));

  server.registerTool("unifi_get_network", {
    title: "Get Network Details",
    description: "Get full details for a single network by UUID.",
    inputSchema: { networkId: z.string().describe("Network UUID") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ networkId }) => ok(await client.site(`/networks/${networkId}`)));

  server.registerTool("unifi_list_wifi_broadcasts", {
    title: "List WiFi Broadcasts",
    description: "List all WiFi SSIDs/broadcasts with security config, client isolation, and schedule.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/wifi/broadcasts")));

  server.registerTool("unifi_list_firewall_policies", {
    title: "List Firewall Policies",
    description: "List all firewall policies with zones, actions, and schedules.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/firewall/policies")));

  server.registerTool("unifi_list_firewall_zones", {
    title: "List Firewall Zones",
    description: "List firewall zones. Required before creating firewall policies — you need zone UUIDs.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/firewall/zones")));

  server.registerTool("unifi_list_acl_rules", {
    title: "List ACL Rules",
    description: "List all ACL rules (layer 2/3 switch-level traffic control).",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/acl-rules")));

  server.registerTool("unifi_list_dns_policies", {
    title: "List DNS Policies",
    description: "List DNS policies — A, AAAA, CNAME, MX, SRV, TXT records and domain forwarding.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/dns/policies")));

  server.registerTool("unifi_list_dpi_apps", {
    title: "List DPI Applications",
    description: "List all DPI-recognised applications. Use IDs for traffic matching and firewall destination filters.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.v1("/dpi/applications")));

  server.registerTool("unifi_list_dpi_categories", {
    title: "List DPI Categories",
    description: "List DPI application categories (e.g. Streaming, Gaming, Social).",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.v1("/dpi/categories")));

  server.registerTool("unifi_list_traffic_matching_lists", {
    title: "List Traffic Matching Lists",
    description: "List traffic matching lists (IP ranges, ports) used as firewall policy targets.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/traffic-matching-lists")));

  server.registerTool("unifi_list_pending_devices", {
    title: "List Pending Devices",
    description: "List devices detected on the network but not yet adopted.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.v1("/pending-devices")));

  server.registerTool("unifi_list_vpn_servers", {
    title: "List VPN Servers",
    description: "List VPN server configs.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/vpn/servers")));

  server.registerTool("unifi_list_vpn_tunnels", {
    title: "List VPN Tunnels",
    description: "List site-to-site VPN tunnels.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.site("/vpn/site-to-site-tunnels")));

  server.registerTool("unifi_get_alerts", {
    title: "Get Alerts",
    description: "Get recent alerts and alarms from the controller (legacy API).",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.legacy("/stat/alarm")));

  server.registerTool("unifi_get_events", {
    title: "Get Events",
    description: "Get recent network events — client connects, disconnects, auth failures (legacy API).",
    inputSchema: {
      limit: z.number().int().min(1).max(500).default(100).describe("Number of events to return"),
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ limit }) => ok(await client.legacy(`/stat/event?_limit=${limit}`)));

  server.registerTool("unifi_get_site_stats", {
    title: "Get Site Statistics",
    description: "Get aggregate site stats — total clients, throughput, satisfaction score (legacy API).",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.legacy("/stat/sysinfo")));

  server.registerTool("unifi_get_rogues", {
    title: "Get Rogue APs",
    description: "Get detected rogue/neighbouring access points.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async () => ok(await client.legacy("/stat/rogueap")));
}

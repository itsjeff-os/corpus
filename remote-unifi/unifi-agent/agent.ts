import Anthropic from "@anthropic-ai/sdk";

// ── Config ─────────────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;
const UNIFI_CONTROLLER  = process.env.UNIFI_CONTROLLER ?? "https://192.168.1.1";
const UNIFI_API_KEY     = process.env.UNIFI_API_KEY!;
const UNIFI_SITE_ID     = process.env.UNIFI_SITE_ID ?? "default"; // UUID of your site

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── UniFi v1 API ───────────────────────────────────────────────────────────────
async function unifi<T = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const res = await fetch(`${UNIFI_CONTROLLER}${path}`, {
    method,
    headers: {
      "X-API-Key":    UNIFI_API_KEY,
      "Content-Type": "application/json",
      "Accept":       "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`UniFi ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.status === 204 ? (null as T) : res.json();
}

const site = (path: string) => `/v1/sites/${UNIFI_SITE_ID}${path}`;

// ── Tool implementations ───────────────────────────────────────────────────────
type ToolInput = Record<string, unknown>;

const tools: Record<string, (input: ToolInput) => Promise<unknown>> = {

  // ── READ ──────────────────────────────────────────────────────────────────
  get_site_info: async () =>
    unifi("/v1/info"),

  get_devices: async () =>
    unifi(site("/devices")),

  get_device: async ({ deviceId }: ToolInput) =>
    unifi(site(`/devices/${deviceId}`)),

  get_device_stats: async ({ deviceId }: ToolInput) =>
    unifi(site(`/devices/${deviceId}/statistics/latest`)),

  get_clients: async () =>
    unifi(site("/clients")),

  get_client: async ({ clientId }: ToolInput) =>
    unifi(site(`/clients/${clientId}`)),

  get_wans: async () =>
    unifi(site("/wans")),

  get_networks: async () =>
    unifi(site("/networks")),

  get_network: async ({ networkId }: ToolInput) =>
    unifi(site(`/networks/${networkId}`)),

  get_wifi_broadcasts: async () =>
    unifi(site("/wifi/broadcasts")),

  get_firewall_policies: async () =>
    unifi(site("/firewall/policies")),

  get_firewall_zones: async () =>
    unifi(site("/firewall/zones")),

  get_acl_rules: async () =>
    unifi(site("/acl-rules")),

  get_dns_policies: async () =>
    unifi(site("/dns/policies")),

  get_dpi_applications: async () =>
    unifi("/v1/dpi/applications"),

  get_dpi_categories: async () =>
    unifi("/v1/dpi/categories"),

  get_traffic_matching_lists: async () =>
    unifi(site("/traffic-matching-lists")),

  get_pending_devices: async () =>
    unifi("/v1/pending-devices"),

  get_vpn_servers: async () =>
    unifi(site("/vpn/servers")),

  get_vpn_tunnels: async () =>
    unifi(site("/vpn/site-to-site-tunnels")),

  // ── DEVICE ACTIONS ────────────────────────────────────────────────────────
  restart_device: async ({ deviceId }: ToolInput) =>
    unifi(site(`/devices/${deviceId}/actions`), "POST", { action: "RESTART" }),

  power_cycle_port: async ({ deviceId, portIdx }: ToolInput) =>
    unifi(site(`/devices/${deviceId}/interfaces/ports/${portIdx}/actions`), "POST", {
      action: "POWER_CYCLE",
    }),

  adopt_device: async ({ deviceIds }: ToolInput) =>
    unifi(site("/devices"), "POST", { deviceIds }),

  // ── CLIENT ACTIONS ────────────────────────────────────────────────────────
  authorize_guest: async ({ clientId, timeLimitMinutes, rxRateLimitKbps, txRateLimitKbps, dataUsageLimitMBytes }: ToolInput) =>
    unifi(site(`/clients/${clientId}/actions`), "POST", {
      action: "AUTHORIZE_GUEST_ACCESS",
      ...(timeLimitMinutes   && { timeLimitMinutes }),
      ...(rxRateLimitKbps   && { rxRateLimitKbps }),
      ...(txRateLimitKbps   && { txRateLimitKbps }),
      ...(dataUsageLimitMBytes && { dataUsageLimitMBytes }),
    }),

  unauthorize_guest: async ({ clientId }: ToolInput) =>
    unifi(site(`/clients/${clientId}/actions`), "POST", {
      action: "UNAUTHORIZE_GUEST_ACCESS",
    }),

  // ── WIFI ─────────────────────────────────────────────────────────────────
  create_wifi_broadcast: async ({ name, type, networkId, enabled, securityType, password, clientIsolationEnabled, hideName }: ToolInput) =>
    unifi(site("/wifi/broadcasts"), "POST", {
      name,
      type:                    type ?? "STANDARD",
      enabled:                 enabled ?? true,
      hideName:                hideName ?? false,
      clientIsolationEnabled:  clientIsolationEnabled ?? false,
      channel2gLockedTo6:      false,
      dtimPeriod2gLockedTo3:   false,
      multicastToUnicastConversionEnabled: false,
      uapsdEnabled:            false,
      network:                 { id: networkId },
      securityConfiguration:   securityType === "OPEN"
        ? { type: "OPEN" }
        : { type: "WPA2", password },
    }),

  update_wifi_broadcast: async ({ wifiBroadcastId, ...fields }: ToolInput) =>
    unifi(site(`/wifi/broadcasts/${wifiBroadcastId}`), "PUT", fields),

  delete_wifi_broadcast: async ({ wifiBroadcastId }: ToolInput) =>
    unifi(site(`/wifi/broadcasts/${wifiBroadcastId}`), "DELETE"),

  // ── FIREWALL ──────────────────────────────────────────────────────────────
  create_firewall_policy: async ({
    name, description, enabled, actionType, allowReturnTraffic,
    sourceZoneId, destinationZoneId, ipVersion,
    scheduleMode, scheduleDays, scheduleStartTime, scheduleStopTime,
    loggingEnabled,
  }: ToolInput) => {
    const action = actionType === "ALLOW"
      ? { type: "ALLOW", allowReturnTraffic: allowReturnTraffic ?? true }
      : actionType === "REJECT"
      ? { type: "REJECT" }
      : { type: "BLOCK" };

    const schedule = scheduleMode === "EVERY_DAY"
      ? { mode: "EVERY_DAY", timeFilter: scheduleStartTime ? { startTime: scheduleStartTime, stopTime: scheduleStopTime } : undefined }
      : scheduleMode === "EVERY_WEEK"
      ? { mode: "EVERY_WEEK", repeatOnDays: scheduleDays, timeFilter: scheduleStartTime ? { startTime: scheduleStartTime, stopTime: scheduleStopTime } : undefined }
      : undefined;

    return unifi(site("/firewall/policies"), "POST", {
      name,
      description,
      enabled:         enabled ?? true,
      loggingEnabled:  loggingEnabled ?? false,
      action,
      source:          { zoneId: sourceZoneId },
      destination:     { zoneId: destinationZoneId },
      ipProtocolScope: { ipVersion: ipVersion ?? "IPV4" },
      ...(schedule && { schedule }),
    });
  },

  update_firewall_policy: async ({ firewallPolicyId, ...fields }: ToolInput) =>
    unifi(site(`/firewall/policies/${firewallPolicyId}`), "PATCH", fields),

  delete_firewall_policy: async ({ firewallPolicyId }: ToolInput) =>
    unifi(site(`/firewall/policies/${firewallPolicyId}`), "DELETE"),

  create_firewall_zone: async ({ name }: ToolInput) =>
    unifi(site("/firewall/zones"), "POST", { name }),

  // ── ACL ───────────────────────────────────────────────────────────────────
  create_acl_rule: async ({ name, description, action, type, enabled }: ToolInput) =>
    unifi(site("/acl-rules"), "POST", {
      name, description,
      action:  action ?? "BLOCK",
      type:    type   ?? "IPV4",
      enabled: enabled ?? true,
    }),

  delete_acl_rule: async ({ aclRuleId }: ToolInput) =>
    unifi(site(`/acl-rules/${aclRuleId}`), "DELETE"),

  // ── DNS ───────────────────────────────────────────────────────────────────
  create_dns_policy: async ({ type, domain, enabled }: ToolInput) =>
    unifi(site("/dns/policies"), "POST", { type, domain, enabled: enabled ?? true }),

  delete_dns_policy: async ({ dnsPolicyId }: ToolInput) =>
    unifi(site(`/dns/policies/${dnsPolicyId}`), "DELETE"),

  // ── TRAFFIC MATCHING ──────────────────────────────────────────────────────
  create_traffic_matching_list: async ({ name, type }: ToolInput) =>
    unifi(site("/traffic-matching-lists"), "POST", { name, type }),

  delete_traffic_matching_list: async ({ trafficMatchingListId }: ToolInput) =>
    unifi(site(`/traffic-matching-lists/${trafficMatchingListId}`), "DELETE"),
};

// ── Claude tool definitions ────────────────────────────────────────────────────
const toolDefinitions: Anthropic.Tool[] = [
  // READ
  { name: "get_site_info",             description: "Get UniFi application/controller info",                          input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_devices",               description: "List all adopted devices (APs, switches, gateways) with status", input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_device",                description: "Get a single device's full details",                             input_schema: { type: "object" as const, properties: { deviceId: { type: "string" } }, required: ["deviceId"] } },
  { name: "get_device_stats",          description: "Get latest statistics for a device (throughput, CPU, memory)",   input_schema: { type: "object" as const, properties: { deviceId: { type: "string" } }, required: ["deviceId"] } },
  { name: "get_clients",               description: "List all currently connected clients",                           input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_client",                description: "Get a single connected client's details",                        input_schema: { type: "object" as const, properties: { clientId: { type: "string" } }, required: ["clientId"] } },
  { name: "get_wans",                  description: "Get WAN interface info — uptime, IPs, health",                   input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_networks",              description: "List all networks (VLANs, subnets)",                             input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_network",               description: "Get a single network's details",                                 input_schema: { type: "object" as const, properties: { networkId: { type: "string" } }, required: ["networkId"] } },
  { name: "get_wifi_broadcasts",       description: "List all WiFi SSIDs and their config",                           input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_firewall_policies",     description: "List all firewall policies",                                     input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_firewall_zones",        description: "List firewall zones (needed for source/destination in policies)", input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_acl_rules",             description: "List all ACL rules",                                             input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_dns_policies",          description: "List DNS policies (A, AAAA, CNAME, forward domain, etc.)",       input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_dpi_applications",      description: "List all DPI-recognised applications (for traffic matching)",    input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_dpi_categories",        description: "List DPI application categories",                                input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_traffic_matching_lists",description: "List traffic matching lists",                                    input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_pending_devices",       description: "List devices pending adoption",                                  input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_vpn_servers",           description: "List VPN servers",                                               input_schema: { type: "object" as const, properties: {}, required: [] } },
  { name: "get_vpn_tunnels",           description: "List site-to-site VPN tunnels",                                  input_schema: { type: "object" as const, properties: {}, required: [] } },

  // DEVICE ACTIONS
  {
    name: "restart_device",
    description: "Restart a UniFi device",
    input_schema: { type: "object" as const, properties: { deviceId: { type: "string", description: "Device UUID" } }, required: ["deviceId"] },
  },
  {
    name: "power_cycle_port",
    description: "Power-cycle a PoE port on a switch",
    input_schema: { type: "object" as const, properties: { deviceId: { type: "string" }, portIdx: { type: "number", description: "Port index (1-based)" } }, required: ["deviceId", "portIdx"] },
  },
  {
    name: "adopt_device",
    description: "Adopt pending devices into the site",
    input_schema: { type: "object" as const, properties: { deviceIds: { type: "array", items: { type: "string" }, description: "Array of device UUIDs to adopt" } }, required: ["deviceIds"] },
  },

  // CLIENT ACTIONS
  {
    name: "authorize_guest",
    description: "Authorize a guest client — optionally with time, data, and rate limits",
    input_schema: {
      type: "object" as const,
      properties: {
        clientId:            { type: "string" },
        timeLimitMinutes:    { type: "number", description: "Max 1000000" },
        rxRateLimitKbps:     { type: "number", description: "Download cap, max 100000" },
        txRateLimitKbps:     { type: "number", description: "Upload cap, max 100000" },
        dataUsageLimitMBytes:{ type: "number", description: "Data cap, max 1048576" },
      },
      required: ["clientId"],
    },
  },
  {
    name: "unauthorize_guest",
    description: "Revoke guest network access",
    input_schema: { type: "object" as const, properties: { clientId: { type: "string" } }, required: ["clientId"] },
  },

  // WIFI
  {
    name: "create_wifi_broadcast",
    description: "Create a new WiFi SSID/broadcast",
    input_schema: {
      type: "object" as const,
      properties: {
        name:                   { type: "string" },
        type:                   { type: "string", enum: ["STANDARD", "IOT_OPTIMIZED"], description: "Default STANDARD" },
        networkId:              { type: "string", description: "UUID of the network this SSID maps to" },
        enabled:                { type: "boolean" },
        securityType:           { type: "string", enum: ["OPEN", "WPA2"] },
        password:               { type: "string", description: "Required if securityType is WPA2" },
        clientIsolationEnabled: { type: "boolean" },
        hideName:               { type: "boolean" },
      },
      required: ["name", "networkId"],
    },
  },
  {
    name: "delete_wifi_broadcast",
    description: "Delete a WiFi SSID",
    input_schema: { type: "object" as const, properties: { wifiBroadcastId: { type: "string" } }, required: ["wifiBroadcastId"] },
  },

  // FIREWALL
  {
    name: "create_firewall_policy",
    description: "Create a firewall policy between two zones. Get zone IDs first with get_firewall_zones.",
    input_schema: {
      type: "object" as const,
      properties: {
        name:               { type: "string" },
        description:        { type: "string" },
        enabled:            { type: "boolean" },
        actionType:         { type: "string", enum: ["ALLOW", "BLOCK", "REJECT"] },
        allowReturnTraffic: { type: "boolean", description: "Only for ALLOW — auto-creates reverse rule" },
        sourceZoneId:       { type: "string", description: "UUID of source firewall zone" },
        destinationZoneId:  { type: "string", description: "UUID of destination firewall zone" },
        ipVersion:          { type: "string", enum: ["IPV4", "IPV6", "IPV4_AND_IPV6"], description: "Default IPV4" },
        scheduleMode:       { type: "string", enum: ["EVERY_DAY", "EVERY_WEEK"], description: "If omitted, policy is always active" },
        scheduleDays:       { type: "array", items: { type: "string", enum: ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"] } },
        scheduleStartTime:  { type: "string", description: "HH:MM 24h format" },
        scheduleStopTime:   { type: "string", description: "HH:MM 24h format" },
        loggingEnabled:     { type: "boolean" },
      },
      required: ["name", "actionType", "sourceZoneId", "destinationZoneId"],
    },
  },
  {
    name: "delete_firewall_policy",
    description: "Delete a firewall policy",
    input_schema: { type: "object" as const, properties: { firewallPolicyId: { type: "string" } }, required: ["firewallPolicyId"] },
  },
  {
    name: "create_firewall_zone",
    description: "Create a custom firewall zone",
    input_schema: { type: "object" as const, properties: { name: { type: "string" } }, required: ["name"] },
  },

  // ACL
  {
    name: "create_acl_rule",
    description: "Create an ACL rule (layer 2/3 traffic control on switches)",
    input_schema: {
      type: "object" as const,
      properties: {
        name:        { type: "string" },
        description: { type: "string" },
        action:      { type: "string", enum: ["ALLOW", "BLOCK"] },
        type:        { type: "string", enum: ["IPV4", "MAC"] },
        enabled:     { type: "boolean" },
      },
      required: ["name", "action", "type"],
    },
  },
  {
    name: "delete_acl_rule",
    description: "Delete an ACL rule",
    input_schema: { type: "object" as const, properties: { aclRuleId: { type: "string" } }, required: ["aclRuleId"] },
  },

  // DNS
  {
    name: "create_dns_policy",
    description: "Create a DNS policy (A, AAAA, CNAME, MX, SRV, TXT record, or domain forwarding)",
    input_schema: {
      type: "object" as const,
      properties: {
        type:    { type: "string", enum: ["A_RECORD","AAAA_RECORD","CNAME_RECORD","MX_RECORD","SRV_RECORD","TXT_RECORD","FORWARD_DOMAIN"] },
        domain:  { type: "string" },
        enabled: { type: "boolean" },
      },
      required: ["type", "domain"],
    },
  },
  {
    name: "delete_dns_policy",
    description: "Delete a DNS policy",
    input_schema: { type: "object" as const, properties: { dnsPolicyId: { type: "string" } }, required: ["dnsPolicyId"] },
  },

  // TRAFFIC MATCHING
  {
    name: "create_traffic_matching_list",
    description: "Create a traffic matching list (IP ranges, ports) for use in firewall policies",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string" },
        type: { type: "string", enum: ["IPV4_ADDRESSES", "IPV6_ADDRESSES", "PORTS"] },
      },
      required: ["name", "type"],
    },
  },
  {
    name: "delete_traffic_matching_list",
    description: "Delete a traffic matching list",
    input_schema: { type: "object" as const, properties: { trafficMatchingListId: { type: "string" } }, required: ["trafficMatchingListId"] },
  },
];

// ── System prompt ──────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a network operations agent with full read/write access to a UniFi Cloud Gateway via the official v1 API.

You are not a dashboard. You are not a helpdesk. You are an operator.

You have eyes on the network and hands on the controls. When something needs doing, you do it.

## Capabilities
- Full device inventory and stats
- Client monitoring and guest access control  
- WiFi SSID creation, modification, deletion
- Firewall policy management (zones, rules, schedules)
- ACL rules at the switch level
- DNS policy management
- Traffic matching lists
- VPN visibility
- DPI application/category data

## Operating principles
- Read first, act second — when executing writes, get current state before changing it
- Chain tools intelligently — e.g. get_firewall_zones before create_firewall_policy
- Be specific about what you did and what the result was
- Flag anomalies proactively — don't wait to be asked
- For scheduled rules, confirm the schedule back to the user clearly
- If something fails, say why and what you'd try instead

## Personality
Direct. Technically precise. Mildly opinionated. 
You notice things. You have a point of view on network hygiene.
You don't hedge. You don't over-explain. You execute.`;

// ── Agentic loop ───────────────────────────────────────────────────────────────
type Message = Anthropic.MessageParam;

async function runAgent(history: Message[], userMessage: string): Promise<string> {
  history.push({ role: "user", content: userMessage });

  while (true) {
    const response = await client.messages.create({
      model:      "claude-sonnet-4-6",
      max_tokens: 4096,
      system:     SYSTEM_PROMPT,
      tools:      toolDefinitions,
      messages:   history,
    });

    history.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "end_turn") {
      const text = response.content.find((b) => b.type === "text");
      return text && "text" in text ? text.text : "";
    }

    if (response.stop_reason === "tool_use") {
      const results: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== "tool_use") continue;
        const fn = tools[block.name];

        if (!fn) {
          results.push({ type: "tool_result", tool_use_id: block.id, content: `Unknown tool: ${block.name}`, is_error: true });
          continue;
        }

        try {
          const result = await fn(block.input as ToolInput);
          results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(result) });
        } catch (err) {
          results.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Error: ${err instanceof Error ? err.message : String(err)}`,
            is_error: true,
          });
        }
      }

      history.push({ role: "user", content: results });
    }
  }
}

// ── CLI ────────────────────────────────────────────────────────────────────────
async function main() {
  const { createInterface } = await import("readline");
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const history: Message[] = [];

  console.log("UniFi Agent v1 — spec-accurate, fully armed.\n");

  const loop = () => {
    rl.question("You: ", async (input) => {
      const trimmed = input.trim();
      if (!trimmed) return loop();
      if (trimmed === "exit") return rl.close();

      try {
        const reply = await runAgent(history, trimmed);
        console.log(`\nAgent: ${reply}\n`);
      } catch (err) {
        console.error(`\n[error] ${err instanceof Error ? err.message : err}\n`);
      }

      loop();
    });
  };

  loop();
}

main().catch(console.error);

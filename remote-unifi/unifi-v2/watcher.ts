import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UniFiClient } from "./services/unifi.js";

// ── Types ──────────────────────────────────────────────────────────────────────

export type EventSeverity = "info" | "warning" | "critical";

export interface NetworkEvent {
  id:        string;
  severity:  EventSeverity;
  category:  "wan" | "device" | "client" | "security" | "alert";
  title:     string;
  detail:    string;
  timestamp: string;
  raw?:      unknown;
}

interface WatcherConfig {
  intervalMs:          number; // poll interval, default 15s
  wanPacketLossWarn:   number; // % threshold for warning, default 2
  wanPacketLossCrit:   number; // % threshold for critical, default 10
  wanLatencyWarnMs:    number; // ms threshold for warning, default 80
  wanLatencyCritMs:    number; // ms threshold for critical, default 200
  knownClientMacs:     Set<string>; // populated from first poll, new MACs trigger events
  deviceStateCache:    Map<string, string>; // deviceId → status
  wanStateCache:       Map<string, string>; // wanId → status
  alertIdsSeen:        Set<string>;
  rogueApIdsSeen:      Set<string>;
}

// ── Watcher class ──────────────────────────────────────────────────────────────

export class UniFiWatcher {
  private timer:   ReturnType<typeof setInterval> | null = null;
  private started: boolean = false;
  private cfg:     WatcherConfig;

  // Subscribers — anything that wants live events
  private subscribers: Array<(event: NetworkEvent) => void> = [];

  constructor(
    private server: McpServer,
    private client: UniFiClient,
    opts: Partial<Pick<WatcherConfig,
      "intervalMs" | "wanPacketLossWarn" | "wanPacketLossCrit" |
      "wanLatencyWarnMs" | "wanLatencyCritMs"
    >> = {}
  ) {
    this.cfg = {
      intervalMs:         opts.intervalMs         ?? 15_000,
      wanPacketLossWarn:  opts.wanPacketLossWarn  ?? 2,
      wanPacketLossCrit:  opts.wanPacketLossCrit  ?? 10,
      wanLatencyWarnMs:   opts.wanLatencyWarnMs   ?? 80,
      wanLatencyCritMs:   opts.wanLatencyCritMs   ?? 200,
      knownClientMacs:    new Set(),
      deviceStateCache:   new Map(),
      wanStateCache:      new Map(),
      alertIdsSeen:       new Set(),
      rogueApIdsSeen:     new Set(),
    };
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  subscribe(fn: (event: NetworkEvent) => void): () => void {
    this.subscribers.push(fn);
    return () => { this.subscribers = this.subscribers.filter(s => s !== fn); };
  }

  start() {
    if (this.started) return;
    this.started = true;
    // First poll immediately, then on interval
    this.poll().catch(console.error);
    this.timer = setInterval(() => this.poll().catch(console.error), this.cfg.intervalMs);
    console.error(`[watcher] started — polling every ${this.cfg.intervalMs / 1000}s`);
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.started = false;
    console.error("[watcher] stopped");
  }

  // ── Poll cycle ────────────────────────────────────────────────────────────────

  private async poll() {
    await Promise.allSettled([
      this.checkWAN(),
      this.checkDevices(),
      this.checkClients(),
      this.checkAlerts(),
      this.checkRogueAPs(),
    ]);
  }

  // ── WAN health ────────────────────────────────────────────────────────────────

  private async checkWAN() {
    let wans: any[];
    try {
      const res: any = await this.client.site("/wans");
      wans = Array.isArray(res) ? res : res?.data ?? [];
    } catch { return; }

    for (const wan of wans) {
      const id     = wan.id ?? wan.name ?? "wan";
      const status = wan.status ?? wan.uplink_status ?? "unknown";
      const prev   = this.cfg.wanStateCache.get(id);

      // Status change
      if (prev !== undefined && prev !== status) {
        const down = status === "down" || status === "disconnected";
        this.emit({
          id:       `wan-status-${id}-${Date.now()}`,
          severity: down ? "critical" : "info",
          category: "wan",
          title:    down ? `WAN ${id} is DOWN` : `WAN ${id} restored`,
          detail:   `Status changed: ${prev} → ${status}`,
          timestamp: new Date().toISOString(),
          raw: wan,
        });
      }
      this.cfg.wanStateCache.set(id, status);

      // Packet loss
      const loss = wan.latency_average?.packet_loss ?? wan.packet_loss;
      if (typeof loss === "number") {
        if (loss >= this.cfg.wanPacketLossCrit) {
          this.emit({
            id:       `wan-loss-crit-${id}-${Date.now()}`,
            severity: "critical",
            category: "wan",
            title:    `WAN ${id} packet loss critical`,
            detail:   `${loss.toFixed(1)}% packet loss (threshold: ${this.cfg.wanPacketLossCrit}%)`,
            timestamp: new Date().toISOString(),
            raw: wan,
          });
        } else if (loss >= this.cfg.wanPacketLossWarn) {
          this.emit({
            id:       `wan-loss-warn-${id}-${Date.now()}`,
            severity: "warning",
            category: "wan",
            title:    `WAN ${id} elevated packet loss`,
            detail:   `${loss.toFixed(1)}% packet loss (threshold: ${this.cfg.wanPacketLossWarn}%)`,
            timestamp: new Date().toISOString(),
            raw: wan,
          });
        }
      }

      // Latency
      const latency = wan.latency_average?.average ?? wan.latency;
      if (typeof latency === "number") {
        if (latency >= this.cfg.wanLatencyCritMs) {
          this.emit({
            id:       `wan-latency-crit-${id}-${Date.now()}`,
            severity: "critical",
            category: "wan",
            title:    `WAN ${id} latency critical`,
            detail:   `${latency}ms average latency (threshold: ${this.cfg.wanLatencyCritMs}ms)`,
            timestamp: new Date().toISOString(),
            raw: wan,
          });
        } else if (latency >= this.cfg.wanLatencyWarnMs) {
          this.emit({
            id:       `wan-latency-warn-${id}-${Date.now()}`,
            severity: "warning",
            category: "wan",
            title:    `WAN ${id} elevated latency`,
            detail:   `${latency}ms average latency (threshold: ${this.cfg.wanLatencyWarnMs}ms)`,
            timestamp: new Date().toISOString(),
            raw: wan,
          });
        }
      }
    }
  }

  // ── Device state ──────────────────────────────────────────────────────────────

  private async checkDevices() {
    let devices: any[];
    try {
      const res: any = await this.client.site("/devices");
      devices = Array.isArray(res) ? res : res?.data ?? [];
    } catch { return; }

    for (const device of devices) {
      const id     = device.id ?? device.mac;
      const status = device.status ?? device.state;
      const prev   = this.cfg.deviceStateCache.get(id);
      const name   = device.name ?? device.model ?? id;

      if (prev !== undefined && prev !== status) {
        const isDown = status === "offline" || status === "disconnected" || status === 0 || status === "0";
        this.emit({
          id:       `device-status-${id}-${Date.now()}`,
          severity: isDown ? "critical" : "info",
          category: "device",
          title:    isDown ? `Device offline: ${name}` : `Device online: ${name}`,
          detail:   `State changed: ${prev} → ${status}`,
          timestamp: new Date().toISOString(),
          raw: { id, name, status, model: device.model },
        });
      }
      this.cfg.deviceStateCache.set(id, status);
    }
  }

  // ── Unknown clients ───────────────────────────────────────────────────────────

  private async checkClients() {
    let clients: any[];
    try {
      const res: any = await this.client.site("/clients");
      clients = Array.isArray(res) ? res : res?.data ?? [];
    } catch { return; }

    const isFirstPoll = this.cfg.knownClientMacs.size === 0;

    for (const client of clients) {
      const mac = client.mac ?? client.id;
      if (!mac) continue;

      if (!this.cfg.knownClientMacs.has(mac)) {
        // Only emit on subsequent polls — first poll is baseline
        if (!isFirstPoll) {
          this.emit({
            id:       `new-client-${mac}-${Date.now()}`,
            severity: "warning",
            category: "client",
            title:    "New client connected",
            detail:   `MAC ${mac} — ${client.hostname ?? client.name ?? "unknown"} on ${client.ssid ?? client.network ?? "unknown network"}`,
            timestamp: new Date().toISOString(),
            raw: { mac, hostname: client.hostname, ssid: client.ssid, ip: client.ip },
          });
        }
        this.cfg.knownClientMacs.add(mac);
      }
    }
  }

  // ── Alerts ────────────────────────────────────────────────────────────────────

  private async checkAlerts() {
    let alerts: any[];
    try {
      const res: any = await this.client.legacy("/stat/alarm");
      alerts = Array.isArray(res?.data) ? res.data : [];
    } catch { return; }

    for (const alert of alerts) {
      const id = alert._id ?? alert.id;
      if (!id || this.cfg.alertIdsSeen.has(id)) continue;
      this.cfg.alertIdsSeen.add(id);

      const severity: EventSeverity =
        alert.key?.includes("critical") || alert.key?.includes("disconnected")
          ? "critical"
          : alert.key?.includes("warn") ? "warning" : "info";

      this.emit({
        id:       `alert-${id}`,
        severity,
        category: "alert",
        title:    alert.msg ?? alert.key ?? "UniFi alert",
        detail:   JSON.stringify({ key: alert.key, subsystem: alert.subsystem, time: alert.time }),
        timestamp: new Date(alert.time != null ? alert.time * 1000 : Date.now()).toISOString(),
        raw: alert,
      });
    }
  }

  // ── Rogue APs ─────────────────────────────────────────────────────────────────

  private async checkRogueAPs() {
    let rogues: any[];
    try {
      const res: any = await this.client.legacy("/stat/rogueap");
      rogues = Array.isArray(res?.data) ? res.data : [];
    } catch { return; }

    for (const rogue of rogues) {
      const id = rogue._id ?? rogue.bssid ?? rogue.mac;
      if (!id || this.cfg.rogueApIdsSeen.has(id)) continue;
      this.cfg.rogueApIdsSeen.add(id);

      this.emit({
        id:       `rogue-ap-${id}`,
        severity: "warning",
        category: "security",
        title:    "Rogue AP detected",
        detail:   `SSID: ${rogue.essid ?? "unknown"} — BSSID: ${rogue.bssid ?? id} — Signal: ${rogue.signal ?? "?"}dBm`,
        timestamp: new Date().toISOString(),
        raw: rogue,
      });
    }
  }

  // ── Emit ──────────────────────────────────────────────────────────────────────

  private emit(event: NetworkEvent) {
    console.error(`[watcher] ${event.severity.toUpperCase()} ${event.category}: ${event.title}`);

    // Notify all direct subscribers (e.g. SSE transport layer)
    for (const sub of this.subscribers) {
      try { sub(event); } catch { /* subscriber errors must not kill the watcher */ }
    }

    // Also send as MCP server notification — any connected MCP client receives this
    // MCP spec: notifications/message is the correct channel for unsolicited server messages
    this.server.sendLoggingMessage({
      level: event.severity === "critical" ? "error"
           : event.severity === "warning"  ? "warning"
           : "info",
      data: {
        source:    "unifi-watcher",
        event_id:  event.id,
        category:  event.category,
        title:     event.title,
        detail:    event.detail,
        timestamp: event.timestamp,
      },
    }).catch(() => { /* no connected client yet, that's fine */ });
  }
}

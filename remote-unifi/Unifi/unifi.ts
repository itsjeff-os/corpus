// ── UniFi API Client ───────────────────────────────────────────────────────────
// Handles both the modern v1 API and the legacy proxy/network API
// v1  → /v1/...                       (API key auth, JSON)
// Legacy → /proxy/network/api/s/...   (API key auth, JSON)

export interface UniFiConfig {
  controller: string; // e.g. https://192.168.1.1
  apiKey: string;
  siteId: string;     // v1 uses UUID; legacy uses slug e.g. "default"
  siteName: string;   // legacy site slug
}

export class UniFiClient {
  constructor(private config: UniFiConfig) {}

  // ── Core request ─────────────────────────────────────────────────────────────
  async request<T = unknown>(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    body?: unknown
  ): Promise<T> {
    const url = `${this.config.controller}${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        "X-API-Key":    this.config.apiKey,
        "Content-Type": "application/json",
        "Accept":       "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`UniFi ${method} ${path} → ${res.status} ${res.statusText}: ${text}`);
    }

    if (res.status === 204) return null as T;
    return res.json() as Promise<T>;
  }

  // ── v1 helpers ────────────────────────────────────────────────────────────────
  v1<T = unknown>(path: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown) {
    return this.request<T>(`/v1${path}`, method, body);
  }

  site<T = unknown>(path: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown) {
    return this.v1<T>(`/sites/${this.config.siteId}${path}`, method, body);
  }

  // ── Legacy helpers ────────────────────────────────────────────────────────────
  legacy<T = unknown>(path: string, method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", body?: unknown) {
    return this.request<T>(`/proxy/network/api/s/${this.config.siteName}${path}`, method, body);
  }

  legacyCmd<T = unknown>(manager: string, cmd: string, extra: Record<string, unknown> = {}) {
    return this.legacy<T>(`/cmd/${manager}`, "POST", { cmd, ...extra });
  }
}

// ── Singleton factory ─────────────────────────────────────────────────────────
export function createClient(): UniFiClient {
  const controller = process.env.UNIFI_CONTROLLER;
  const apiKey     = process.env.UNIFI_API_KEY;
  const siteId     = process.env.UNIFI_SITE_ID;
  const siteName   = process.env.UNIFI_SITE_NAME ?? "default";

  if (!controller || !apiKey || !siteId) {
    throw new Error(
      "Missing required env vars: UNIFI_CONTROLLER, UNIFI_API_KEY, UNIFI_SITE_ID"
    );
  }

  return new UniFiClient({ controller, apiKey, siteId, siteName });
}

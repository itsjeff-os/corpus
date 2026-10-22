# Concierge

Concierge is a realtime, audio-first worldbuilding companion routed through Cloudflare AI Gateway. The browser streams microphone audio to a local Node relay, the relay connects to OpenAI's current Realtime event protocol through the configured gateway, and generated PCM audio streams straight back for low-latency playback.

The model is not hard-coded into the client. `REALTIME_MODEL` selects any model that implements the OpenAI Realtime event contract and is available through the configured gateway.

## Architecture

```text
Browser                                  Trusted Node relay                         Upstream
──────────────────────────────           ──────────────────────────────             ─────────────────────
microphone + permission prompt  ──WS──▶  validates client audio events   ──WSS──▶   Cloudflare AI Gateway
24 kHz mono PCM capture                  holds gateway/provider secrets              OpenAI Realtime model
incremental PCM playback       ◀──WS──   configures session + persona     ◀──WSS──   audio + transcript events
VAD/session/transcript UI                closes upstream with browser
```

Why a relay instead of direct browser WebRTC? OpenAI recommends WebRTC for direct browser sessions, but Cloudflare AI Gateway's current Realtime integration is a WebSocket endpoint. Keeping that WebSocket on the trusted server also prevents the Cloudflare gateway token and optional OpenAI provider key from reaching browser code.

## Setup

Requirements: Node.js 20 or newer, a Cloudflare account with AI Gateway enabled, and microphone access in a modern browser.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create local configuration:

   ```bash
   cp .env.example .env.local
   ```

3. Set these values in `.env.local`:

   - `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns the gateway.
   - `CLOUDFLARE_AI_GATEWAY_ID`: defaults to the local convention, `api-gateway`.
   - `CLOUDFLARE_AI_GATEWAY_TOKEN`: a token with AI Gateway Run permission for an authenticated gateway.
   - `REALTIME_MODEL`: defaults to the current voice model used during development, `gpt-realtime-2.1`; change it without rebuilding.
   - `OPENAI_API_KEY`: omit this when the OpenAI provider key is stored in Cloudflare AI Gateway with BYOK. Otherwise set it only in `.env.local`; the relay forwards it upstream and never sends it to the browser.

   Never prefix a variable with `VITE_`: Vite exposes those values to browser JavaScript.

4. Start both the relay and frontend:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173), select **Begin session**, and allow microphone access.

The relay health endpoint is [http://localhost:8787/api/health](http://localhost:8787/api/health). It reports the selected model and whether required Cloudflare variables exist, but never returns credentials.

## Developer notes

### Latency

- The AudioWorklet resamples browser input to mono 24 kHz PCM16 and emits roughly 20 ms chunks. Avoid increasing chunk size unless gateway overhead becomes a measured problem; larger chunks delay VAD and barge-in.
- Audio output is scheduled incrementally with a small 25 ms lead to reduce gaps without building a large playback buffer.
- `semantic_vad` with automatic eagerness allows natural pauses. For rapid-fire interactions, try `eagerness: "high"`; for reflective sessions use `"low"`.
- The Cloudflare relay adds a network hop compared with direct OpenAI WebRTC. Measure microphone-to-first-audio latency in the deployment region that will actually serve users.

### Session lifecycle

- Each browser WebSocket owns exactly one upstream Realtime session. Closing the browser session closes the upstream socket.
- The UI waits for `session.updated` before declaring the line ready.
- Realtime sessions are stateful and currently have a maximum duration of 60 minutes. Long-running products should warn before expiry and explicitly start a fresh session with a compact handoff summary if continuity matters.
- The voice cannot be changed after the model has emitted audio. Start a new session when switching voices.
- Browser reconnection uses three exponential-backoff attempts. A recovered connection is a new model session, so prior spoken context is not silently assumed to survive.

### Permissions and security

- Microphone permission is requested only after the user presses **Begin session**.
- Standard provider credentials and the Cloudflare gateway token exist only in the relay environment.
- The relay sets `cf-aig-collect-log-payload: false`, preserving gateway metadata while keeping raw conversation payloads out of AI Gateway logs. Remove or change that header only after making an explicit retention decision.
- Production should authenticate `/api/realtime`, authorize gateway use per user, rate-limit upgrades, validate the request origin, and attach a stable privacy-preserving OpenAI safety identifier where supported by the gateway.
- Transcripts live only in React memory in this prototype and disappear on refresh. If persistence is added, make retention and deletion controls explicit.

### Error recovery

- Permission denial remains a browser-level error; the UI tells the user to change browser settings and retry.
- Unexpected WebSocket closure triggers bounded reconnects. After three failures the app stops retrying to avoid a reconnect storm.
- Upstream API errors are displayed without leaking headers or credentials. Detailed gateway failures remain in server logs.
- When user speech begins, queued assistant audio is stopped locally while server-side interruption cancels generation through VAD.

## Validation checklist

### Audio and permission

- [ ] First click prompts for microphone access; no prompt appears at page load.
- [ ] Denying permission produces a useful retry state without a page crash.
- [ ] Allowing permission moves through Connecting to Listening.
- [ ] Speaking changes the state to You have the floor and animates the input meter.
- [ ] Assistant audio begins incrementally and is clear, at the expected pitch and speed.
- [ ] Pausing the mic stops new input chunks; muting voice stops queued and future playback.
- [ ] Headphones and laptop speakers both avoid an obvious echo loop.

### Connection recovery

- [ ] Stop the relay during a session and confirm the UI enters Restoring the line.
- [ ] Restart within the retry window and confirm a new session reaches Listening.
- [ ] Leave the relay down and confirm retries stop after three attempts.
- [ ] End session and confirm the microphone browser indicator turns off immediately.
- [ ] Verify an invalid gateway token produces a safe user error and a useful server log.

### Conversation quality

- [ ] Ask for a setting concept; Concierge gives a strong direction before alternatives.
- [ ] Interrupt a long response and confirm playback stops quickly and the model adapts.
- [ ] Use invented names and confirm the live transcript remains usable.
- [ ] Ask Concierge to stress-test a world and confirm it identifies concrete tensions and failure modes.
- [ ] Hold a natural pause mid-sentence and verify turn detection does not consistently cut in too early.
- [ ] Run a 20-minute conversation and monitor drift, repetition, latency, and transcript ordering.

## Verification commands

```bash
npm test
npm run build
```

## Current API references

- [OpenAI Realtime with WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket)
- [OpenAI Realtime conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [OpenAI voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad)
- [OpenAI model catalog](https://developers.openai.com/api/docs/models)
- [Cloudflare AI Gateway Realtime WebSockets](https://developers.cloudflare.com/ai-gateway/usage/websockets-api/realtime-api/)

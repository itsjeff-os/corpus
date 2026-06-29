# Risks, Limitations, Mitigations

## 1) Entity ID drift / naming mismatch
**Risk:** automations reference entities that don’t exist or were renamed.  
**Impact:** failed automations, silent no-ops, inconsistent behaviour.  
**Mitigation:**
- Run Entity Audit before first deploy (see `inventory/ENTITY_AUDIT_GUIDE.md`)
- Create stable groups/helpers and reference those
- Add a “validate entities” step in the approval packet

## 2) Automation “fights” (multiple automations controlling same light)
**Risk:** flicker, oscillation, unpredictable scenes.  
**Mitigation:**
- Use one “brain” per light group (blueprint pattern)
- Explicit arbitration: override_mode, sleep_mode, guest_mode
- Add cooldowns/linger logic and avoid multiple triggers

## 3) Action limits (timeouts, payload size)
**Risk:** ChatGPT Actions have request timeouts and payload size limits.  
**Mitigation:**
- Keep read endpoints scoped (search, single entity)
- Use batch endpoint for one consequential call
- Return raw JSON; avoid huge responses

## 4) Security of gateway exposure
**Risk:** exposed n8n/HA endpoints could be abused.  
**Mitigation:**
- Cloudflare Tunnel + Access policy (recommended)
- API key auth; rotate keys
- Allowlist OpenAI egress IP ranges if feasible
- Log every write operation

## 5) Secrets handling
**Risk:** tokens leak into logs or model context.  
**Mitigation:**
- Never include secrets in prompts or Notion pages
- Store HA/Notion/email secrets only in n8n credentials/env
- Redact in approval packet

## 6) Home Assistant container permissions
**Risk:** Bluetooth management missing NET_ADMIN/NET_RAW; some integrations unstable.  
**Mitigation:**
- If Bluetooth is needed, adjust container capabilities
- Otherwise ignore (does not block lighting automations)

## 7) Notion schema drift
**Risk:** Notion database properties change and break writes.  
**Mitigation:**
- Keep a dedicated “AI Change Log” database/page
- Use minimal required fields (Title + Markdown body)
- Add a “Notion write test” workflow

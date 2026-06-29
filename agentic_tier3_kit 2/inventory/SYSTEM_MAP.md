# SYSTEM_MAP.md
### High-Level Map of My Agentic Ecosystem

This file describes the the current and intended structure of my overall system across layers.
It is a **scaffold**, not a finished design. I can edit, expand, or correct it as things evolve.

---

## LAYER 0 — REALITY / ENVIRONMENT

**Purpose:** Things that exist in the physical or external world that the system can ultimately affect.

- **Home Assistant + Devices**
  - Lights (Philips Hue groups, lamps, gradients, etc.)
  - Sensors (motion, presence, door, temp/humidity, etc.)
  - Context helpers (house_asleep, house_away, etc. — to be rebuilt cleanly)
  - Media devices (TVs, speakers, HomePod, etc.)
- **External services (future)**
  - Anything else the system might eventually influence (e.g. notifications, music, etc.)

**Key Notes:**
- Home Assistant is the primary actuator layer.
- The YAML writer pipeline already connects higher layers down into this layer.

---

## LAYER 1 — ORCHESTRATION / AUTOMATION

**Purpose:** Glue and routing. This layer does NOT “think”; it moves data and triggers actions.

### ✅ Tools in play:
- **n8n**
  - Multiple workflows already exist (not just the HA YAML writer).
  - At least one flow:
    - Receives intent / spec
    - Calls OpenAI / ChatGPT
    - Posts `{ file_name, automation_yaml }` to Home Assistant script
- **Zapier Pro**
  - For integrations where Zapier is easier than n8n (e.g. SaaS tools).
- **IFTTT**
  - Lightweight automations / simple triggers if needed.
- **Cloudflare + Domain**
  - Can host secure webhooks / endpoints for:
    - n8n triggers
    - future small apps, dashboards, or agent entrypoints.

**Future intent:**
- n8n as the **primary orchestrator**.
- Zapier / IFTTT as “side helpers”.
- Cloudflare as the secure front door for external triggers.

---

## LAYER 2 — MEMORY / DATA / STATE

**Purpose:** Things that should persist beyond a single conversation or single run.
This is where long-term structure lives so I don’t have to hold everything in my head.

### ✅ Tools in play:

- **Supabase**
  - Tables + schemas already set up.
  - Edge Functions are ready.
  - Ideal for:
    - Automation logs and metadata
    - User/context state (e.g., current mode, last scene, preferences)
    - Stable configuration data
- **Chroma (cloud)**
  - For semantic memory:
    - Lighting designs and descriptions
    - Behaviour patterns and specs
    - Past solutions / automations in natural language form
- **Notion Pro + AI**
  - Human-facing vault:
    - Roadmaps
    - Project overviews
    - Journals / reflections
    - Change logs
    - Design docs and diagrams
- **GitHub**
  - Version control for:
    - Home Assistant config (YAML, packages, etc.)
    - Docs like PROJECT_GUIDE, SYSTEM_MAP, AGENT_SCAFFOLD, WORKING_STYLE
    - Prompt templates and agent definitions

**Future intent:**
- Clear rules for what lives in Supabase vs Chroma vs Notion vs GitHub.
- Supabase = structured state.  
- Chroma = fuzzy/semantic memory.  
- Notion = human-readable brain.  
- GitHub = source of truth for config + prompts.

---

## LAYER 3 — INTELLIGENCE / REASONING

**Purpose:** Where “thinking” happens. There are two main contexts here.

### 3.1 ChatGPT Business Workspace (Design-time Intelligence)
- Used for:
  - System design & architecture
  - Debugging and troubleshooting (e.g., HA logs, n8n flows)
  - Writing guides, maps, and scaffolding (like this SYSTEM_MAP)
  - Designing agents (Lighting Designer, System Architect, Life Architect, etc.)
  - Reflection and meta-analysis of how I work with AI

- Characteristics:
  - Interactive, conversational, warm + precise
  - Works with project files (GUIDES, MAPS, etc.)
  - This is my “studio brain”.

### 3.2 OpenAI Dev Platform (Runtime Intelligence via API)
- Tools:
  - API keys + credit already active
  - Future home for:
    - Lighting Designer API agent
    - Automation Engineer API agent
    - Life Architect API agent
    - Any specialised assistants that need to be called from n8n / Supabase

- Used for:
  - Automated reasoning in workflows (e.g. generate YAML from spec)
  - Interacting with Supabase/Chroma via tools
  - Running background or event-driven “AI jobs”

**Future intent:**
- Workspace (this) = design, reflection, shaping.  
- Dev Platform = execution, automation, integration with other tools.

---

## LAYER 4 — INTERFACE / EXPERIENCE

**Purpose:** How I interact with the system and experience its behaviour.

### Interfaces:

- **ChatGPT UI (Workspace)**
  - Primary console for:
    - Thinking, designing, debugging, exploring
    - Issuing meta-commands (“Build mode / Vibe mode”)
    - Co-creating new components

- **Home Assistant Dashboards**
  - Tiles and cards for:
    - Automation Writer status
    - AI-generated automations
    - Lighting OS control (future)
    - Context Engine states (future)

- **Notion**
  - Dashboards, project views, notes
  - “Executive view” of system state and roadmap

- **Cloudflare domain / Web UIs (future)**
  - Simple web frontends if needed (e.g. forms, toggles, status pages).
  - Possible entrypoint for natural-language requests (e.g. “create a new bedtime scene”).

---

## LAYER 5 — PROJECT & AGENT LAYER (LOGICAL, NOT TECHNICAL)

**Purpose:** Conceptual layer that ties everything together.

### Projects:
- **Home Assistant Automation Writer** (existing)
  - Has `PROJECT_GUIDE.md` and `PROJECT_INSTRUCTIONS.md`.
- **Lighting OS** (planned)
- **Context Engine** (planned)
- **Life OS / Life Architect** (future)
- Others as they emerge.

### Agents (Conceptual Roles):
- Lighting Designer (will use HA entities + memory)
- System Architect (pipeline/layout thinking)
- Automation Engineer (YAML, safety, correctness)
- Curator (documentation, logs, summaries)
- Life Architect (behavioural/environmental design)

These agents are:
- Represented as instruction files + docs.
- Run on top of Layer 3 (ChatGPT Workspace and/or API).
- Use Layers 1 & 2 to act and remember.
- Affect Layer 0 via Home Assistant & other tools.

---

## CURRENT STATUS (ROUGH)

- ✅ Home Assistant + devices in place.
- ✅ n8n up and running with at least one major pipeline (HA automation writer).
- ✅ Supabase + edge functions prepared (not fully integrated yet).
- ✅ Chroma ready for semantic storage (not fully integrated yet).
- ✅ Notion Pro in active use for projects and notes.
- ✅ Cloudflare domain ready for webhooks and potential UIs.
- ✅ OpenAI Dev Platform available for runtime agents.
- ✅ GitHub available for version control.
- ✅ ChatGPT Workspace actively used as design/architecture studio.

**Next steps (high-level, NOT commitments):**
- Fill in more detail for what belongs in each memory tool (Supabase / Chroma / Notion / GitHub).
- Create AGENT_SCAFFOLD.md describing each planned agent at a high level.
- Start mapping which existing n8n workflows belong to which project/module.
- Gradually move internal roadmaps (currently in my head) into files in this workspace.

This file is a living map and will evolve as the system evolves.

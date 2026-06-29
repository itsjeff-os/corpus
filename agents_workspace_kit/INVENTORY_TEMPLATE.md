# Inventory Template (fill this once, then keep updated)

Paste whatever you have; partial inventories are fine.

## Home Assistant environment
- HA install type (OS / Supervised / Container / Core):
- HA version:
- Add-ons (n8n, VS Code, etc):
- Config style (YAML-only / UI + YAML / Packages):
- Git repo for config? (yes/no) If yes: provider (GitHub/GitLab/etc)

## Zones / rooms
List rooms + key context (natural light, primary activities, people, sleep areas).

Example:
- Living room — TV, reading, plants, 3 lamps + ceiling, west-facing.
- Bedroom — sleep, sunrise wake, blackout curtains.

## Devices (high level)
### Lights
For each room, list lights and capabilities:
- Entity id:
- Type: (dimmable / CT / RGB / RGBW / addressable / switch)
- Supports transition? (yes/no)
- Notes: (flicker, min brightness, etc)

### Sensors / inputs
- Occupancy / motion:
- Door / window:
- Lux sensors:
- Sleep / phone presence:
- Media players:
- Buttons / remotes:

## Naming conventions (if any)
- Example: lights = light.<room>_<fixture>
- Example: automations = automation.<area>_<purpose>

## Preferences
- “Do not disturb” hours:
- Max brightness at night:
- Color temp preferences:
- Any hard rules (e.g., never turn on bedroom lights after 10pm):

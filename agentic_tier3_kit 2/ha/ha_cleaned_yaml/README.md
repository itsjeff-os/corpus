# HA Cleaned YAML Set (IDs de-duped)

## What changed
- Removed duplicate automation IDs:
  - `open_plan_follow_me_lighting` had two versions → consolidated into one blueprint instance.
  - `bedroom_daily_rhythm_ceiling` had two versions → kept the expanded override variant.
- Converted "Follow Me" style automations to the `Room • Follow-Me Atmospheric Lighting` blueprint
  so you only maintain logic once.

## Important
Avoid running two automations that control the same light(s) from the same sensor(s) — they can fight.

## Suggested placement
- `blueprints/automation/*.yaml` → Home Assistant blueprints folder
- `packages/*.yaml` → requires `homeassistant: packages: !include_dir_named packages`
- `lovelace/lighting_brain_view.yaml` → paste into dashboard YAML mode (or merge into an existing view)

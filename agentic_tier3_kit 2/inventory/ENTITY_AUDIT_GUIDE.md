# Entity Audit Guide (recommended first run)

## Why
Your extracted bundle contains *multiple* entity naming conventions:
- `home_registry.json` uses e.g. `light.open_plan_ceiling`
- `homeassistant_entity_reference.md` lists e.g. `light.bedroom2_all_lights`
- `ha_cleaned_yaml` uses e.g. `light.openplan_ceiling_lights_2`, `binary_sensor.bedroom_2_fp1e_occupancy_sensor`

Before deploying automations, confirm what actually exists in HA today.

## Fast approach (via GPT Gateway)
1) Search for a few anchors:
   - `openplan` (or `open_plan`)
   - `bedroom2` (or `bedroom_2`, `beta`)
   - `fp2` / `fp1e`
2) For each candidate entity_id:
   - call `/read/ha/state`
   - confirm it returns a state (not 404)

## Output
Produce an `ENTITY_MAP.md` with:
- “Canonical logical name” → “Actual entity_id”
Examples:
- Core presence → binary_sensor.presence_sensor_fp2_openplan
- Core ceiling lights → light.open_plan_ceiling (or a group you define)

## Best practice
If names are messy, create new stable **groups** and reference those in all new automations:
- light.core_ceiling
- light.core_ambient
- binary_sensor.core_presence

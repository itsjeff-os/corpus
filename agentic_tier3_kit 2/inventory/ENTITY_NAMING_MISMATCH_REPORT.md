# Entity Naming Mismatch Report

This file is generated from the extracted bundle. It highlights why an **Entity Audit** is required before shipping automations.

## Counts (unique entity IDs found)
- From `home_registry.json`: **25**
- From `homeassistant_entity_reference.md`: **75**
- From `ha_cleaned_yaml`: **38**

## Overlaps
### Registry ∩ Entity Reference (16)
- binary_sensor.presence_sensor_fp2_dining_area
- binary_sensor.presence_sensor_fp2_kitchen
- binary_sensor.presence_sensor_fp2_living_area
- binary_sensor.presence_sensor_fp2_openplan
- climate.living_ac
- cover.openplan_curtains
- light.open_plan_all_lights
- light.open_plan_ambient
- light.open_plan_ceiling
- media_player.apple_tv
- media_player.living_homepods
- scene.living_concentrate
- scene.living_energise
- scene.living_nightlight
- scene.living_relax
- vacuum.eufy_s1_omni_pro

### Registry ∩ Cleaned YAML (0)
- (none)

### Entity Reference ∩ Cleaned YAML (1)
- sun.sun

## What this implies
- The cleaned YAML set appears to target **different entity IDs** than the registry and the entity reference list.
- This can happen if:
  - entities were renamed in HA
  - different integrations are being used (Hue vs HomeKit vs Matter)
  - the YAML set is from a different HA snapshot

## Mitigation (required before deploy)
Run an Entity Audit against live HA and build a canonical mapping:
- logical name → actual entity_id
Then update/parameterize any YAML before shipping.

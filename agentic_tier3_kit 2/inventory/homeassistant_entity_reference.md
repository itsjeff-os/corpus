# Home Assistant Entity Reference Map — Blank

## Open Plan (Living / Dining / Kitchen)
- binary_sensor.presence_sensor_fp2_openplan
- binary_sensor.presence_sensor_fp2_living_area
- binary_sensor.presence_sensor_fp2_kitchen
- binary_sensor.presence_sensor_fp2_dining_area
- light.open_plan_ceiling
- light.open_plan_ambient
- light.open_plan_all_lights
- cover.openplan_curtains
- climate.living_ac
- sensor.openplan_temp
- sensor.openplan_humidity
- media_player.living_homepods
- media_player.apple_tv
- scene.living_relax
- scene.living_concentrate
- scene.living_energise
- scene.living_nightlight

## Bedroom 1
- binary_sensor.bedroom1_fp2_presence
- binary_sensor.bedroom1_fp2_bedzone
- binary_sensor.bedroom1_door
- light.bedroom1_all_lights
- climate.bedroom1_ac
- fan.bedroom1_purifier
- fan.bedroom1_humidifier
- sensor.bedroom1_temp
- sensor.bedroom1_humidity
- binary_sensor.bedroom1_withings_sleep_inbed
- sensor.bedroom1_withings_deepsleep
- sensor.withings_sleep_light_sleep
- media_player.bedroom1_homepod
- media_player.bedroom1_tv

## Bedroom 2
- binary_sensor.bedroom2_fp2_presence
- binary_sensor.bedroom2_fp2_bedzone
- binary_sensor.bedroom2_door
- light.bedroom2_all_lights
- climate.bedroom2_ac
- media_player.bedroom2_homepod
- media_player.bedroom2_tv

## Hallway
- binary_sensor.hallway_motion
- binary_sensor.hallway_door
- light.hallway_all_lights
- scene.hallway_relax
- scene.hallway_sleepy15
- scene.hallway_read

## Bathrooms
- binary_sensor.bath1_motion
- binary_sensor.bath2_motion
- binary_sensor.bath1_door
- binary_sensor.bath2_door
- light.bathroom1_all_lights
- light.bathroom2_all_lights
- scene.bathroom_relax
- scene.bathroom_nightlight

## Laundry / Storage
- binary_sensor.laundry_sns_door_door
- vacuum.eufy_s1_omni_pro

## System / Helpers
- device_tracker.iphone_16_pro_max
- device_tracker.primary_ipad_10_5
- input_boolean.sleep_mode
- input_boolean.guest_mode
- input_boolean.override_mode
- input_boolean.focus_mode
- input_boolean.recovery_mode
- input_boolean.hydration_nags_enabled
- input_number.hydration_interval_minutes
- sun.sun

## Hubs / Infrastructure
- button.aqara_hub_m3_identify
- hue.bridge_pro
- media_player.homepods
- media_player.apple_tv_main

## Automations (active or intended)
- automation.room_presence_lighting
- automation.sleep_mode_wind_down
- automation.wake_up_morning_reset
- automation.away_mode_power_down
- automation.night_bathroom_light
- automation.climate_guard
- automation.humidity_comfort
- automation.hydration_nudge

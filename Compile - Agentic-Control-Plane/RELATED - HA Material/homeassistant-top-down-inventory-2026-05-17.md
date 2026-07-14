# Home Assistant Top-Down Inventory

Generated: 2026-05-17
Source: read-only inspection of Home Assistant registries/config on `servers`.
No Home Assistant config, storage, services, containers, or integrations were changed.

## 1. System Snapshot

| Item | Count / Value |
| --- | ---: |
| Integrations | 28 |
| Areas | 21 |
| Floors | 1 |
| Labels | 5 |
| Devices | 147 |
| Entities | 589 |
| Disabled entities | 103 |
| Hidden entities | 0 |
| Disabled devices | 0 |
| Conversation-exposed entities | 136 |
| Google Assistant-exposed entities | 83 |
| Alexa-exposed entities | 0 |

## 2. Integration Surface

### Integrations

| Domain | Title | Source | Disabled |
| --- | --- | --- | --- |
| apple_tv | Bedroom | zeroconf |  |
| apple_tv | Beta Bedroom | zeroconf |  |
| apple_tv | Living Room | zeroconf |  |
| apple_tv | Living Room (2) | zeroconf |  |
| apple_tv | Living Room (2) | zeroconf |  |
| apple_tv | White HomePod Mini | zeroconf |  |
| apple_tv | living Room Apple TV | zeroconf |  |
| backup | Backup | system |  |
| bluetooth | Shenzhen Phaten Tech. LTD None (8C:BD:37:64:26:26) | integration_discovery |  |
| cast | Google Cast | zeroconf |  |
| cloud | Home Assistant Cloud | system |  |
| go2rtc | go2rtc | system |  |
| google_translate | Google Translate text-to-speech | onboarding |  |
| hue | Hue Bridge c42996c58a91 | zeroconf |  |
| matter | Matter | zeroconf |  |
| met | Home | onboarding |  |
| mobile_app | Jeff’s iPad | registration |  |
| mobile_app | Jeff’s iPhone | registration |  |
| mobile_app | MacBook Air  | registration |  |
| mobile_app | iPhone 16Pro Max  | registration |  |
| mqtt | 192.168.1.39 | user |  |
| radio_browser | Radio Browser | onboarding |  |
| shopping_list | Shopping list | onboarding |  |
| speedtestdotnet | SpeedTest | user |  |
| sun | Sun | import |  |
| thread | Thread | zeroconf |  |
| vesync | Home@itsjeff.org | user |  |
| withings | Withings | user |  |

### Integration Counts

| Domain | Count |
| --- | ---: |
| apple_tv | 7 |
| backup | 1 |
| bluetooth | 1 |
| cast | 1 |
| cloud | 1 |
| go2rtc | 1 |
| google_translate | 1 |
| hue | 1 |
| matter | 1 |
| met | 1 |
| mobile_app | 4 |
| mqtt | 1 |
| radio_browser | 1 |
| shopping_list | 1 |
| speedtestdotnet | 1 |
| sun | 1 |
| thread | 1 |
| vesync | 1 |
| withings | 1 |

## 3. Home Areas

| Area | ID | Floor | Devices | Direct Entity Assignments | Aliases |
| --- | --- | --- | ---: | ---: | --- |
| Attic | attic |  | 0 | 0 |  |
| Bedroom | bedroom |  | 9 | 0 |  |
| Bedroom (Alpha) | alpha_bedroom |  | 11 | 0 |  |
| Beta Bedroom | beta_bedroom_2 |  | 0 | 0 |  |
| Core_kitchen | core_kitchen |  | 4 | 0 | Kitchen |
| Default | default |  | 0 | 0 |  |
| Dining | dining |  | 0 | 0 |  |
| Ensuite (Throne) Bathroom | throne_bathroom |  | 6 | 0 |  |
| Hallway (Pass) | pass |  | 7 | 0 |  |
| Laundry room | laundry_room |  | 1 | 0 |  |
| Laundry/Utilities | chaos |  | 3 | 0 |  |
| Living Room | living_room |  | 8 | 0 |  |
| Living Room (2) | living_room_2 |  | 1 | 0 |  |
| My Bathroom | my_bathroom |  | 1 | 0 |  |
| Openplan | openplan |  | 0 | 0 |  |
| Openplan (Core) | core |  | 13 | 0 |  |
| Parking | parking |  | 1 | 0 |  |
| Secondary Bathroom | secondary_bathroom |  | 7 | 0 |  |
| Spare Bedroom | beta_bedroom |  | 13 | 0 | Beta Bedroom, Guest Bedroom, Rear Bedroom |
| Storage | storage |  | 0 | 0 |  |
| White HomePod Mini | white_homepod_mini |  | 1 | 0 |  |
| Unassigned |  |  | 61 | 589 |  |

## 4. Area-First Inventory

Entities are nested under their device where Home Assistant has a `device_id`. Entity area assignment is currently mostly direct-unassigned, so device area is the useful top-down grouping.

### Bedroom

Devices: `9`

#### All Bedroom & Bathroom

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.all_bedroom_bathroom` — light.all_bedroom_bathroom — conversation, google

#### Alpha Ceiling Light.6

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 — conversation, google
- Disabled:
  - `sensor.hue_essential_spot_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### alpha gradient light-tube.1

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Play gradient tube`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 — conversation, google
- Disabled:
  - `sensor.play_gradient_tube_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Bedroom Ceiling

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.bedroom_ceiling` — light.bedroom_ceiling — conversation, google

#### Bedroom Lamps

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.bedroom_lamps` — light.bedroom_lamps — conversation, google

#### Core 300S

- Area: `Bedroom`
- Manufacturer/model: `VeSync` / `Core300S`
- Integration domains: `vesync`
- Entities: `7`
- Controls:
  - `fan.core_300s` — fan.core_300s — conversation, google
  - `switch.core_300s_child_lock` — Child lock — conversation, google
  - `switch.core_300s_display` — Display — conversation, google
- Sensors:
  - `sensor.core_300s_air_quality` — Air quality
  - `sensor.core_300s_pm2_5` — PM2.5 — conversation, google
- Diagnostic:
  - `sensor.core_300s_filter_lifetime` — Filter lifetime — diagnostic
  - `update.core_300s_firmware` — Firmware — diagnostic

#### Ikea Skytrax Light

- Area: `Bedroom`
- Manufacturer/model: `IKEA of Sweden` / `Dimmable light`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.ikea_skytrax_light` — light.ikea_skytrax_light — conversation
- Disabled:
  - `sensor.betaflex_lower_shelf_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Orange HomePod Mini

- Area: `Bedroom`
- Manufacturer/model: `Apple` / `HomePod Mini`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.orange_homepod_mini` — media_player.orange_homepod_mini — conversation, google
  - `remote.orange_homepod_mini` — remote.orange_homepod_mini

#### Right Bedside Lamp

- Area: `Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color candle`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.right_bedside_lamp` — light.right_bedside_lamp — conversation, google
- Disabled:
  - `sensor.hue_color_candle_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Bedroom (Alpha)

Devices: `11`

#### Alpha Bedroom Dial Switch

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue tap dial switch`
- Integration domains: `hue`
- Entities: `7`
- Presence / Events:
  - `event.alpha_bedroom_dial_switch_button_1` — Button 1
  - `event.alpha_bedroom_dial_switch_button_2` — Button 2
  - `event.alpha_bedroom_dial_switch_button_3` — Button 3
  - `event.alpha_bedroom_dial_switch_button_4` — Button 4
  - `event.alpha_bedroom_dial_switch_rotary` — Rotary
- Diagnostic:
  - `sensor.alpha_bedroom_dial_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alpha Ceiling Light.4

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alpha_ceiling_light_4` — light.alpha_ceiling_light_4 — conversation
- Disabled:
  - `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alpha Ceiling Light.6

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 — conversation, google
- Disabled:
  - `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alpha Hue Smart Button

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart button`
- Integration domains: `hue`
- Entities: `3`
- Presence / Events:
  - `event.alpha_hue_smart_button_button_1` — Button 1
- Diagnostic:
  - `sensor.alpha_hue_smart_button_battery` — Battery — diagnostic
- Disabled:
  - `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alphabed Ceiling Light.3

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphabed_ceiling_light_3` — light.alphabed_ceiling_light_3 — conversation
- Disabled:
  - `sensor.bed3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alphabed Ceiling Light.5

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphabed_ceiling_light_5_2` — light.alphabed_ceiling_light_5_2 — conversation
- Disabled:
  - `sensor.bed1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Alphabed Ceiling Light.5

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 — conversation, google
- Disabled:
  - `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Bedroom

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `8`
- Controls:
  - `light.bedroom` — light.bedroom — conversation
  - `scene.bedroom_concentrate` — Concentrate — conversation, google
  - `scene.bedroom_dimmed` — Dimmed — conversation, google
  - `scene.bedroom_energise` — Energise — conversation, google
  - `scene.bedroom_nightlight` — Nightlight — conversation, google
  - `scene.bedroom_read` — Read — conversation, google
  - `scene.bedroom_relax` — Relax — conversation, google
  - `scene.bedroom_sleepy` — Sleepy — conversation, google

#### core ceiling.3

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_3` — light.core_ceiling_3 — conversation
- Disabled:
  - `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Nymane 3-spot Lamp - Low

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low — conversation, google
- Disabled:
  - `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Withings

- Area: `Bedroom (Alpha)`
- Manufacturer/model: `Withings` / `Unknown model`
- Integration domains: `withings`
- Entities: `27`
- Presence / Events:
  - `binary_sensor.withings_in_bed` — In bed — conversation
- Sensors:
  - `sensor.withings_deep_sleep` — Deep sleep
  - `sensor.withings_light_sleep` — Light sleep
  - `sensor.withings_maximum_heart_rate` — Maximum heart rate
  - `sensor.withings_rem_sleep` — REM sleep
  - `sensor.withings_sleep_score` — Sleep score
  - `sensor.withings_snoring` — Snoring
  - `sensor.withings_time_to_sleep` — Time to sleep
  - `sensor.withings_time_to_wakeup` — Time to wakeup
  - `sensor.withings_wakeup_count` — Wakeup count
  - `sensor.withings_wakeup_time` — Wakeup time
- Disabled:
  - `sensor.withings_active_calories_burnt_today` — Active calories burnt today — disabled:user
  - `sensor.withings_active_time_today` — Active time today — disabled:user
  - `sensor.withings_average_heart_rate` — Average heart rate — disabled:integration
  - `sensor.withings_average_respiratory_rate` — Average respiratory rate — disabled:integration
  - `sensor.withings_breathing_disturbances_intensity` — Breathing disturbances intensity — disabled:integration
  - `sensor.withings_distance_travelled_today` — Distance travelled today — disabled:user
  - `sensor.withings_elevation_change_today` — Elevation change today — disabled:user
  - `sensor.withings_intense_activity_today` — Intense activity today — disabled:integration
  - `sensor.withings_maximum_respiratory_rate` — Maximum respiratory rate — disabled:integration
  - `sensor.withings_minimum_heart_rate` — Minimum heart rate — disabled:integration
  - `sensor.withings_minimum_respiratory_rate` — Minimum respiratory rate — disabled:integration
  - `sensor.withings_moderate_activity_today` — Moderate activity today — disabled:integration
  - `sensor.withings_snoring_episode_count` — Snoring episode count — disabled:integration
  - `sensor.withings_soft_activity_today` — Soft activity today — disabled:integration
  - `sensor.withings_steps_today` — Steps today — disabled:user
  - `sensor.withings_total_calories_burnt_today` — Total calories burnt today — disabled:user

### Core_kitchen

Devices: `4`

#### Core Ceiling Light.9

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_9` — light.core_ceiling_light_9 — conversation
- Disabled:
  - `sensor.ceiling_kitchen_fridge_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Kitchen

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.kitchen` — light.kitchen — conversation, google

#### Kitchen Ceiling

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.kitchen_ceiling` — light.kitchen_ceiling — conversation, google

#### Kitchen Task

- Area: `Core_kitchen`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `0`
- Entities: none registered under this device.

### Ensuite (Throne) Bathroom

Devices: `6`

#### Bathroom dimmer switch

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue dimmer switch`
- Integration domains: `hue`
- Entities: `6`
- Presence / Events:
  - `event.bathroom_dimmer_switch_button_1` — Button 1
  - `event.bathroom_dimmer_switch_button_2` — Button 2
  - `event.bathroom_dimmer_switch_button_3` — Button 3
  - `event.bathroom_dimmer_switch_button_4` — Button 4
- Diagnostic:
  - `sensor.bathroom_dimmer_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.throne_bathroom_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Motion Sensor

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue motion sensor`
- Integration domains: `hue`
- Entities: `7`
- Controls:
  - `switch.hue_motion_sensor_light_sensor_enabled_2` — Light sensor enabled — config
  - `switch.hue_motion_sensor_motion_sensor_enabled_2` — Motion sensor enabled — config
- Presence / Events:
  - `binary_sensor.hue_motion_sensor_motion_2` — Motion — conversation
- Sensors:
  - `sensor.hue_motion_sensor_illuminance_2` — Illuminance
  - `sensor.hue_motion_sensor_temperature_2` — Temperature — conversation
- Diagnostic:
  - `sensor.hue_motion_sensor_battery_2` — Battery — diagnostic
- Disabled:
  - `sensor.throne_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling above Door

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_4` — light.throne_ceiling_light_4 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling above shower door

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_2` — light.throne_ceiling_light_2 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling above sink

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_3_2` — light.throne_ceiling_light_3_2 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Throne Ceiling Light.3

- Area: `Ensuite (Throne) Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.throne_ceiling_light_3` — light.throne_ceiling_light_3 — conversation
- Disabled:
  - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` — Zigbee connectivity — disabled:integration, diagnostic

### Hallway (Pass)

Devices: `7`

#### Hallway

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `7`
- Controls:
  - `light.hallway` — light.hallway — conversation
  - `scene.hallway_concentrate` — Concentrate — conversation, google
  - `scene.hallway_energise` — Energise — conversation, google
  - `scene.hallway_nightlight` — Nightlight — conversation, google
  - `scene.hallway_read` — Read — conversation, google
  - `scene.hallway_relax` — Relax — conversation, google
- Presence / Events:
  - `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling — conversation, google

#### Hallway Dimmer Switch

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue dimmer switch`
- Integration domains: `hue`
- Entities: `6`
- Presence / Events:
  - `event.hallway_dimmer_switch_button_1` — Button 1
  - `event.hallway_dimmer_switch_button_2` — Button 2
  - `event.hallway_dimmer_switch_button_3` — Button 3
  - `event.hallway_dimmer_switch_button_4` — Button 4
- Diagnostic:
  - `sensor.hallway_dimmer_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.hue_dimmer_switch_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.1

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_1` — light.pass_ceiling_light_1 — conversation
- Disabled:
  - `sensor.chaos_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.1 

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_1_2` — light.pass_ceiling_light_1_2 — conversation
- Disabled:
  - `sensor.beta_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.2

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_2` — light.pass_ceiling_light_2 — conversation
- Disabled:
  - `sensor.splash_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.4

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_4` — light.pass_ceiling_light_4 — conversation
- Disabled:
  - `sensor.core_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Pass Ceiling Light.5

- Area: `Hallway (Pass)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.pass_ceiling_light_5` — light.pass_ceiling_light_5 — conversation
- Disabled:
  - `sensor.alpha_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Laundry room

Devices: `1`

#### Laundry room

- Area: `Laundry room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.laundry_room` — light.laundry_room — conversation, google

### Laundry/Utilities

Devices: `3`

#### Hue Bridge Pro

- Area: `Laundry/Utilities`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Bridge`
- Integration domains: `hue`
- Entities: `3`
- Controls:
  - `switch.automation_alpha_bedroom_dial_switch` — Automation: Alpha Bedroom Dial Switch — config
  - `switch.automation_hue_smart_button_3` — Automation: Hue smart button 3 — config
- Disabled:
  - `sensor.hue_bridge_pro_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Laundry (Chaos) Ceiling Light

- Area: `Laundry/Utilities`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue white lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.laundry_chaos_ceiling_light` — light.laundry_chaos_ceiling_light — conversation
- Disabled:
  - `sensor.chaos_laundry_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### White (E27) Hue Bulb

- Area: `Laundry/Utilities`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue white lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.white_e27_hue_bulb` — light.white_e27_hue_bulb — conversation
- Disabled:
  - `sensor.chaos_storage_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Living Room

Devices: `8`

#### Beige Ola Spotlight Lamp

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beige_ola_spotlight_lamp` — light.beige_ola_spotlight_lamp — conversation
- Disabled:
  - `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.5

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_5_2` — light.core_ceiling_light_5_2 — conversation
- Disabled:
  - `sensor.ceiling_op_south_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Living Ceiling

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.living_room_ceiling` — light.living_room_ceiling — conversation, google

#### Core Lounge HomePod

- Area: `Living Room`
- Manufacturer/model: `Apple` / `HomePod (gen 2)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.core_lounge_homepod` — media_player.core_lounge_homepod — conversation, google
  - `remote.core_lounge_homepod` — remote.core_lounge_homepod

#### Core Lounge HomePod

- Area: `Living Room`
- Manufacturer/model: `Apple` / `HomePod (gen 2)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 — conversation, google
  - `remote.core_lounge_homepod_2` — remote.core_lounge_homepod_2

#### Living room

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.living_room` — light.living_room — conversation, google

#### Living room lamps

- Area: `Living Room`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.living_room_lamps` — light.living_room_lamps — conversation, google

#### Lounge Apple TV (WIred)

- Area: `Living Room`
- Manufacturer/model: `Apple` / `Apple TV 4K (gen 3)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired — conversation, google
  - `remote.lounge_apple_tv_wired` — remote.lounge_apple_tv_wired

### Living Room (2)

Devices: `1`

#### Living Room (2)

- Area: `Living Room (2)`
- Manufacturer/model: `Apple` / `HomePod (gen 2)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.living_room_2` — media_player.living_room_2 — conversation, google
  - `remote.living_room_2` — remote.living_room_2

### My Bathroom

Devices: `1`

#### Bathroom

- Area: `My Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `3`
- Controls:
  - `light.bathroom` — light.bathroom — conversation, google
- Presence / Events:
  - `binary_sensor.bathroom_motion` — Motion — conversation, google
- Sensors:
  - `sensor.bathroom_illuminance` — Illuminance

### Openplan (Core)

Devices: `13`

#### Core Ceiling Light.1

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_1` — light.core_ceiling_light_1 — conversation
- Disabled:
  - `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.10

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_10` — light.core_ceiling_light_10 — conversation
- Disabled:
  - `sensor.ceiling_kitchen_sink_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.2

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_2` — light.core_ceiling_light_2 — conversation
- Disabled:
  - `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.4

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_7` — Core Ceiling Light.7 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_mr_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.4

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_4` — light.core_ceiling_light_4 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_se_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.5

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_5` — light.core_ceiling_light_5 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_east_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.6

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_6` — light.core_ceiling_light_6 — conversation
- Disabled:
  - `sensor.ceiling_open_plan_mm_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Ceiling Light.8

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_ceiling_light_8` — light.core_ceiling_light_8 — conversation
- Disabled:
  - `sensor.ceiling_op_br_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Statement Arc Floor Lamp Monica Vibelucci

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue lightguide bulb`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.core_statement_arc_floor_lamp_monica_vibelucci` — light.core_statement_arc_floor_lamp_monica_vibelucci — conversation
- Disabled:
  - `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Core Tap Dial Light Switch

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue tap dial switch`
- Integration domains: `hue`
- Entities: `7`
- Presence / Events:
  - `event.core_tap_dial_light_switch_button_1` — Button 1
  - `event.core_tap_dial_light_switch_button_2` — Button 2
  - `event.core_tap_dial_light_switch_button_3` — Button 3
  - `event.core_tap_dial_light_switch_button_4` — Button 4
  - `event.core_tap_dial_light_switch_rotary` — Rotary
- Diagnostic:
  - `sensor.core_tap_dial_light_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.core_hue_tap_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Signe White Gradient Floor Lamp.1

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Signe gradient floor`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_signe_white_gradient_floor_lamp_1` — light.hue_signe_white_gradient_floor_lamp_1 — conversation
- Disabled:
  - `sensor.core_signe_floor_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Klasnick Beige Table Lamp (with E14 Hue Colour)

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color candle`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.klasnick_beige_table_lamp_with_e14_hue_colour` — light.klasnick_beige_table_lamp_with_e14_hue_colour — conversation
- Disabled:
  - `sensor.klasnick_beige_table_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Signe gradient floor 1

- Area: `Openplan (Core)`
- Manufacturer/model: `Signify Netherlands B.V.` / `Signe gradient floor`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 — conversation, google
- Disabled:
  - `sensor.signe_gradient_floor_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Parking

Devices: `1`

#### SpeedTest

- Area: `Parking`
- Manufacturer/model: `Unknown manufacturer` / `Unknown model`
- Integration domains: `speedtestdotnet`
- Entities: `3`
- Sensors:
  - `sensor.speedtest_download` — Download
  - `sensor.speedtest_ping` — Ping
  - `sensor.speedtest_upload` — Upload

### Secondary Bathroom

Devices: `7`

#### Secondary Bathroom

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `3`
- Controls:
  - `light.secondary_bathroom` — light.secondary_bathroom — conversation, google
- Presence / Events:
  - `binary_sensor.secondary_bathroom_motion` — Motion — conversation, google
- Sensors:
  - `sensor.secondary_bathroom_illuminance` — Illuminance

#### Splash Ceiling Light.1

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_1` — light.splash_ceiling_light_1 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.2

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_2` — light.splash_ceiling_light_2 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.3

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_3` — light.splash_ceiling_light_3 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_5_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.4

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_4` — light.splash_ceiling_light_4 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Ceiling Light.5

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.splash_ceiling_light_5` — light.splash_ceiling_light_5 — conversation
- Disabled:
  - `sensor.splash_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Splash Dimmer Switch

- Area: `Secondary Bathroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue dimmer switch`
- Integration domains: `hue`
- Entities: `6`
- Presence / Events:
  - `event.splash_dimmer_switch_button_1` — Button 1
  - `event.splash_dimmer_switch_button_2` — Button 2
  - `event.splash_dimmer_switch_button_3` — Button 3
  - `event.splash_dimmer_switch_button_4` — Button 4
- Diagnostic:
  - `sensor.splash_dimmer_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.splash_bathroom_dimmer_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

### Spare Bedroom

Devices: `13`

#### Bedroom Apple TV

- Area: `Spare Bedroom`
- Manufacturer/model: `Apple` / `Apple TV 4K (gen 3)`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv — conversation, google
  - `remote.bedroom_apple_tv` — remote.bedroom_apple_tv

#### Beta Bed Lightstrip

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue lightstrip plus`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_bed_lightstrip` — light.beta_bed_lightstrip — conversation
- Disabled:
  - `sensor.beta_bed_lightstrip_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Bedroom & Bath

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.beta_bedroom_bath` — light.beta_bedroom_bath — conversation, google

#### Beta Ceiling Light.3

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_3_2` — light.beta_ceiling_light_3_2 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Ceiling Light.3

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_3` — light.beta_ceiling_light_3 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Ceiling Light.4

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_4` — light.beta_ceiling_light_4 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Beta Ceiling Light.6

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.beta_ceiling_light_6` — light.beta_ceiling_light_6 — conversation
- Disabled:
  - `sensor.beta_ceiling_light_6_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Betaflex Ceiling Light.1

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.betaflex_ceiling_light_1` — Betaflex Ceiling Light.1 — conversation
- Disabled:
  - `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Betaflex Ceiling Light.2

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue ambiance spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.betaflex_ceiling_light_2` — light.betaflex_ceiling_light_2 — conversation
- Disabled:
  - `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hallway Tap Dial Switch

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue tap dial switch`
- Integration domains: `hue`
- Entities: `7`
- Presence / Events:
  - `event.hallway_tap_dial_switch_button_1` — Button 1
  - `event.hallway_tap_dial_switch_button_2` — Button 2
  - `event.hallway_tap_dial_switch_button_3` — Button 3
  - `event.hallway_tap_dial_switch_button_4` — Button 4
  - `event.hallway_tap_dial_switch_rotary` — Rotary
- Diagnostic:
  - `sensor.hallway_tap_dial_switch_battery` — Battery — diagnostic
- Disabled:
  - `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Motion Sensor

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue motion sensor`
- Integration domains: `hue`
- Entities: `7`
- Controls:
  - `switch.hue_motion_sensor_light_sensor_enabled` — Light sensor enabled — config
  - `switch.hue_motion_sensor_motion_sensor_enabled` — Motion sensor enabled — config
- Presence / Events:
  - `binary_sensor.hue_motion_sensor_motion` — Motion — conversation
- Sensors:
  - `sensor.hue_motion_sensor_illuminance` — Illuminance
  - `sensor.hue_motion_sensor_temperature` — Temperature — conversation
- Diagnostic:
  - `sensor.hue_motion_sensor_battery` — Battery — diagnostic
- Disabled:
  - `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Spare Bedroom

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Room`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.spare_bedroom` — light.spare_bedroom — conversation

#### Spare Bedroom Ceiling

- Area: `Spare Bedroom`
- Manufacturer/model: `Signify Netherlands B.V.` / `Zone`
- Integration domains: `hue`
- Entities: `1`
- Controls:
  - `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling — conversation, google

### Unassigned

Devices: `61`

#### Absence for 3mins dining zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 3mins dining zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_3mins_dining_zone_occupancy` — Occupancy
  - `binary_sensor.absence_for_3mins_dining_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_3mins_dining_zone_identify` — Identify — diagnostic
  - `button.absence_for_3mins_dining_zone_identify_2` — Identify — diagnostic

#### Absence for 3mins kitchen zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 3mins kitchen zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` — Occupancy
  - `binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_3mins_kitchen_zone_identify` — Identify — diagnostic
  - `button.absence_for_3mins_kitchen_zone_identify_2` — Identify — diagnostic

#### Absence for 3mins living zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 3mins living zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_3mins_living_zone_occupancy` — Occupancy
  - `binary_sensor.absence_for_3mins_living_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_3mins_living_zone_identify` — Identify — diagnostic
  - `button.absence_for_3mins_living_zone_identify_2` — Identify — diagnostic

#### Absence for 5mins Openplan

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Absence for 5mins Openplan`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.absence_for_5mins_openplan_occupancy` — Occupancy
  - `binary_sensor.absence_for_5mins_openplan_occupancy_2` — Occupancy
- Diagnostic:
  - `button.absence_for_5mins_openplan_identify` — Identify — diagnostic
  - `button.absence_for_5mins_openplan_identify_2` — Identify — diagnostic

#### Approaching Openplan room

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Approaching Openplan room`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.approaching_openplan_room_occupancy` — Occupancy
  - `binary_sensor.approaching_openplan_room_occupancy_2` — Occupancy
- Diagnostic:
  - `button.approaching_openplan_room_identify` — Identify — diagnostic
  - `button.approaching_openplan_room_identify_2` — Identify — diagnostic

#### Aqara Curtain Driver E1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Curtain Driver E1`
- Integration domains: `matter`
- Entities: `14`
- Controls:
  - `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 — conversation, google
  - `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 — conversation, google
- Diagnostic:
  - `binary_sensor.aqara_curtain_driver_e1_problem` — Problem — diagnostic
  - `binary_sensor.aqara_curtain_driver_e1_problem_3` — Problem — diagnostic
  - `button.aqara_curtain_driver_e1_identify` — Identify — diagnostic
  - `button.aqara_curtain_driver_e1_identify_3` — Identify — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_3` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state_3` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage_3` — Battery voltage — diagnostic
- Disabled:
  - `sensor.aqara_curtain_driver_e1_target_opening_position` — Target opening position — disabled:integration, diagnostic
  - `sensor.aqara_curtain_driver_e1_target_opening_position_3` — Target opening position — disabled:integration, diagnostic

#### Aqara Curtain Driver E1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Curtain Driver E1`
- Integration domains: `matter`
- Entities: `14`
- Controls:
  - `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 — conversation, google
  - `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 — conversation, google
- Diagnostic:
  - `binary_sensor.aqara_curtain_driver_e1_problem_2` — Problem — diagnostic
  - `binary_sensor.aqara_curtain_driver_e1_problem_4` — Problem — diagnostic
  - `button.aqara_curtain_driver_e1_identify_2` — Identify — diagnostic
  - `button.aqara_curtain_driver_e1_identify_4` — Identify — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_2` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_4` — Battery — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state_2` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_charge_state_4` — Battery charge state — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage_2` — Battery voltage — diagnostic
  - `sensor.aqara_curtain_driver_e1_battery_voltage_4` — Battery voltage — diagnostic
- Disabled:
  - `sensor.aqara_curtain_driver_e1_target_opening_position_2` — Target opening position — disabled:integration, diagnostic
  - `sensor.aqara_curtain_driver_e1_target_opening_position_4` — Target opening position — disabled:integration, diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_8` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_8` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_8` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_8` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_8` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_2` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_9` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_2` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_9` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_2` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_9` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_9` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_2` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_9` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_10` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_3` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_10` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_3` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_10` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_3` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_10` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_3` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_10` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_3` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_11` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_4` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_11` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_4` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_11` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_4` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_11` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_4` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_11` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_4` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_12` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_5` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_12` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_5` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_12` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_5` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_12` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_5` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_12` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_5` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_13` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_6` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_13` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_6` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_13` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_6` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_13` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_6` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_13` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_6` — Battery voltage — diagnostic

#### Aqara Door and Window Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Door and Window Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_door_and_window_sensor_door_14` — Door — conversation, google
  - `binary_sensor.aqara_door_and_window_sensor_door_7` — Door — conversation, google
- Diagnostic:
  - `button.aqara_door_and_window_sensor_identify_14` — Identify — diagnostic
  - `button.aqara_door_and_window_sensor_identify_7` — Identify — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_14` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_7` — Battery — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_14` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_type_7` — Battery type — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_14` — Battery voltage — diagnostic
  - `sensor.aqara_door_and_window_sensor_battery_voltage_7` — Battery voltage — diagnostic

#### Aqara Hub M3

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Hub M3`
- Integration domains: `matter`
- Entities: `2`
- Diagnostic:
  - `button.aqara_hub_m3_identify` — Identify — diagnostic
  - `button.aqara_hub_m3_identify_2` — Identify — diagnostic

#### Aqara Motion Sensor P1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Motion Sensor P1`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_motion_sensor_p1_occupancy` — Occupancy
  - `binary_sensor.aqara_motion_sensor_p1_occupancy_3` — Occupancy
- Diagnostic:
  - `button.aqara_motion_sensor_p1_identify` — Identify — diagnostic
  - `button.aqara_motion_sensor_p1_identify_3` — Identify — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_3` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type_3` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage_3` — Battery voltage — diagnostic

#### Aqara Motion Sensor P1

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Motion Sensor P1`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_motion_sensor_p1_occupancy_2` — Occupancy
  - `binary_sensor.aqara_motion_sensor_p1_occupancy_4` — Occupancy
- Diagnostic:
  - `button.aqara_motion_sensor_p1_identify_2` — Identify — diagnostic
  - `button.aqara_motion_sensor_p1_identify_4` — Identify — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_2` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_4` — Battery — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_type_4` — Battery type — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage_2` — Battery voltage — diagnostic
  - `sensor.aqara_motion_sensor_p1_battery_voltage_4` — Battery voltage — diagnostic

#### Aqara Vibration Sensor

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Vibration Sensor`
- Integration domains: `matter`
- Entities: `10`
- Presence / Events:
  - `binary_sensor.aqara_vibration_sensor_occupancy` — Occupancy
  - `binary_sensor.aqara_vibration_sensor_occupancy_2` — Occupancy
- Diagnostic:
  - `button.aqara_vibration_sensor_identify` — Identify — diagnostic
  - `button.aqara_vibration_sensor_identify_2` — Identify — diagnostic
  - `sensor.aqara_vibration_sensor_battery` — Battery — diagnostic
  - `sensor.aqara_vibration_sensor_battery_2` — Battery — diagnostic
  - `sensor.aqara_vibration_sensor_battery_type` — Battery type — diagnostic
  - `sensor.aqara_vibration_sensor_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_vibration_sensor_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_vibration_sensor_battery_voltage_2` — Battery voltage — diagnostic

#### Aqara Wireless Remote Switch

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Wireless Remote Switch`
- Integration domains: `matter`
- Entities: `18`
- Presence / Events:
  - `event.aqara_wireless_remote_switch_button` — Button
  - `event.aqara_wireless_remote_switch_button_2` — Button
  - `event.aqara_wireless_remote_switch_button_3` — Button
  - `event.aqara_wireless_remote_switch_button_4` — Button
- Diagnostic:
  - `button.aqara_wireless_remote_switch_identify` — Identify — diagnostic
  - `button.aqara_wireless_remote_switch_identify_2` — Identify — diagnostic
  - `button.aqara_wireless_remote_switch_identify_3` — Identify — diagnostic
  - `button.aqara_wireless_remote_switch_identify_4` — Identify — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery` — Battery — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_2` — Battery — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_type` — Battery type — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_type_2` — Battery type — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_voltage` — Battery voltage — diagnostic
  - `sensor.aqara_wireless_remote_switch_battery_voltage_2` — Battery voltage — diagnostic
- Disabled:
  - `sensor.aqara_wireless_remote_switch_current_switch_position` — Current switch position — disabled:integration, diagnostic
  - `sensor.aqara_wireless_remote_switch_current_switch_position_2` — Current switch position — disabled:integration, diagnostic
  - `sensor.aqara_wireless_remote_switch_current_switch_position_3` — Current switch position — disabled:integration, diagnostic
  - `sensor.aqara_wireless_remote_switch_current_switch_position_4` — Current switch position — disabled:integration, diagnostic

#### Aqara Presence Sensor FP1E

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Presence Sensor FP1E`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy` — Occupancy
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy_3` — Occupancy
- Diagnostic:
  - `button.aqara_presence_sensor_fp1e_identify` — Identify — diagnostic
  - `button.aqara_presence_sensor_fp1e_identify_3` — Identify — diagnostic

#### Aqara Presence Sensor FP1E

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Aqara Presence Sensor FP1E`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy_2` — Occupancy
  - `binary_sensor.aqara_presence_sensor_fp1e_occupancy_4` — Occupancy
- Diagnostic:
  - `button.aqara_presence_sensor_fp1e_identify_2` — Identify — diagnostic
  - `button.aqara_presence_sensor_fp1e_identify_4` — Identify — diagnostic

#### Backup

- Area: `Unassigned`
- Manufacturer/model: `Home Assistant` / `Home Assistant Backup`
- Integration domains: `backup`
- Entities: `5`
- Presence / Events:
  - `event.backup_automatic_backup` — Automatic backup
- Sensors:
  - `sensor.backup_backup_manager_state` — Backup Manager state
  - `sensor.backup_last_attempted_automatic_backup` — Last attempted automatic backup
  - `sensor.backup_last_successful_automatic_backup` — Last successful automatic backup
  - `sensor.backup_next_scheduled_automatic_backup` — Next scheduled automatic backup

#### Bedroom Display

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.bedroom_display` — media_player.bedroom_display — conversation

#### Beta bedroom no presence 3mins

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Beta bedroom no presence 3mins`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` — Occupancy
  - `binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2` — Occupancy
- Diagnostic:
  - `button.beta_bedroom_no_presence_3mins_identify` — Identify — diagnostic
  - `button.beta_bedroom_no_presence_3mins_identify_2` — Identify — diagnostic

#### Beta bedroom presence detected

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Beta bedroom presence detected`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.beta_bedroom_presence_detected_occupancy` — Occupancy
  - `binary_sensor.beta_bedroom_presence_detected_occupancy_2` — Occupancy
- Diagnostic:
  - `button.beta_bedroom_presence_detected_identify` — Identify — diagnostic
  - `button.beta_bedroom_presence_detected_identify_2` — Identify — diagnostic

#### Bot 4A

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Bot`
- Integration domains: `matter`
- Entities: `2`
- Controls:
  - `switch.bot_4a` — switch.bot_4a — conversation, google
- Diagnostic:
  - `sensor.bot_4a_battery` — Battery — diagnostic

#### fado glass globe lamp

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp — conversation, google
- Disabled:
  - `sensor.hue_color_lamp_1_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic

#### Forecast

- Area: `Unassigned`
- Manufacturer/model: `Met.no` / `Forecast`
- Integration domains: `met`
- Entities: `1`
- Sensors:
  - `weather.forecast_home` — Home

#### hci0 (8C:BD:37:64:26:26)

- Area: `Unassigned`
- Manufacturer/model: `Shenzhen Phaten Tech. LTD` / `Unknown`
- Integration domains: `bluetooth`
- Entities: `0`
- Entities: none registered under this device.

#### Hub 3 Button 1

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `2`
- Presence / Events:
  - `event.hub_3_button_1_button` — Button
- Disabled:
  - `sensor.hub_3_button_1_current_switch_position` — Current switch position — disabled:integration, diagnostic

#### Hub 3 Button 2

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `2`
- Presence / Events:
  - `event.hub_3_button_2_button` — Button
- Disabled:
  - `sensor.hub_3_button_2_current_switch_position` — Current switch position — disabled:integration, diagnostic

#### Hub 3 Button 3

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `2`
- Presence / Events:
  - `event.hub_3_button_3_button` — Button
- Disabled:
  - `sensor.hub_3_button_3_current_switch_position` — Current switch position — disabled:integration, diagnostic

#### Hub 3 HumiSensor

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Sensors:
  - `sensor.hub_3_humisensor_humidity` — Humidity — conversation, google

#### Hub 3 MotionSensor

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Presence / Events:
  - `binary_sensor.hub_3_motionsensor_occupancy` — Occupancy

#### Hub 3 TempSensor

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Sensors:
  - `sensor.hub_3_tempsensor_temperature` — Temperature — conversation, google

#### Hue Play 1

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Play`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_play_1` — light.hue_play_1 — conversation, google
- Disabled:
  - `sensor.hue_play_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue Play 2

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Play`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_play_2` — light.hue_play_2 — conversation, google
- Disabled:
  - `sensor.hue_play_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue smart button 2

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart button`
- Integration domains: `hue`
- Entities: `3`
- Presence / Events:
  - `event.hue_smart_button_2_button_1` — Button 1
- Diagnostic:
  - `sensor.hue_smart_button_2_battery` — Battery — diagnostic
- Disabled:
  - `sensor.hue_smart_button_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue smart button 3

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart button`
- Integration domains: `hue`
- Entities: `3`
- Presence / Events:
  - `event.hue_smart_button_3_button_1` — Button 1
- Diagnostic:
  - `sensor.hue_smart_button_3_battery` — Battery — diagnostic
- Disabled:
  - `sensor.hue_smart_button_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Hue smart plug 1

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue smart plug`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.hue_smart_plug_1` — light.hue_smart_plug_1 — conversation, google
- Disabled:
  - `sensor.hue_smart_plug_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### iPhone 16Pro Max 

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `iPhone17,2`
- Integration domains: `mobile_app`
- Entities: `21`
- Presence / Events:
  - `binary_sensor.iphone_16pro_max_focus` — iPhone 16Pro Max  Focus
- Sensors:
  - `sensor.iphone_16pro_max_activity` — iPhone 16Pro Max  Activity
  - `sensor.iphone_16pro_max_audio_output` — iPhone 16Pro Max  Audio Output
  - `sensor.iphone_16pro_max_average_active_pace` — iPhone 16Pro Max  Average Active Pace
  - `sensor.iphone_16pro_max_battery_level` — iPhone 16Pro Max  Battery Level
  - `sensor.iphone_16pro_max_battery_state` — iPhone 16Pro Max  Battery State
  - `sensor.iphone_16pro_max_bssid` — iPhone 16Pro Max  BSSID
  - `sensor.iphone_16pro_max_connection_type` — iPhone 16Pro Max  Connection Type
  - `sensor.iphone_16pro_max_distance` — iPhone 16Pro Max  Distance
  - `sensor.iphone_16pro_max_floors_ascended` — iPhone 16Pro Max  Floors Ascended
  - `sensor.iphone_16pro_max_floors_descended` — iPhone 16Pro Max  Floors Descended
  - `sensor.iphone_16pro_max_geocoded_location` — iPhone 16Pro Max  Geocoded Location
  - `sensor.iphone_16pro_max_last_update_trigger` — iPhone 16Pro Max  Last Update Trigger
  - `sensor.iphone_16pro_max_location_permission` — iPhone 16Pro Max  Location permission
  - `sensor.iphone_16pro_max_sim_1` — iPhone 16Pro Max  SIM 1
  - `sensor.iphone_16pro_max_sim_2` — iPhone 16Pro Max  SIM 2
  - `sensor.iphone_16pro_max_ssid` — iPhone 16Pro Max  SSID
  - `sensor.iphone_16pro_max_steps` — iPhone 16Pro Max  Steps
  - `sensor.iphone_16pro_max_storage` — iPhone 16Pro Max  Storage
- Diagnostic:
  - `device_tracker.iphone_16pro_max` — iPhone 16Pro Max  — diagnostic
  - `sensor.iphone_16pro_max_app_version` — iPhone 16Pro Max  App Version — diagnostic

#### Jeff’s iPad

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `iPad17,1`
- Integration domains: `mobile_app`
- Entities: `12`
- Sensors:
  - `sensor.jeffs_ipad_audio_output` — Jeff’s iPad Audio Output
  - `sensor.jeffs_ipad_battery_level` — Jeff’s iPad Battery Level
  - `sensor.jeffs_ipad_battery_state` — Jeff’s iPad Battery State
  - `sensor.jeffs_ipad_bssid` — Jeff’s iPad BSSID
  - `sensor.jeffs_ipad_connection_type` — Jeff’s iPad Connection Type
  - `sensor.jeffs_ipad_geocoded_location` — Jeff’s iPad Geocoded Location
  - `sensor.jeffs_ipad_last_update_trigger` — Jeff’s iPad Last Update Trigger
  - `sensor.jeffs_ipad_location_permission` — Jeff’s iPad Location permission
  - `sensor.jeffs_ipad_ssid` — Jeff’s iPad SSID
  - `sensor.jeffs_ipad_storage` — Jeff’s iPad Storage
- Diagnostic:
  - `device_tracker.ipad_pro` — Jeff’s iPad — diagnostic
  - `sensor.jeffs_ipad_app_version` — Jeff’s iPad App Version — diagnostic

#### Jeff’s iPhone

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `iPhone18,2`
- Integration domains: `mobile_app`
- Entities: `14`
- Sensors:
  - `sensor.jeffs_iphone_audio_output` — Jeff’s iPhone Audio Output
  - `sensor.jeffs_iphone_battery_level` — Jeff’s iPhone Battery Level
  - `sensor.jeffs_iphone_battery_state` — Jeff’s iPhone Battery State
  - `sensor.jeffs_iphone_bssid` — Jeff’s iPhone BSSID
  - `sensor.jeffs_iphone_connection_type` — Jeff’s iPhone Connection Type
  - `sensor.jeffs_iphone_geocoded_location` — Jeff’s iPhone Geocoded Location
  - `sensor.jeffs_iphone_last_update_trigger` — Jeff’s iPhone Last Update Trigger
  - `sensor.jeffs_iphone_location_permission` — Jeff’s iPhone Location permission
  - `sensor.jeffs_iphone_sim_1` — Jeff’s iPhone SIM 1
  - `sensor.jeffs_iphone_sim_2` — Jeff’s iPhone SIM 2
  - `sensor.jeffs_iphone_ssid` — Jeff’s iPhone SSID
  - `sensor.jeffs_iphone_storage` — Jeff’s iPhone Storage
- Diagnostic:
  - `device_tracker.iphone_17_pro_max` — Jeff’s iPhone — diagnostic
  - `sensor.jeffs_iphone_app_version` — Jeff’s iPhone App Version — diagnostic

#### Loft Display

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.nesthubd029_2` — media_player.nesthubd029_2 — conversation, google

#### MacBook Air 

- Area: `Unassigned`
- Manufacturer/model: `Apple` / `Mac15,12`
- Integration domains: `mobile_app`
- Entities: `23`
- Presence / Events:
  - `binary_sensor.macbook_air_active` — MacBook Air  Active
  - `binary_sensor.macbook_air_audio_input_in_use` — MacBook Air  Audio Input In Use
  - `binary_sensor.macbook_air_audio_output_in_use` — MacBook Air  Audio Output In Use
  - `binary_sensor.macbook_air_camera_in_use` — MacBook Air  Camera In Use
- Sensors:
  - `sensor.macbook_air_active_audio_input` — MacBook Air  Active Audio Input
  - `sensor.macbook_air_active_audio_output` — MacBook Air  Active Audio Output
  - `sensor.macbook_air_active_camera` — MacBook Air  Active Camera
  - `sensor.macbook_air_audio_output` — MacBook Air  Audio Output
  - `sensor.macbook_air_bssid` — MacBook Air  BSSID
  - `sensor.macbook_air_connection_type` — MacBook Air  Connection Type
  - `sensor.macbook_air_displays` — MacBook Air  Displays
  - `sensor.macbook_air_frontmost_app` — MacBook Air  Frontmost App
  - `sensor.macbook_air_geocoded_location` — MacBook Air  Geocoded Location
  - `sensor.macbook_air_internal_battery_level` — MacBook Air  Internal Battery Level
  - `sensor.macbook_air_internal_battery_state` — MacBook Air  Internal Battery State
  - `sensor.macbook_air_last_update_trigger` — MacBook Air  Last Update Trigger
  - `sensor.macbook_air_location_permission` — MacBook Air  Location permission
  - `sensor.macbook_air_primary_display_id` — MacBook Air  Primary Display ID
  - `sensor.macbook_air_primary_display_name` — MacBook Air  Primary Display Name
  - `sensor.macbook_air_ssid` — MacBook Air  SSID
  - `sensor.macbook_air_storage` — MacBook Air  Storage
- Diagnostic:
  - `device_tracker.macbook_air` — MacBook Air  — diagnostic
  - `sensor.macbook_air_app_version` — MacBook Air  App Version — diagnostic

#### NestHubD029

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.nesthubd029` — media_player.nesthubd029 — conversation, google

#### NestHubD029

- Area: `Unassigned`
- Manufacturer/model: `Google Inc.` / `Google Nest Hub`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.nesthubd029_3` — media_player.nesthubd029_3 — conversation, google

#### Nyamane 3-spot Lamp - Top 

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top — conversation, google
- Disabled:
  - `sensor.hue_essential_spot_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Nymane 3-spot Lamp - Mid

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue Essential spot`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid — conversation, google
- Disabled:
  - `sensor.hue_essential_spot_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Ola Whitborg XL Floor Lamp

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Hue color lamp`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp — conversation, google
- Disabled:
  - `sensor.hue_color_lamp_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Presence Dining zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Presence Dining zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.presence_dining_zone_occupancy` — Occupancy
  - `binary_sensor.presence_dining_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.presence_dining_zone_identify` — Identify — diagnostic
  - `button.presence_dining_zone_identify_2` — Identify — diagnostic

#### Presence kitchen zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Presence kitchen zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.presence_kitchen_zone_occupancy` — Occupancy
  - `binary_sensor.presence_kitchen_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.presence_kitchen_zone_identify` — Identify — diagnostic
  - `button.presence_kitchen_zone_identify_2` — Identify — diagnostic

#### Presence living zone

- Area: `Unassigned`
- Manufacturer/model: `Aqara` / `Presence living zone`
- Integration domains: `matter`
- Entities: `4`
- Presence / Events:
  - `binary_sensor.presence_living_zone_occupancy` — Occupancy
  - `binary_sensor.presence_living_zone_occupancy_2` — Occupancy
- Diagnostic:
  - `button.presence_living_zone_identify` — Identify — diagnostic
  - `button.presence_living_zone_identify_2` — Identify — diagnostic

#### Roller Shade 0A

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Roller Shade`
- Integration domains: `matter`
- Entities: `4`
- Controls:
  - `cover.roller_shade_0a` — cover.roller_shade_0a — conversation, google
- Diagnostic:
  - `binary_sensor.roller_shade_0a_problem` — Problem — diagnostic
  - `sensor.roller_shade_0a_battery` — Battery — diagnostic
- Disabled:
  - `sensor.roller_shade_0a_target_opening_position` — Target opening position — disabled:integration, diagnostic

#### Roller Shade 2A

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Roller Shade`
- Integration domains: `matter`
- Entities: `4`
- Controls:
  - `cover.roller_shade_2a` — cover.roller_shade_2a — conversation, google
- Diagnostic:
  - `binary_sensor.roller_shade_2a_problem` — Problem — diagnostic
  - `sensor.roller_shade_2a_battery` — Battery — diagnostic
- Disabled:
  - `sensor.roller_shade_2a_target_opening_position` — Target opening position — disabled:integration, diagnostic

#### Roller Shade 84

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `Roller Shade`
- Integration domains: `matter`
- Entities: `4`
- Controls:
  - `cover.roller_shade_84` — cover.roller_shade_84 — conversation, google
- Diagnostic:
  - `binary_sensor.roller_shade_84_problem` — Problem — diagnostic
  - `sensor.roller_shade_84_battery` — Battery — diagnostic
- Disabled:
  - `sensor.roller_shade_84_target_opening_position` — Target opening position — disabled:integration, diagnostic

#### Serif TV

- Area: `Unassigned`
- Manufacturer/model: `Unknown manufacturer` / `LS01D`
- Integration domains: `cast`
- Entities: `1`
- Controls:
  - `media_player.serif_tv` — media_player.serif_tv — conversation

#### Signe gradient table 1

- Area: `Unassigned`
- Manufacturer/model: `Signify Netherlands B.V.` / `Signe gradient table`
- Integration domains: `hue`
- Entities: `2`
- Controls:
  - `light.signe_gradient_table_1` — light.signe_gradient_table_1 — conversation, google
- Disabled:
  - `sensor.signe_gradient_table_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic

#### Sun

- Area: `Unassigned`
- Manufacturer/model: `Unknown manufacturer` / `Unknown model`
- Integration domains: `sun`
- Entities: `10`
- Diagnostic:
  - `sensor.sun_next_dawn` — Next dawn — diagnostic
  - `sensor.sun_next_dusk` — Next dusk — diagnostic
  - `sensor.sun_next_midnight` — Next midnight — diagnostic
  - `sensor.sun_next_noon` — Next noon — diagnostic
  - `sensor.sun_next_rising` — Next rising — diagnostic
  - `sensor.sun_next_setting` — Next setting — diagnostic
- Disabled:
  - `binary_sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic
  - `sensor.sun_solar_azimuth` — Solar azimuth — disabled:integration, diagnostic
  - `sensor.sun_solar_elevation` — Solar elevation — disabled:integration, diagnostic
  - `sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic

#### SwitchBot Hub 3

- Area: `Unassigned`
- Manufacturer/model: `SwitchBot` / `SwitchBot Hub 3`
- Integration domains: `matter`
- Entities: `1`
- Diagnostic:
  - `button.switchbot_hub_3_identify` — Identify — diagnostic

#### WiZ A60 Filament

- Area: `Unassigned`
- Manufacturer/model: `Signify` / `WiZ A60 Filament`
- Integration domains: `matter`
- Entities: `7`
- Controls:
  - `light.wiz_a60_filament` — light.wiz_a60_filament — conversation, google
  - `number.wiz_a60_filament_off_transition_time` — Off transition time — config
  - `number.wiz_a60_filament_on_level` — On level — config
  - `number.wiz_a60_filament_on_off_transition_time` — On/off transition time — config
  - `number.wiz_a60_filament_on_transition_time` — On transition time — config
  - `select.wiz_a60_filament_power_on_behaviour_on_startup` — Power-on behaviour on startup — config
- Diagnostic:
  - `button.wiz_a60_filament_identify` — Identify — diagnostic

### White HomePod Mini

Devices: `1`

#### White HomePod Mini

- Area: `White HomePod Mini`
- Manufacturer/model: `Apple` / `HomePod Mini`
- Integration domains: `apple_tv`
- Entities: `2`
- Controls:
  - `media_player.white_homepod_mini` — media_player.white_homepod_mini — conversation, google
  - `remote.white_homepod_mini` — remote.white_homepod_mini

## 5. Entities Without A Registered Device

Count: `8`

### binary_sensor (1)

- - `binary_sensor.remote_ui` — Remote UI — diagnostic

### input_boolean (1)

- - `input_boolean.test_mode` — Test Mode

### person (1)

- - `person.jeffffff` — Jeff

### scene (1)

- - `scene.new_scene` — New scene — conversation, google

### stt (1)

- - `stt.home_assistant_cloud` — Home Assistant Cloud

### todo (1)

- - `todo.shopping_list` — Shopping List — conversation

### tts (2)

- - `tts.google_translate_en_com` — Google Translate en com
- - `tts.home_assistant_cloud` — Home Assistant Cloud

## 6. Capability Views

### Lighting

Count: `74`

- `light.all_bedroom_bathroom` — light.all_bedroom_bathroom | device: All Bedroom & Bathroom | area: Bedroom — conversation, google
- `light.alpha_ceiling_light_4` — light.alpha_ceiling_light_4 | device: Alpha Ceiling Light.4 | area: Bedroom (Alpha) — conversation
- `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 | device: Alpha Ceiling Light.6 | area: Bedroom — conversation, google
- `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 | device: alpha gradient light-tube.1 | area: Bedroom — conversation, google
- `light.alphabed_ceiling_light_3` — light.alphabed_ceiling_light_3 | device: Alphabed Ceiling Light.3 | area: Bedroom (Alpha) — conversation
- `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — conversation, google
- `light.alphabed_ceiling_light_5_2` — light.alphabed_ceiling_light_5_2 | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — conversation
- `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 | device: Alpha Ceiling Light.6 | area: Bedroom (Alpha) — conversation, google
- `light.bathroom` — light.bathroom | device: Bathroom | area: My Bathroom — conversation, google
- `light.bedroom` — light.bedroom | device: Bedroom | area: Bedroom (Alpha) — conversation
- `light.bedroom_ceiling` — light.bedroom_ceiling | device: Bedroom Ceiling | area: Bedroom — conversation, google
- `light.bedroom_lamps` — light.bedroom_lamps | device: Bedroom Lamps | area: Bedroom — conversation, google
- `light.beige_ola_spotlight_lamp` — light.beige_ola_spotlight_lamp | device: Beige Ola Spotlight Lamp | area: Living Room — conversation
- `light.beta_bed_lightstrip` — light.beta_bed_lightstrip | device: Beta Bed Lightstrip | area: Spare Bedroom — conversation
- `light.beta_bedroom_bath` — light.beta_bedroom_bath | device: Beta Bedroom & Bath | area: Spare Bedroom — conversation, google
- `light.beta_ceiling_light_3` — light.beta_ceiling_light_3 | device: Beta Ceiling Light.3 | area: Spare Bedroom — conversation
- `light.beta_ceiling_light_3_2` — light.beta_ceiling_light_3_2 | device: Beta Ceiling Light.3 | area: Spare Bedroom — conversation
- `light.beta_ceiling_light_4` — light.beta_ceiling_light_4 | device: Beta Ceiling Light.4 | area: Spare Bedroom — conversation
- `light.beta_ceiling_light_6` — light.beta_ceiling_light_6 | device: Beta Ceiling Light.6 | area: Spare Bedroom — conversation
- `light.betaflex_ceiling_light_1` — Betaflex Ceiling Light.1 | device: Betaflex Ceiling Light.1 | area: Spare Bedroom — conversation
- `light.betaflex_ceiling_light_2` — light.betaflex_ceiling_light_2 | device: Betaflex Ceiling Light.2 | area: Spare Bedroom — conversation
- `light.core_ceiling_3` — light.core_ceiling_3 | device: core ceiling.3 | area: Bedroom (Alpha) — conversation
- `light.core_ceiling_light_1` — light.core_ceiling_light_1 | device: Core Ceiling Light.1 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_10` — light.core_ceiling_light_10 | device: Core Ceiling Light.10 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_2` — light.core_ceiling_light_2 | device: Core Ceiling Light.2 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_4` — light.core_ceiling_light_4 | device: Core Ceiling Light.4 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_5` — light.core_ceiling_light_5 | device: Core Ceiling Light.5 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_5_2` — light.core_ceiling_light_5_2 | device: Core Ceiling Light.5 | area: Living Room — conversation
- `light.core_ceiling_light_6` — light.core_ceiling_light_6 | device: Core Ceiling Light.6 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_7` — Core Ceiling Light.7 | device: Core Ceiling Light.4 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_8` — light.core_ceiling_light_8 | device: Core Ceiling Light.8 | area: Openplan (Core) — conversation
- `light.core_ceiling_light_9` — light.core_ceiling_light_9 | device: Core Ceiling Light.9 | area: Core_kitchen — conversation
- `light.core_statement_arc_floor_lamp_monica_vibelucci` — light.core_statement_arc_floor_lamp_monica_vibelucci | device: Core Statement Arc Floor Lamp Monica Vibelucci | area: Openplan (Core) — conversation
- `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp | device: fado glass globe lamp | area: Unassigned — conversation, google
- `light.hallway` — light.hallway | device: Hallway | area: Hallway (Pass) — conversation
- `light.hue_play_1` — light.hue_play_1 | device: Hue Play 1 | area: Unassigned — conversation, google
- `light.hue_play_2` — light.hue_play_2 | device: Hue Play 2 | area: Unassigned — conversation, google
- `light.hue_signe_white_gradient_floor_lamp_1` — light.hue_signe_white_gradient_floor_lamp_1 | device: Hue Signe White Gradient Floor Lamp.1 | area: Openplan (Core) — conversation
- `light.hue_smart_plug_1` — light.hue_smart_plug_1 | device: Hue smart plug 1 | area: Unassigned — conversation, google
- `light.ikea_skytrax_light` — light.ikea_skytrax_light | device: Ikea Skytrax Light | area: Bedroom — conversation
- `light.kitchen` — light.kitchen | device: Kitchen | area: Core_kitchen — conversation, google
- `light.kitchen_ceiling` — light.kitchen_ceiling | device: Kitchen Ceiling | area: Core_kitchen — conversation, google
- `light.klasnick_beige_table_lamp_with_e14_hue_colour` — light.klasnick_beige_table_lamp_with_e14_hue_colour | device: Klasnick Beige Table Lamp (with E14 Hue Colour) | area: Openplan (Core) — conversation
- `light.laundry_chaos_ceiling_light` — light.laundry_chaos_ceiling_light | device: Laundry (Chaos) Ceiling Light | area: Laundry/Utilities — conversation
- `light.laundry_room` — light.laundry_room | device: Laundry room | area: Laundry room — conversation, google
- `light.living_room` — light.living_room | device: Living room | area: Living Room — conversation, google
- `light.living_room_ceiling` — light.living_room_ceiling | device: Core Living Ceiling | area: Living Room — conversation, google
- `light.living_room_lamps` — light.living_room_lamps | device: Living room lamps | area: Living Room — conversation, google
- `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top | device: Nyamane 3-spot Lamp - Top  | area: Unassigned — conversation, google
- `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low | device: Nymane 3-spot Lamp - Low | area: Bedroom (Alpha) — conversation, google
- `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid | device: Nymane 3-spot Lamp - Mid | area: Unassigned — conversation, google
- `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp | device: Ola Whitborg XL Floor Lamp | area: Unassigned — conversation, google
- `light.pass_ceiling_light_1` — light.pass_ceiling_light_1 | device: Pass Ceiling Light.1 | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_1_2` — light.pass_ceiling_light_1_2 | device: Pass Ceiling Light.1  | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_2` — light.pass_ceiling_light_2 | device: Pass Ceiling Light.2 | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_4` — light.pass_ceiling_light_4 | device: Pass Ceiling Light.4 | area: Hallway (Pass) — conversation
- `light.pass_ceiling_light_5` — light.pass_ceiling_light_5 | device: Pass Ceiling Light.5 | area: Hallway (Pass) — conversation
- `light.right_bedside_lamp` — light.right_bedside_lamp | device: Right Bedside Lamp | area: Bedroom — conversation, google
- `light.secondary_bathroom` — light.secondary_bathroom | device: Secondary Bathroom | area: Secondary Bathroom — conversation, google
- `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 | device: Signe gradient floor 1 | area: Openplan (Core) — conversation, google
- `light.signe_gradient_table_1` — light.signe_gradient_table_1 | device: Signe gradient table 1 | area: Unassigned — conversation, google
- `light.spare_bedroom` — light.spare_bedroom | device: Spare Bedroom | area: Spare Bedroom — conversation
- `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling | device: Spare Bedroom Ceiling | area: Spare Bedroom — conversation, google
- `light.splash_ceiling_light_1` — light.splash_ceiling_light_1 | device: Splash Ceiling Light.1 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_2` — light.splash_ceiling_light_2 | device: Splash Ceiling Light.2 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_3` — light.splash_ceiling_light_3 | device: Splash Ceiling Light.3 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_4` — light.splash_ceiling_light_4 | device: Splash Ceiling Light.4 | area: Secondary Bathroom — conversation
- `light.splash_ceiling_light_5` — light.splash_ceiling_light_5 | device: Splash Ceiling Light.5 | area: Secondary Bathroom — conversation
- `light.throne_ceiling_light_2` — light.throne_ceiling_light_2 | device: Throne Ceiling above shower door | area: Ensuite (Throne) Bathroom — conversation
- `light.throne_ceiling_light_3` — light.throne_ceiling_light_3 | device: Throne Ceiling Light.3 | area: Ensuite (Throne) Bathroom — conversation
- `light.throne_ceiling_light_3_2` — light.throne_ceiling_light_3_2 | device: Throne Ceiling above sink | area: Ensuite (Throne) Bathroom — conversation
- `light.throne_ceiling_light_4` — light.throne_ceiling_light_4 | device: Throne Ceiling above Door | area: Ensuite (Throne) Bathroom — conversation
- `light.white_e27_hue_bulb` — light.white_e27_hue_bulb | device: White (E27) Hue Bulb | area: Laundry/Utilities — conversation
- `light.wiz_a60_filament` — light.wiz_a60_filament | device: WiZ A60 Filament | area: Unassigned — conversation, google

### Presence / Occupancy / Tracking

Count: `70`

- `binary_sensor.absence_for_3mins_dining_zone_occupancy` — Occupancy | device: Absence for 3mins dining zone | area: Unassigned
- `binary_sensor.absence_for_3mins_dining_zone_occupancy_2` — Occupancy | device: Absence for 3mins dining zone | area: Unassigned
- `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` — Occupancy | device: Absence for 3mins kitchen zone | area: Unassigned
- `binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2` — Occupancy | device: Absence for 3mins kitchen zone | area: Unassigned
- `binary_sensor.absence_for_3mins_living_zone_occupancy` — Occupancy | device: Absence for 3mins living zone | area: Unassigned
- `binary_sensor.absence_for_3mins_living_zone_occupancy_2` — Occupancy | device: Absence for 3mins living zone | area: Unassigned
- `binary_sensor.absence_for_5mins_openplan_occupancy` — Occupancy | device: Absence for 5mins Openplan | area: Unassigned
- `binary_sensor.absence_for_5mins_openplan_occupancy_2` — Occupancy | device: Absence for 5mins Openplan | area: Unassigned
- `binary_sensor.approaching_openplan_room_occupancy` — Occupancy | device: Approaching Openplan room | area: Unassigned
- `binary_sensor.approaching_openplan_room_occupancy_2` — Occupancy | device: Approaching Openplan room | area: Unassigned
- `binary_sensor.aqara_curtain_driver_e1_problem` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_curtain_driver_e1_problem_2` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_curtain_driver_e1_problem_3` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_curtain_driver_e1_problem_4` — Problem | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `binary_sensor.aqara_door_and_window_sensor_door` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_10` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_11` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_12` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_13` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_14` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_2` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_3` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_4` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_5` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_6` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_7` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_8` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_door_and_window_sensor_door_9` — Door | device: Aqara Door and Window Sensor | area: Unassigned — conversation, google
- `binary_sensor.aqara_motion_sensor_p1_occupancy` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_motion_sensor_p1_occupancy_2` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_motion_sensor_p1_occupancy_3` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_motion_sensor_p1_occupancy_4` — Occupancy | device: Aqara Motion Sensor P1 | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy_2` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy_3` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_presence_sensor_fp1e_occupancy_4` — Occupancy | device: Aqara Presence Sensor FP1E | area: Unassigned
- `binary_sensor.aqara_vibration_sensor_occupancy` — Occupancy | device: Aqara Vibration Sensor | area: Unassigned
- `binary_sensor.aqara_vibration_sensor_occupancy_2` — Occupancy | device: Aqara Vibration Sensor | area: Unassigned
- `binary_sensor.bathroom_motion` — Motion | device: Bathroom | area: My Bathroom — conversation, google
- `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` — Occupancy | device: Beta bedroom no presence 3mins | area: Unassigned
- `binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2` — Occupancy | device: Beta bedroom no presence 3mins | area: Unassigned
- `binary_sensor.beta_bedroom_presence_detected_occupancy` — Occupancy | device: Beta bedroom presence detected | area: Unassigned
- `binary_sensor.beta_bedroom_presence_detected_occupancy_2` — Occupancy | device: Beta bedroom presence detected | area: Unassigned
- `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling | device: Hallway | area: Hallway (Pass) — conversation, google
- `binary_sensor.hub_3_motionsensor_occupancy` — Occupancy | device: Hub 3 MotionSensor | area: Unassigned
- `binary_sensor.hue_motion_sensor_motion` — Motion | device: Hue Motion Sensor | area: Spare Bedroom — conversation
- `binary_sensor.hue_motion_sensor_motion_2` — Motion | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — conversation
- `binary_sensor.iphone_16pro_max_focus` — iPhone 16Pro Max  Focus | device: iPhone 16Pro Max  | area: Unassigned
- `binary_sensor.macbook_air_active` — MacBook Air  Active | device: MacBook Air  | area: Unassigned
- `binary_sensor.macbook_air_audio_input_in_use` — MacBook Air  Audio Input In Use | device: MacBook Air  | area: Unassigned
- `binary_sensor.macbook_air_audio_output_in_use` — MacBook Air  Audio Output In Use | device: MacBook Air  | area: Unassigned
- `binary_sensor.macbook_air_camera_in_use` — MacBook Air  Camera In Use | device: MacBook Air  | area: Unassigned
- `binary_sensor.presence_dining_zone_occupancy` — Occupancy | device: Presence Dining zone | area: Unassigned
- `binary_sensor.presence_dining_zone_occupancy_2` — Occupancy | device: Presence Dining zone | area: Unassigned
- `binary_sensor.presence_kitchen_zone_occupancy` — Occupancy | device: Presence kitchen zone | area: Unassigned
- `binary_sensor.presence_kitchen_zone_occupancy_2` — Occupancy | device: Presence kitchen zone | area: Unassigned
- `binary_sensor.presence_living_zone_occupancy` — Occupancy | device: Presence living zone | area: Unassigned
- `binary_sensor.presence_living_zone_occupancy_2` — Occupancy | device: Presence living zone | area: Unassigned
- `binary_sensor.remote_ui` — Remote UI | device: none | area: Unassigned — diagnostic
- `binary_sensor.roller_shade_0a_problem` — Problem | device: Roller Shade 0A | area: Unassigned — diagnostic
- `binary_sensor.roller_shade_2a_problem` — Problem | device: Roller Shade 2A | area: Unassigned — diagnostic
- `binary_sensor.roller_shade_84_problem` — Problem | device: Roller Shade 84 | area: Unassigned — diagnostic
- `binary_sensor.secondary_bathroom_motion` — Motion | device: Secondary Bathroom | area: Secondary Bathroom — conversation, google
- `binary_sensor.sun_solar_rising` — Solar rising | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `binary_sensor.withings_in_bed` — In bed | device: Withings | area: Bedroom (Alpha) — conversation
- `device_tracker.ipad_pro` — Jeff’s iPad | device: Jeff’s iPad | area: Unassigned — diagnostic
- `device_tracker.iphone_16pro_max` — iPhone 16Pro Max  | device: iPhone 16Pro Max  | area: Unassigned — diagnostic
- `device_tracker.iphone_17_pro_max` — Jeff’s iPhone | device: Jeff’s iPhone | area: Unassigned — diagnostic
- `device_tracker.macbook_air` — MacBook Air  | device: MacBook Air  | area: Unassigned — diagnostic
- `person.jeffffff` — Jeff | device: none | area: Unassigned

### Media / Remote

Count: `19`

- `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv | device: Bedroom Apple TV | area: Spare Bedroom — conversation, google
- `media_player.bedroom_display` — media_player.bedroom_display | device: Bedroom Display | area: Unassigned — conversation
- `media_player.core_lounge_homepod` — media_player.core_lounge_homepod | device: Core Lounge HomePod | area: Living Room — conversation, google
- `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 | device: Core Lounge HomePod | area: Living Room — conversation, google
- `media_player.living_room_2` — media_player.living_room_2 | device: Living Room (2) | area: Living Room (2) — conversation, google
- `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired | device: Lounge Apple TV (WIred) | area: Living Room — conversation, google
- `media_player.nesthubd029` — media_player.nesthubd029 | device: NestHubD029 | area: Unassigned — conversation, google
- `media_player.nesthubd029_2` — media_player.nesthubd029_2 | device: Loft Display | area: Unassigned — conversation, google
- `media_player.nesthubd029_3` — media_player.nesthubd029_3 | device: NestHubD029 | area: Unassigned — conversation, google
- `media_player.orange_homepod_mini` — media_player.orange_homepod_mini | device: Orange HomePod Mini | area: Bedroom — conversation, google
- `media_player.serif_tv` — media_player.serif_tv | device: Serif TV | area: Unassigned — conversation
- `media_player.white_homepod_mini` — media_player.white_homepod_mini | device: White HomePod Mini | area: White HomePod Mini — conversation, google
- `remote.bedroom_apple_tv` — remote.bedroom_apple_tv | device: Bedroom Apple TV | area: Spare Bedroom
- `remote.core_lounge_homepod` — remote.core_lounge_homepod | device: Core Lounge HomePod | area: Living Room
- `remote.core_lounge_homepod_2` — remote.core_lounge_homepod_2 | device: Core Lounge HomePod | area: Living Room
- `remote.living_room_2` — remote.living_room_2 | device: Living Room (2) | area: Living Room (2)
- `remote.lounge_apple_tv_wired` — remote.lounge_apple_tv_wired | device: Lounge Apple TV (WIred) | area: Living Room
- `remote.orange_homepod_mini` — remote.orange_homepod_mini | device: Orange HomePod Mini | area: Bedroom
- `remote.white_homepod_mini` — remote.white_homepod_mini | device: White HomePod Mini | area: White HomePod Mini

### Covers / Shades

Count: `7`

- `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 | device: Aqara Curtain Driver E1 | area: Unassigned — conversation, google
- `cover.roller_shade_0a` — cover.roller_shade_0a | device: Roller Shade 0A | area: Unassigned — conversation, google
- `cover.roller_shade_2a` — cover.roller_shade_2a | device: Roller Shade 2A | area: Unassigned — conversation, google
- `cover.roller_shade_84` — cover.roller_shade_84 | device: Roller Shade 84 | area: Unassigned — conversation, google

### Switches / Buttons / Selectors

Count: `71`

- `button.absence_for_3mins_dining_zone_identify` — Identify | device: Absence for 3mins dining zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_dining_zone_identify_2` — Identify | device: Absence for 3mins dining zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_kitchen_zone_identify` — Identify | device: Absence for 3mins kitchen zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_kitchen_zone_identify_2` — Identify | device: Absence for 3mins kitchen zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_living_zone_identify` — Identify | device: Absence for 3mins living zone | area: Unassigned — diagnostic
- `button.absence_for_3mins_living_zone_identify_2` — Identify | device: Absence for 3mins living zone | area: Unassigned — diagnostic
- `button.absence_for_5mins_openplan_identify` — Identify | device: Absence for 5mins Openplan | area: Unassigned — diagnostic
- `button.absence_for_5mins_openplan_identify_2` — Identify | device: Absence for 5mins Openplan | area: Unassigned — diagnostic
- `button.approaching_openplan_room_identify` — Identify | device: Approaching Openplan room | area: Unassigned — diagnostic
- `button.approaching_openplan_room_identify_2` — Identify | device: Approaching Openplan room | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify_2` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify_3` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_curtain_driver_e1_identify_4` — Identify | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_10` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_11` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_12` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_13` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_14` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_2` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_3` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_4` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_5` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_6` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_7` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_8` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_door_and_window_sensor_identify_9` — Identify | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `button.aqara_hub_m3_identify` — Identify | device: Aqara Hub M3 | area: Unassigned — diagnostic
- `button.aqara_hub_m3_identify_2` — Identify | device: Aqara Hub M3 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify_2` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify_3` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_motion_sensor_p1_identify_4` — Identify | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify_2` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify_3` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_presence_sensor_fp1e_identify_4` — Identify | device: Aqara Presence Sensor FP1E | area: Unassigned — diagnostic
- `button.aqara_vibration_sensor_identify` — Identify | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `button.aqara_vibration_sensor_identify_2` — Identify | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify_2` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify_3` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.aqara_wireless_remote_switch_identify_4` — Identify | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `button.beta_bedroom_no_presence_3mins_identify` — Identify | device: Beta bedroom no presence 3mins | area: Unassigned — diagnostic
- `button.beta_bedroom_no_presence_3mins_identify_2` — Identify | device: Beta bedroom no presence 3mins | area: Unassigned — diagnostic
- `button.beta_bedroom_presence_detected_identify` — Identify | device: Beta bedroom presence detected | area: Unassigned — diagnostic
- `button.beta_bedroom_presence_detected_identify_2` — Identify | device: Beta bedroom presence detected | area: Unassigned — diagnostic
- `button.presence_dining_zone_identify` — Identify | device: Presence Dining zone | area: Unassigned — diagnostic
- `button.presence_dining_zone_identify_2` — Identify | device: Presence Dining zone | area: Unassigned — diagnostic
- `button.presence_kitchen_zone_identify` — Identify | device: Presence kitchen zone | area: Unassigned — diagnostic
- `button.presence_kitchen_zone_identify_2` — Identify | device: Presence kitchen zone | area: Unassigned — diagnostic
- `button.presence_living_zone_identify` — Identify | device: Presence living zone | area: Unassigned — diagnostic
- `button.presence_living_zone_identify_2` — Identify | device: Presence living zone | area: Unassigned — diagnostic
- `button.switchbot_hub_3_identify` — Identify | device: SwitchBot Hub 3 | area: Unassigned — diagnostic
- `button.wiz_a60_filament_identify` — Identify | device: WiZ A60 Filament | area: Unassigned — diagnostic
- `input_boolean.test_mode` — Test Mode | device: none | area: Unassigned
- `number.wiz_a60_filament_off_transition_time` — Off transition time | device: WiZ A60 Filament | area: Unassigned — config
- `number.wiz_a60_filament_on_level` — On level | device: WiZ A60 Filament | area: Unassigned — config
- `number.wiz_a60_filament_on_off_transition_time` — On/off transition time | device: WiZ A60 Filament | area: Unassigned — config
- `number.wiz_a60_filament_on_transition_time` — On transition time | device: WiZ A60 Filament | area: Unassigned — config
- `select.wiz_a60_filament_power_on_behaviour_on_startup` — Power-on behaviour on startup | device: WiZ A60 Filament | area: Unassigned — config
- `switch.automation_alpha_bedroom_dial_switch` — Automation: Alpha Bedroom Dial Switch | device: Hue Bridge Pro | area: Laundry/Utilities — config
- `switch.automation_hue_smart_button_3` — Automation: Hue smart button 3 | device: Hue Bridge Pro | area: Laundry/Utilities — config
- `switch.bot_4a` — switch.bot_4a | device: Bot 4A | area: Unassigned — conversation, google
- `switch.core_300s_child_lock` — Child lock | device: Core 300S | area: Bedroom — conversation, google
- `switch.core_300s_display` — Display | device: Core 300S | area: Bedroom — conversation, google
- `switch.hue_motion_sensor_light_sensor_enabled` — Light sensor enabled | device: Hue Motion Sensor | area: Spare Bedroom — config
- `switch.hue_motion_sensor_light_sensor_enabled_2` — Light sensor enabled | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — config
- `switch.hue_motion_sensor_motion_sensor_enabled` — Motion sensor enabled | device: Hue Motion Sensor | area: Spare Bedroom — config
- `switch.hue_motion_sensor_motion_sensor_enabled_2` — Motion sensor enabled | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — config

### Scenes

Count: `13`

- `scene.bedroom_concentrate` — Concentrate | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_dimmed` — Dimmed | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_energise` — Energise | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_nightlight` — Nightlight | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_read` — Read | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_relax` — Relax | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.bedroom_sleepy` — Sleepy | device: Bedroom | area: Bedroom (Alpha) — conversation, google
- `scene.hallway_concentrate` — Concentrate | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_energise` — Energise | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_nightlight` — Nightlight | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_read` — Read | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.hallway_relax` — Relax | device: Hallway | area: Hallway (Pass) — conversation, google
- `scene.new_scene` — New scene | device: none | area: Unassigned — conversation, google

### Sensors

Count: `292`

- `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` — Zigbee connectivity | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.alpha_bedroom_dial_switch_battery` — Battery | device: Alpha Bedroom Dial Switch | area: Bedroom (Alpha) — diagnostic
- `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` — Zigbee connectivity | device: Alpha Bedroom Dial Switch | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` — Zigbee connectivity | device: Alpha Hue Smart Button | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.alpha_hue_smart_button_battery` — Battery | device: Alpha Hue Smart Button | area: Bedroom (Alpha) — diagnostic
- `sensor.alpha_pass_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.5 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_battery` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_2` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_3` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_4` — Battery | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state_2` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state_3` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_charge_state_4` — Battery charge state | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage_2` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage_3` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_battery_voltage_4` — Battery voltage | device: Aqara Curtain Driver E1 | area: Unassigned — diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position_2` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position_3` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_curtain_driver_e1_target_opening_position_4` — Target opening position | device: Aqara Curtain Driver E1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_door_and_window_sensor_battery` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_10` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_11` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_12` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_13` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_14` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_2` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_3` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_4` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_5` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_6` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_7` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_8` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_9` — Battery | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_10` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_11` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_12` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_13` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_14` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_2` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_3` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_4` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_5` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_6` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_7` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_8` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_type_9` — Battery type | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_10` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_11` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_12` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_13` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_14` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_2` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_3` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_4` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_5` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_6` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_7` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_8` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_door_and_window_sensor_battery_voltage_9` — Battery voltage | device: Aqara Door and Window Sensor | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_2` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_3` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_4` — Battery | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type_2` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type_3` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_type_4` — Battery type | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage_2` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage_3` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_motion_sensor_p1_battery_voltage_4` — Battery voltage | device: Aqara Motion Sensor P1 | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery` — Battery | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_2` — Battery | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_type` — Battery type | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_type_2` — Battery type | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_voltage` — Battery voltage | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_vibration_sensor_battery_voltage_2` — Battery voltage | device: Aqara Vibration Sensor | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery` — Battery | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_2` — Battery | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_type` — Battery type | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_type_2` — Battery type | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_voltage` — Battery voltage | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_battery_voltage_2` — Battery voltage | device: Aqara Wireless Remote Switch | area: Unassigned — diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position_2` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position_3` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.aqara_wireless_remote_switch_current_switch_position_4` — Current switch position | device: Aqara Wireless Remote Switch | area: Unassigned — disabled:integration, diagnostic
- `sensor.backup_backup_manager_state` — Backup Manager state | device: Backup | area: Unassigned
- `sensor.backup_last_attempted_automatic_backup` — Last attempted automatic backup | device: Backup | area: Unassigned
- `sensor.backup_last_successful_automatic_backup` — Last successful automatic backup | device: Backup | area: Unassigned
- `sensor.backup_next_scheduled_automatic_backup` — Next scheduled automatic backup | device: Backup | area: Unassigned
- `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity | device: Hue Motion Sensor | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.bathroom_dimmer_switch_battery` — Battery | device: Bathroom dimmer switch | area: Ensuite (Throne) Bathroom — diagnostic
- `sensor.bathroom_illuminance` — Illuminance | device: Bathroom | area: My Bathroom
- `sensor.bed1_zigbee_connectivity` — Zigbee connectivity | device: Alphabed Ceiling Light.5 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.bed3_zigbee_connectivity` — Zigbee connectivity | device: Alphabed Ceiling Light.3 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` — Zigbee connectivity | device: Beige Ola Spotlight Lamp | area: Living Room — disabled:integration, diagnostic
- `sensor.beta_bed_lightstrip_zigbee_connectivity` — Zigbee connectivity | device: Beta Bed Lightstrip | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` — Zigbee connectivity | device: Hallway Tap Dial Switch | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.3 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.4 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_6_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.6 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_ceiling_light_zigbee_connectivity` — Zigbee connectivity | device: Beta Ceiling Light.3 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity | device: Betaflex Ceiling Light.1 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity | device: Betaflex Ceiling Light.2 | area: Spare Bedroom — disabled:integration, diagnostic
- `sensor.beta_pass_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.1  | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.betaflex_lower_shelf_zigbee_connectivity` — Zigbee connectivity | device: Ikea Skytrax Light | area: Bedroom — disabled:integration, diagnostic
- `sensor.bot_4a_battery` — Battery | device: Bot 4A | area: Unassigned — diagnostic
- `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` — Zigbee connectivity | device: Alpha Ceiling Light.4 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` — Zigbee connectivity | device: core ceiling.3 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` — Zigbee connectivity | device: Alpha Ceiling Light.6 | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` — Zigbee connectivity | device: Throne Ceiling above sink | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` — Zigbee connectivity | device: Throne Ceiling above Door | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` — Zigbee connectivity | device: Throne Ceiling above shower door | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` — Zigbee connectivity | device: Throne Ceiling Light.3 | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.ceiling_kitchen_fridge_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.9 | area: Core_kitchen — disabled:integration, diagnostic
- `sensor.ceiling_kitchen_sink_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.10 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_br_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.8 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.1 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.2 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_op_south_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.5 | area: Living Room — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_east_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.5 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_mm_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.6 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_mr_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.4 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.ceiling_open_plan_se_zigbee_connectivity` — Zigbee connectivity | device: Core Ceiling Light.4 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.chaos_laundry_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Laundry (Chaos) Ceiling Light | area: Laundry/Utilities — disabled:integration, diagnostic
- `sensor.chaos_storage_ceiling_zigbee_connectivity` — Zigbee connectivity | device: White (E27) Hue Bulb | area: Laundry/Utilities — disabled:integration, diagnostic
- `sensor.chaos_vault_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.1 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.core_300s_air_quality` — Air quality | device: Core 300S | area: Bedroom
- `sensor.core_300s_filter_lifetime` — Filter lifetime | device: Core 300S | area: Bedroom — diagnostic
- `sensor.core_300s_pm2_5` — PM2.5 | device: Core 300S | area: Bedroom — conversation, google
- `sensor.core_hue_tap_dial_switch_zigbee_connectivity` — Zigbee connectivity | device: Core Tap Dial Light Switch | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.core_signe_floor_lamp_zigbee_connectivity` — Zigbee connectivity | device: Hue Signe White Gradient Floor Lamp.1 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.core_tap_dial_light_switch_battery` — Battery | device: Core Tap Dial Light Switch | area: Openplan (Core) — diagnostic
- `sensor.core_vault_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.4 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.hallway_dimmer_switch_battery` — Battery | device: Hallway Dimmer Switch | area: Hallway (Pass) — diagnostic
- `sensor.hallway_tap_dial_switch_battery` — Battery | device: Hallway Tap Dial Switch | area: Spare Bedroom — diagnostic
- `sensor.hub_3_button_1_current_switch_position` — Current switch position | device: Hub 3 Button 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hub_3_button_2_current_switch_position` — Current switch position | device: Hub 3 Button 2 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hub_3_button_3_current_switch_position` — Current switch position | device: Hub 3 Button 3 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hub_3_humisensor_humidity` — Humidity | device: Hub 3 HumiSensor | area: Unassigned — conversation, google
- `sensor.hub_3_tempsensor_temperature` — Temperature | device: Hub 3 TempSensor | area: Unassigned — conversation, google
- `sensor.hue_bridge_pro_zigbee_connectivity` — Zigbee connectivity | device: Hue Bridge Pro | area: Laundry/Utilities — disabled:integration, diagnostic
- `sensor.hue_color_candle_1_zigbee_connectivity` — Zigbee connectivity | device: Right Bedside Lamp | area: Bedroom — disabled:integration, diagnostic
- `sensor.hue_color_lamp_1_zigbee_connectivity` — Zigbee connectivity | device: Ola Whitborg XL Floor Lamp | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_color_lamp_1_zigbee_connectivity_2` — Zigbee connectivity | device: fado glass globe lamp | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_dimmer_switch_4_zigbee_connectivity` — Zigbee connectivity | device: Hallway Dimmer Switch | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.hue_essential_spot_1_zigbee_connectivity` — Zigbee connectivity | device: Nymane 3-spot Lamp - Mid | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_essential_spot_2_zigbee_connectivity` — Zigbee connectivity | device: Alpha Ceiling Light.6 | area: Bedroom — disabled:integration, diagnostic
- `sensor.hue_essential_spot_3_zigbee_connectivity` — Zigbee connectivity | device: Nyamane 3-spot Lamp - Top  | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_motion_sensor_battery` — Battery | device: Hue Motion Sensor | area: Spare Bedroom — diagnostic
- `sensor.hue_motion_sensor_battery_2` — Battery | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — diagnostic
- `sensor.hue_motion_sensor_illuminance` — Illuminance | device: Hue Motion Sensor | area: Spare Bedroom
- `sensor.hue_motion_sensor_illuminance_2` — Illuminance | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom
- `sensor.hue_motion_sensor_temperature` — Temperature | device: Hue Motion Sensor | area: Spare Bedroom — conversation
- `sensor.hue_motion_sensor_temperature_2` — Temperature | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — conversation
- `sensor.hue_play_1_zigbee_connectivity` — Zigbee connectivity | device: Hue Play 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_play_2_zigbee_connectivity` — Zigbee connectivity | device: Hue Play 2 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_smart_button_2_battery` — Battery | device: Hue smart button 2 | area: Unassigned — diagnostic
- `sensor.hue_smart_button_2_zigbee_connectivity` — Zigbee connectivity | device: Hue smart button 2 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_smart_button_3_battery` — Battery | device: Hue smart button 3 | area: Unassigned — diagnostic
- `sensor.hue_smart_button_3_zigbee_connectivity` — Zigbee connectivity | device: Hue smart button 3 | area: Unassigned — disabled:integration, diagnostic
- `sensor.hue_smart_plug_1_zigbee_connectivity` — Zigbee connectivity | device: Hue smart plug 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.iphone_16pro_max_activity` — iPhone 16Pro Max  Activity | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_app_version` — iPhone 16Pro Max  App Version | device: iPhone 16Pro Max  | area: Unassigned — diagnostic
- `sensor.iphone_16pro_max_audio_output` — iPhone 16Pro Max  Audio Output | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_average_active_pace` — iPhone 16Pro Max  Average Active Pace | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_battery_level` — iPhone 16Pro Max  Battery Level | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_battery_state` — iPhone 16Pro Max  Battery State | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_bssid` — iPhone 16Pro Max  BSSID | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_connection_type` — iPhone 16Pro Max  Connection Type | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_distance` — iPhone 16Pro Max  Distance | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_floors_ascended` — iPhone 16Pro Max  Floors Ascended | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_floors_descended` — iPhone 16Pro Max  Floors Descended | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_geocoded_location` — iPhone 16Pro Max  Geocoded Location | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_last_update_trigger` — iPhone 16Pro Max  Last Update Trigger | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_location_permission` — iPhone 16Pro Max  Location permission | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_sim_1` — iPhone 16Pro Max  SIM 1 | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_sim_2` — iPhone 16Pro Max  SIM 2 | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_ssid` — iPhone 16Pro Max  SSID | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_steps` — iPhone 16Pro Max  Steps | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.iphone_16pro_max_storage` — iPhone 16Pro Max  Storage | device: iPhone 16Pro Max  | area: Unassigned
- `sensor.jeffs_ipad_app_version` — Jeff’s iPad App Version | device: Jeff’s iPad | area: Unassigned — diagnostic
- `sensor.jeffs_ipad_audio_output` — Jeff’s iPad Audio Output | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_battery_level` — Jeff’s iPad Battery Level | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_battery_state` — Jeff’s iPad Battery State | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_bssid` — Jeff’s iPad BSSID | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_connection_type` — Jeff’s iPad Connection Type | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_geocoded_location` — Jeff’s iPad Geocoded Location | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_last_update_trigger` — Jeff’s iPad Last Update Trigger | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_location_permission` — Jeff’s iPad Location permission | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_ssid` — Jeff’s iPad SSID | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_ipad_storage` — Jeff’s iPad Storage | device: Jeff’s iPad | area: Unassigned
- `sensor.jeffs_iphone_app_version` — Jeff’s iPhone App Version | device: Jeff’s iPhone | area: Unassigned — diagnostic
- `sensor.jeffs_iphone_audio_output` — Jeff’s iPhone Audio Output | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_battery_level` — Jeff’s iPhone Battery Level | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_battery_state` — Jeff’s iPhone Battery State | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_bssid` — Jeff’s iPhone BSSID | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_connection_type` — Jeff’s iPhone Connection Type | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_geocoded_location` — Jeff’s iPhone Geocoded Location | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_last_update_trigger` — Jeff’s iPhone Last Update Trigger | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_location_permission` — Jeff’s iPhone Location permission | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_sim_1` — Jeff’s iPhone SIM 1 | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_sim_2` — Jeff’s iPhone SIM 2 | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_ssid` — Jeff’s iPhone SSID | device: Jeff’s iPhone | area: Unassigned
- `sensor.jeffs_iphone_storage` — Jeff’s iPhone Storage | device: Jeff’s iPhone | area: Unassigned
- `sensor.klasnick_beige_table_lamp_zigbee_connectivity` — Zigbee connectivity | device: Klasnick Beige Table Lamp (with E14 Hue Colour) | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.macbook_air_active_audio_input` — MacBook Air  Active Audio Input | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_active_audio_output` — MacBook Air  Active Audio Output | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_active_camera` — MacBook Air  Active Camera | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_app_version` — MacBook Air  App Version | device: MacBook Air  | area: Unassigned — diagnostic
- `sensor.macbook_air_audio_output` — MacBook Air  Audio Output | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_bssid` — MacBook Air  BSSID | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_connection_type` — MacBook Air  Connection Type | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_displays` — MacBook Air  Displays | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_frontmost_app` — MacBook Air  Frontmost App | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_geocoded_location` — MacBook Air  Geocoded Location | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_internal_battery_level` — MacBook Air  Internal Battery Level | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_internal_battery_state` — MacBook Air  Internal Battery State | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_last_update_trigger` — MacBook Air  Last Update Trigger | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_location_permission` — MacBook Air  Location permission | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_primary_display_id` — MacBook Air  Primary Display ID | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_primary_display_name` — MacBook Air  Primary Display Name | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_ssid` — MacBook Air  SSID | device: MacBook Air  | area: Unassigned
- `sensor.macbook_air_storage` — MacBook Air  Storage | device: MacBook Air  | area: Unassigned
- `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` — Zigbee connectivity | device: Core Statement Arc Floor Lamp Monica Vibelucci | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` — Zigbee connectivity | device: Nymane 3-spot Lamp - Low | area: Bedroom (Alpha) — disabled:integration, diagnostic
- `sensor.play_gradient_tube_1_zigbee_connectivity` — Zigbee connectivity | device: alpha gradient light-tube.1 | area: Bedroom — disabled:integration, diagnostic
- `sensor.roller_shade_0a_battery` — Battery | device: Roller Shade 0A | area: Unassigned — diagnostic
- `sensor.roller_shade_0a_target_opening_position` — Target opening position | device: Roller Shade 0A | area: Unassigned — disabled:integration, diagnostic
- `sensor.roller_shade_2a_battery` — Battery | device: Roller Shade 2A | area: Unassigned — diagnostic
- `sensor.roller_shade_2a_target_opening_position` — Target opening position | device: Roller Shade 2A | area: Unassigned — disabled:integration, diagnostic
- `sensor.roller_shade_84_battery` — Battery | device: Roller Shade 84 | area: Unassigned — diagnostic
- `sensor.roller_shade_84_target_opening_position` — Target opening position | device: Roller Shade 84 | area: Unassigned — disabled:integration, diagnostic
- `sensor.secondary_bathroom_illuminance` — Illuminance | device: Secondary Bathroom | area: Secondary Bathroom
- `sensor.signe_gradient_floor_1_zigbee_connectivity` — Zigbee connectivity | device: Signe gradient floor 1 | area: Openplan (Core) — disabled:integration, diagnostic
- `sensor.signe_gradient_table_1_zigbee_connectivity` — Zigbee connectivity | device: Signe gradient table 1 | area: Unassigned — disabled:integration, diagnostic
- `sensor.speedtest_download` — Download | device: SpeedTest | area: Parking
- `sensor.speedtest_ping` — Ping | device: SpeedTest | area: Parking
- `sensor.speedtest_upload` — Upload | device: SpeedTest | area: Parking
- `sensor.splash_bathroom_dimmer_zigbee_connectivity` — Zigbee connectivity | device: Splash Dimmer Switch | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.4 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.1 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.2 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.5 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_ceiling_light_5_zigbee_connectivity` — Zigbee connectivity | device: Splash Ceiling Light.3 | area: Secondary Bathroom — disabled:integration, diagnostic
- `sensor.splash_dimmer_switch_battery` — Battery | device: Splash Dimmer Switch | area: Secondary Bathroom — diagnostic
- `sensor.splash_pass_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Pass Ceiling Light.2 | area: Hallway (Pass) — disabled:integration, diagnostic
- `sensor.sun_next_dawn` — Next dawn | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_dusk` — Next dusk | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_midnight` — Next midnight | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_noon` — Next noon | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_rising` — Next rising | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_next_setting` — Next setting | device: Sun | area: Unassigned — diagnostic
- `sensor.sun_solar_azimuth` — Solar azimuth | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `sensor.sun_solar_elevation` — Solar elevation | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `sensor.sun_solar_rising` — Solar rising | device: Sun | area: Unassigned — disabled:integration, diagnostic
- `sensor.throne_bathroom_ceiling_zigbee_connectivity` — Zigbee connectivity | device: Bathroom dimmer switch | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.throne_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity | device: Hue Motion Sensor | area: Ensuite (Throne) Bathroom — disabled:integration, diagnostic
- `sensor.withings_active_calories_burnt_today` — Active calories burnt today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_active_time_today` — Active time today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_average_heart_rate` — Average heart rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_average_respiratory_rate` — Average respiratory rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_breathing_disturbances_intensity` — Breathing disturbances intensity | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_deep_sleep` — Deep sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_distance_travelled_today` — Distance travelled today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_elevation_change_today` — Elevation change today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_intense_activity_today` — Intense activity today | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_light_sleep` — Light sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_maximum_heart_rate` — Maximum heart rate | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_maximum_respiratory_rate` — Maximum respiratory rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_minimum_heart_rate` — Minimum heart rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_minimum_respiratory_rate` — Minimum respiratory rate | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_moderate_activity_today` — Moderate activity today | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_rem_sleep` — REM sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_sleep_score` — Sleep score | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_snoring` — Snoring | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_snoring_episode_count` — Snoring episode count | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_soft_activity_today` — Soft activity today | device: Withings | area: Bedroom (Alpha) — disabled:integration
- `sensor.withings_steps_today` — Steps today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_time_to_sleep` — Time to sleep | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_time_to_wakeup` — Time to wakeup | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_total_calories_burnt_today` — Total calories burnt today | device: Withings | area: Bedroom (Alpha) — disabled:user
- `sensor.withings_wakeup_count` — Wakeup count | device: Withings | area: Bedroom (Alpha)
- `sensor.withings_wakeup_time` — Wakeup time | device: Withings | area: Bedroom (Alpha)
- `update.core_300s_firmware` — Firmware | device: Core 300S | area: Bedroom — diagnostic
- `weather.forecast_home` — Home | device: Forecast | area: Unassigned

## 7. Naming / Assignment Signals

### Duplicate Entity Base Names

| Base | Numbered Variants |
| --- | ---: |
| `binary_sensor.absence_for_3mins_dining_zone_occupancy` | binary_sensor.absence_for_3mins_dining_zone_occupancy_2 |
| `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` | binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2 |
| `binary_sensor.absence_for_3mins_living_zone_occupancy` | binary_sensor.absence_for_3mins_living_zone_occupancy_2 |
| `binary_sensor.absence_for_5mins_openplan_occupancy` | binary_sensor.absence_for_5mins_openplan_occupancy_2 |
| `binary_sensor.approaching_openplan_room_occupancy` | binary_sensor.approaching_openplan_room_occupancy_2 |
| `binary_sensor.aqara_curtain_driver_e1_problem` | binary_sensor.aqara_curtain_driver_e1_problem_2, binary_sensor.aqara_curtain_driver_e1_problem_3, binary_sensor.aqara_curtain_driver_e1_problem_4 |
| `binary_sensor.aqara_door_and_window_sensor_door` | binary_sensor.aqara_door_and_window_sensor_door_10, binary_sensor.aqara_door_and_window_sensor_door_11, binary_sensor.aqara_door_and_window_sensor_door_12, binary_sensor.aqara_door_and_window_sensor_door_13, binary_sensor.aqara_door_and_window_sensor_door_14, binary_sensor.aqara_door_and_window_sensor_door_2, binary_sensor.aqara_door_and_window_sensor_door_3, binary_sensor.aqara_door_and_window_sensor_door_4, binary_sensor.aqara_door_and_window_sensor_door_5, binary_sensor.aqara_door_and_window_sensor_door_6, binary_sensor.aqara_door_and_window_sensor_door_7, binary_sensor.aqara_door_and_window_sensor_door_8 |
| `binary_sensor.aqara_motion_sensor_p1_occupancy` | binary_sensor.aqara_motion_sensor_p1_occupancy_2, binary_sensor.aqara_motion_sensor_p1_occupancy_3, binary_sensor.aqara_motion_sensor_p1_occupancy_4 |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy` | binary_sensor.aqara_presence_sensor_fp1e_occupancy_2, binary_sensor.aqara_presence_sensor_fp1e_occupancy_3, binary_sensor.aqara_presence_sensor_fp1e_occupancy_4 |
| `binary_sensor.aqara_vibration_sensor_occupancy` | binary_sensor.aqara_vibration_sensor_occupancy_2 |
| `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` | binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2 |
| `binary_sensor.beta_bedroom_presence_detected_occupancy` | binary_sensor.beta_bedroom_presence_detected_occupancy_2 |
| `binary_sensor.hue_motion_sensor_motion` | binary_sensor.hue_motion_sensor_motion_2 |
| `binary_sensor.presence_dining_zone_occupancy` | binary_sensor.presence_dining_zone_occupancy_2 |
| `binary_sensor.presence_kitchen_zone_occupancy` | binary_sensor.presence_kitchen_zone_occupancy_2 |
| `binary_sensor.presence_living_zone_occupancy` | binary_sensor.presence_living_zone_occupancy_2 |
| `button.absence_for_3mins_dining_zone_identify` | button.absence_for_3mins_dining_zone_identify_2 |
| `button.absence_for_3mins_kitchen_zone_identify` | button.absence_for_3mins_kitchen_zone_identify_2 |
| `button.absence_for_3mins_living_zone_identify` | button.absence_for_3mins_living_zone_identify_2 |
| `button.absence_for_5mins_openplan_identify` | button.absence_for_5mins_openplan_identify_2 |
| `button.approaching_openplan_room_identify` | button.approaching_openplan_room_identify_2 |
| `button.aqara_curtain_driver_e1_identify` | button.aqara_curtain_driver_e1_identify_2, button.aqara_curtain_driver_e1_identify_3, button.aqara_curtain_driver_e1_identify_4 |
| `button.aqara_door_and_window_sensor_identify` | button.aqara_door_and_window_sensor_identify_10, button.aqara_door_and_window_sensor_identify_11, button.aqara_door_and_window_sensor_identify_12, button.aqara_door_and_window_sensor_identify_13, button.aqara_door_and_window_sensor_identify_14, button.aqara_door_and_window_sensor_identify_2, button.aqara_door_and_window_sensor_identify_3, button.aqara_door_and_window_sensor_identify_4, button.aqara_door_and_window_sensor_identify_5, button.aqara_door_and_window_sensor_identify_6, button.aqara_door_and_window_sensor_identify_7, button.aqara_door_and_window_sensor_identify_8 |
| `button.aqara_hub_m3_identify` | button.aqara_hub_m3_identify_2 |
| `button.aqara_motion_sensor_p1_identify` | button.aqara_motion_sensor_p1_identify_2, button.aqara_motion_sensor_p1_identify_3, button.aqara_motion_sensor_p1_identify_4 |
| `button.aqara_presence_sensor_fp1e_identify` | button.aqara_presence_sensor_fp1e_identify_2, button.aqara_presence_sensor_fp1e_identify_3, button.aqara_presence_sensor_fp1e_identify_4 |
| `button.aqara_vibration_sensor_identify` | button.aqara_vibration_sensor_identify_2 |
| `button.aqara_wireless_remote_switch_identify` | button.aqara_wireless_remote_switch_identify_2, button.aqara_wireless_remote_switch_identify_3, button.aqara_wireless_remote_switch_identify_4 |
| `button.beta_bedroom_no_presence_3mins_identify` | button.beta_bedroom_no_presence_3mins_identify_2 |
| `button.beta_bedroom_presence_detected_identify` | button.beta_bedroom_presence_detected_identify_2 |
| `button.presence_dining_zone_identify` | button.presence_dining_zone_identify_2 |
| `button.presence_kitchen_zone_identify` | button.presence_kitchen_zone_identify_2 |
| `button.presence_living_zone_identify` | button.presence_living_zone_identify_2 |
| `cover.aqara_curtain_driver_e1` | cover.aqara_curtain_driver_e1_2, cover.aqara_curtain_driver_e1_3, cover.aqara_curtain_driver_e1_4 |
| `cover.roller_shade` | cover.roller_shade_0a, cover.roller_shade_2a, cover.roller_shade_84 |
| `event.alpha_bedroom_dial_switch_button` | event.alpha_bedroom_dial_switch_button_1, event.alpha_bedroom_dial_switch_button_2, event.alpha_bedroom_dial_switch_button_3, event.alpha_bedroom_dial_switch_button_4 |
| `event.alpha_hue_smart_button_button` | event.alpha_hue_smart_button_button_1 |
| `event.aqara_wireless_remote_switch_button` | event.aqara_wireless_remote_switch_button_2, event.aqara_wireless_remote_switch_button_3, event.aqara_wireless_remote_switch_button_4 |
| `event.bathroom_dimmer_switch_button` | event.bathroom_dimmer_switch_button_1, event.bathroom_dimmer_switch_button_2, event.bathroom_dimmer_switch_button_3, event.bathroom_dimmer_switch_button_4 |
| `event.core_tap_dial_light_switch_button` | event.core_tap_dial_light_switch_button_1, event.core_tap_dial_light_switch_button_2, event.core_tap_dial_light_switch_button_3, event.core_tap_dial_light_switch_button_4 |
| `event.hallway_dimmer_switch_button` | event.hallway_dimmer_switch_button_1, event.hallway_dimmer_switch_button_2, event.hallway_dimmer_switch_button_3, event.hallway_dimmer_switch_button_4 |
| `event.hallway_tap_dial_switch_button` | event.hallway_tap_dial_switch_button_1, event.hallway_tap_dial_switch_button_2, event.hallway_tap_dial_switch_button_3, event.hallway_tap_dial_switch_button_4 |
| `event.hue_smart_button_2_button` | event.hue_smart_button_2_button_1 |
| `event.hue_smart_button_3_button` | event.hue_smart_button_3_button_1 |
| `event.splash_dimmer_switch_button` | event.splash_dimmer_switch_button_1, event.splash_dimmer_switch_button_2, event.splash_dimmer_switch_button_3, event.splash_dimmer_switch_button_4 |
| `light.alpha_ceiling_light` | light.alpha_ceiling_light_4, light.alpha_ceiling_light_6 |
| `light.alpha_gradient_light_tube` | light.alpha_gradient_light_tube_1 |
| `light.alphabed_ceiling_light` | light.alphabed_ceiling_light_3, light.alphabed_ceiling_light_5, light.alphabed_ceiling_light_5_2 |
| `light.alphabed_ceiling_light_5` | light.alphabed_ceiling_light_5_2 |
| `light.alphadoor_ceiling_light` | light.alphadoor_ceiling_light_6 |
| `light.beta_ceiling_light` | light.beta_ceiling_light_3, light.beta_ceiling_light_3_2, light.beta_ceiling_light_4, light.beta_ceiling_light_6 |
| `light.beta_ceiling_light_3` | light.beta_ceiling_light_3_2 |
| `light.betaflex_ceiling_light` | light.betaflex_ceiling_light_1, light.betaflex_ceiling_light_2 |
| `light.core_ceiling` | light.core_ceiling_3, light.core_ceiling_light_1, light.core_ceiling_light_10, light.core_ceiling_light_2, light.core_ceiling_light_4, light.core_ceiling_light_5, light.core_ceiling_light_5_2, light.core_ceiling_light_6, light.core_ceiling_light_7, light.core_ceiling_light_8, light.core_ceiling_light_9 |
| `light.core_ceiling_light` | light.core_ceiling_light_1, light.core_ceiling_light_10, light.core_ceiling_light_2, light.core_ceiling_light_4, light.core_ceiling_light_5, light.core_ceiling_light_5_2, light.core_ceiling_light_6, light.core_ceiling_light_7, light.core_ceiling_light_8, light.core_ceiling_light_9 |
| `light.core_ceiling_light_5` | light.core_ceiling_light_5_2 |
| `light.hue_play` | light.hue_play_1, light.hue_play_2 |
| `light.hue_signe_white_gradient_floor_lamp` | light.hue_signe_white_gradient_floor_lamp_1 |
| `light.hue_smart_plug` | light.hue_smart_plug_1 |
| `light.pass_ceiling_light` | light.pass_ceiling_light_1, light.pass_ceiling_light_1_2, light.pass_ceiling_light_2, light.pass_ceiling_light_4, light.pass_ceiling_light_5 |
| `light.pass_ceiling_light_1` | light.pass_ceiling_light_1_2 |
| `light.signe_gradient_floor` | light.signe_gradient_floor_1 |
| `light.signe_gradient_table` | light.signe_gradient_table_1 |
| `light.splash_ceiling_light` | light.splash_ceiling_light_1, light.splash_ceiling_light_2, light.splash_ceiling_light_3, light.splash_ceiling_light_4, light.splash_ceiling_light_5 |
| `light.throne_ceiling_light` | light.throne_ceiling_light_2, light.throne_ceiling_light_3, light.throne_ceiling_light_3_2, light.throne_ceiling_light_4 |
| `light.throne_ceiling_light_3` | light.throne_ceiling_light_3_2 |
| `media_player.core_lounge_homepod` | media_player.core_lounge_homepod_2 |
| `media_player.living_room` | media_player.living_room_2 |
| `media_player.nesthubd029` | media_player.nesthubd029_2, media_player.nesthubd029_3 |
| `remote.core_lounge_homepod` | remote.core_lounge_homepod_2 |
| `remote.living_room` | remote.living_room_2 |
| `sensor.aqara_curtain_driver_e1_battery` | sensor.aqara_curtain_driver_e1_battery_2, sensor.aqara_curtain_driver_e1_battery_3, sensor.aqara_curtain_driver_e1_battery_4, sensor.aqara_curtain_driver_e1_battery_charge_state, sensor.aqara_curtain_driver_e1_battery_charge_state_2, sensor.aqara_curtain_driver_e1_battery_charge_state_3, sensor.aqara_curtain_driver_e1_battery_charge_state_4, sensor.aqara_curtain_driver_e1_battery_voltage, sensor.aqara_curtain_driver_e1_battery_voltage_2, sensor.aqara_curtain_driver_e1_battery_voltage_3, sensor.aqara_curtain_driver_e1_battery_voltage_4 |
| `sensor.aqara_curtain_driver_e1_battery_charge_state` | sensor.aqara_curtain_driver_e1_battery_charge_state_2, sensor.aqara_curtain_driver_e1_battery_charge_state_3, sensor.aqara_curtain_driver_e1_battery_charge_state_4 |
| `sensor.aqara_curtain_driver_e1_battery_voltage` | sensor.aqara_curtain_driver_e1_battery_voltage_2, sensor.aqara_curtain_driver_e1_battery_voltage_3, sensor.aqara_curtain_driver_e1_battery_voltage_4 |
| `sensor.aqara_curtain_driver_e1_target_opening_position` | sensor.aqara_curtain_driver_e1_target_opening_position_2, sensor.aqara_curtain_driver_e1_target_opening_position_3, sensor.aqara_curtain_driver_e1_target_opening_position_4 |
| `sensor.aqara_door_and_window_sensor_battery` | sensor.aqara_door_and_window_sensor_battery_10, sensor.aqara_door_and_window_sensor_battery_11, sensor.aqara_door_and_window_sensor_battery_12, sensor.aqara_door_and_window_sensor_battery_13, sensor.aqara_door_and_window_sensor_battery_14, sensor.aqara_door_and_window_sensor_battery_2, sensor.aqara_door_and_window_sensor_battery_3, sensor.aqara_door_and_window_sensor_battery_4, sensor.aqara_door_and_window_sensor_battery_5, sensor.aqara_door_and_window_sensor_battery_6, sensor.aqara_door_and_window_sensor_battery_7, sensor.aqara_door_and_window_sensor_battery_8 |
| `sensor.aqara_door_and_window_sensor_battery_type` | sensor.aqara_door_and_window_sensor_battery_type_10, sensor.aqara_door_and_window_sensor_battery_type_11, sensor.aqara_door_and_window_sensor_battery_type_12, sensor.aqara_door_and_window_sensor_battery_type_13, sensor.aqara_door_and_window_sensor_battery_type_14, sensor.aqara_door_and_window_sensor_battery_type_2, sensor.aqara_door_and_window_sensor_battery_type_3, sensor.aqara_door_and_window_sensor_battery_type_4, sensor.aqara_door_and_window_sensor_battery_type_5, sensor.aqara_door_and_window_sensor_battery_type_6, sensor.aqara_door_and_window_sensor_battery_type_7, sensor.aqara_door_and_window_sensor_battery_type_8 |
| `sensor.aqara_door_and_window_sensor_battery_voltage` | sensor.aqara_door_and_window_sensor_battery_voltage_10, sensor.aqara_door_and_window_sensor_battery_voltage_11, sensor.aqara_door_and_window_sensor_battery_voltage_12, sensor.aqara_door_and_window_sensor_battery_voltage_13, sensor.aqara_door_and_window_sensor_battery_voltage_14, sensor.aqara_door_and_window_sensor_battery_voltage_2, sensor.aqara_door_and_window_sensor_battery_voltage_3, sensor.aqara_door_and_window_sensor_battery_voltage_4, sensor.aqara_door_and_window_sensor_battery_voltage_5, sensor.aqara_door_and_window_sensor_battery_voltage_6, sensor.aqara_door_and_window_sensor_battery_voltage_7, sensor.aqara_door_and_window_sensor_battery_voltage_8 |
| `sensor.aqara_motion_sensor_p1_battery` | sensor.aqara_motion_sensor_p1_battery_2, sensor.aqara_motion_sensor_p1_battery_3, sensor.aqara_motion_sensor_p1_battery_4, sensor.aqara_motion_sensor_p1_battery_type, sensor.aqara_motion_sensor_p1_battery_type_2, sensor.aqara_motion_sensor_p1_battery_type_3, sensor.aqara_motion_sensor_p1_battery_type_4, sensor.aqara_motion_sensor_p1_battery_voltage, sensor.aqara_motion_sensor_p1_battery_voltage_2, sensor.aqara_motion_sensor_p1_battery_voltage_3, sensor.aqara_motion_sensor_p1_battery_voltage_4 |
| `sensor.aqara_motion_sensor_p1_battery_type` | sensor.aqara_motion_sensor_p1_battery_type_2, sensor.aqara_motion_sensor_p1_battery_type_3, sensor.aqara_motion_sensor_p1_battery_type_4 |
| `sensor.aqara_motion_sensor_p1_battery_voltage` | sensor.aqara_motion_sensor_p1_battery_voltage_2, sensor.aqara_motion_sensor_p1_battery_voltage_3, sensor.aqara_motion_sensor_p1_battery_voltage_4 |
| `sensor.aqara_vibration_sensor_battery` | sensor.aqara_vibration_sensor_battery_2, sensor.aqara_vibration_sensor_battery_type, sensor.aqara_vibration_sensor_battery_type_2, sensor.aqara_vibration_sensor_battery_voltage, sensor.aqara_vibration_sensor_battery_voltage_2 |
| `sensor.aqara_vibration_sensor_battery_type` | sensor.aqara_vibration_sensor_battery_type_2 |
| `sensor.aqara_vibration_sensor_battery_voltage` | sensor.aqara_vibration_sensor_battery_voltage_2 |
| `sensor.aqara_wireless_remote_switch_battery` | sensor.aqara_wireless_remote_switch_battery_2, sensor.aqara_wireless_remote_switch_battery_type, sensor.aqara_wireless_remote_switch_battery_type_2, sensor.aqara_wireless_remote_switch_battery_voltage, sensor.aqara_wireless_remote_switch_battery_voltage_2 |
| `sensor.aqara_wireless_remote_switch_battery_type` | sensor.aqara_wireless_remote_switch_battery_type_2 |
| `sensor.aqara_wireless_remote_switch_battery_voltage` | sensor.aqara_wireless_remote_switch_battery_voltage_2 |
| `sensor.aqara_wireless_remote_switch_current_switch_position` | sensor.aqara_wireless_remote_switch_current_switch_position_2, sensor.aqara_wireless_remote_switch_current_switch_position_3, sensor.aqara_wireless_remote_switch_current_switch_position_4 |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` | sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2, sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3, sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4 |
| `sensor.core_300s_pm2` | sensor.core_300s_pm2_5 |
| `sensor.hue_color_lamp_1_zigbee_connectivity` | sensor.hue_color_lamp_1_zigbee_connectivity_2 |
| `sensor.hue_motion_sensor_battery` | sensor.hue_motion_sensor_battery_2 |
| `sensor.hue_motion_sensor_illuminance` | sensor.hue_motion_sensor_illuminance_2 |
| `sensor.hue_motion_sensor_temperature` | sensor.hue_motion_sensor_temperature_2 |
| `sensor.iphone_16pro_max_sim` | sensor.iphone_16pro_max_sim_1, sensor.iphone_16pro_max_sim_2 |
| `sensor.jeffs_iphone_sim` | sensor.jeffs_iphone_sim_1, sensor.jeffs_iphone_sim_2 |
| `switch.automation_hue_smart_button` | switch.automation_hue_smart_button_3 |
| `switch.hue_motion_sensor_light_sensor_enabled` | switch.hue_motion_sensor_light_sensor_enabled_2 |
| `switch.hue_motion_sensor_motion_sensor_enabled` | switch.hue_motion_sensor_motion_sensor_enabled_2 |

### Devices With Duplicate Display Names

| Device Name | Count | Areas / Models |
| --- | ---: | --- |
| Alpha Ceiling Light.6 | 2 | Bedroom (Alpha) / Hue ambiance spot; Bedroom / Hue Essential spot |
| Alphabed Ceiling Light.5 | 2 | Bedroom (Alpha) / Hue color spot; Bedroom (Alpha) / Hue color spot |
| Aqara Curtain Driver E1 | 2 | Unassigned / Aqara Curtain Driver E1; Unassigned / Aqara Curtain Driver E1 |
| Aqara Door and Window Sensor | 7 | Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor; Unassigned / Aqara Door and Window Sensor |
| Aqara Motion Sensor P1 | 2 | Unassigned / Aqara Motion Sensor P1; Unassigned / Aqara Motion Sensor P1 |
| Aqara Presence Sensor FP1E | 2 | Unassigned / Aqara Presence Sensor FP1E; Unassigned / Aqara Presence Sensor FP1E |
| Beta Ceiling Light.3 | 2 | Spare Bedroom / Hue ambiance spot; Spare Bedroom / Hue ambiance spot |
| Core Ceiling Light.4 | 2 | Openplan (Core) / Hue color spot; Openplan (Core) / Hue color spot |
| Core Ceiling Light.5 | 2 | Openplan (Core) / Hue color spot; Living Room / Hue color spot |
| Core Lounge HomePod | 2 | Living Room / HomePod (gen 2); Living Room / HomePod (gen 2) |
| Hue Motion Sensor | 2 | Spare Bedroom / Hue motion sensor; Ensuite (Throne) Bathroom / Hue motion sensor |
| NestHubD029 | 2 | Unassigned / Google Nest Hub; Unassigned / Google Nest Hub |

### Disabled Entities

Count: `103`

- - `binary_sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic
- - `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.alpha_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position_2` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position_3` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_curtain_driver_e1_target_opening_position_4` — Target opening position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position_2` — Current switch position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position_3` — Current switch position — disabled:integration, diagnostic
- - `sensor.aqara_wireless_remote_switch_current_switch_position_4` — Current switch position — disabled:integration, diagnostic
- - `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.bed1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.bed3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_bed_lightstrip_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_6_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_ceiling_light_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.beta_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.betaflex_lower_shelf_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_kitchen_fridge_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_kitchen_sink_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_br_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_op_south_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_east_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_mm_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_mr_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.ceiling_open_plan_se_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.chaos_laundry_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.chaos_storage_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.chaos_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.core_hue_tap_dial_switch_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.core_signe_floor_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.core_vault_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hub_3_button_1_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.hub_3_button_2_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.hub_3_button_3_current_switch_position` — Current switch position — disabled:integration, diagnostic
- - `sensor.hue_bridge_pro_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_color_candle_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_color_lamp_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_color_lamp_1_zigbee_connectivity_2` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_dimmer_switch_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_essential_spot_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_essential_spot_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_essential_spot_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_play_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_play_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_smart_button_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_smart_button_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.hue_smart_plug_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.klasnick_beige_table_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.play_gradient_tube_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.roller_shade_0a_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.roller_shade_2a_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.roller_shade_84_target_opening_position` — Target opening position — disabled:integration, diagnostic
- - `sensor.signe_gradient_floor_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.signe_gradient_table_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_bathroom_dimmer_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_1_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_2_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_3_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_4_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_ceiling_light_5_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.splash_pass_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.sun_solar_azimuth` — Solar azimuth — disabled:integration, diagnostic
- - `sensor.sun_solar_elevation` — Solar elevation — disabled:integration, diagnostic
- - `sensor.sun_solar_rising` — Solar rising — disabled:integration, diagnostic
- - `sensor.throne_bathroom_ceiling_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.throne_hue_motion_sensor_zigbee_connectivity` — Zigbee connectivity — disabled:integration, diagnostic
- - `sensor.withings_active_calories_burnt_today` — Active calories burnt today — disabled:user
- - `sensor.withings_active_time_today` — Active time today — disabled:user
- - `sensor.withings_average_heart_rate` — Average heart rate — disabled:integration
- - `sensor.withings_average_respiratory_rate` — Average respiratory rate — disabled:integration
- - `sensor.withings_breathing_disturbances_intensity` — Breathing disturbances intensity — disabled:integration
- - `sensor.withings_distance_travelled_today` — Distance travelled today — disabled:user
- - `sensor.withings_elevation_change_today` — Elevation change today — disabled:user
- - `sensor.withings_intense_activity_today` — Intense activity today — disabled:integration
- - `sensor.withings_maximum_respiratory_rate` — Maximum respiratory rate — disabled:integration
- - `sensor.withings_minimum_heart_rate` — Minimum heart rate — disabled:integration
- - `sensor.withings_minimum_respiratory_rate` — Minimum respiratory rate — disabled:integration
- - `sensor.withings_moderate_activity_today` — Moderate activity today — disabled:integration
- - `sensor.withings_snoring_episode_count` — Snoring episode count — disabled:integration
- - `sensor.withings_soft_activity_today` — Soft activity today — disabled:integration
- - `sensor.withings_steps_today` — Steps today — disabled:user
- - `sensor.withings_total_calories_burnt_today` — Total calories burnt today — disabled:user

### Assistant Exposure

#### Conversation exposed (136)

- - `binary_sensor.aqara_door_and_window_sensor_door` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_10` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_11` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_12` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_13` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_14` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_2` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_3` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_4` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_5` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_6` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_7` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_8` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_9` — Door — conversation, google
- - `binary_sensor.bathroom_motion` — Motion — conversation, google
- - `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling — conversation, google
- - `binary_sensor.hue_motion_sensor_motion` — Motion — conversation
- - `binary_sensor.hue_motion_sensor_motion_2` — Motion — conversation
- - `binary_sensor.secondary_bathroom_motion` — Motion — conversation, google
- - `binary_sensor.withings_in_bed` — In bed — conversation
- - `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 — conversation, google
- - `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 — conversation, google
- - `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 — conversation, google
- - `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 — conversation, google
- - `cover.roller_shade_0a` — cover.roller_shade_0a — conversation, google
- - `cover.roller_shade_2a` — cover.roller_shade_2a — conversation, google
- - `cover.roller_shade_84` — cover.roller_shade_84 — conversation, google
- - `fan.core_300s` — fan.core_300s — conversation, google
- - `light.all_bedroom_bathroom` — light.all_bedroom_bathroom — conversation, google
- - `light.alpha_ceiling_light_4` — light.alpha_ceiling_light_4 — conversation
- - `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 — conversation, google
- - `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 — conversation, google
- - `light.alphabed_ceiling_light_3` — light.alphabed_ceiling_light_3 — conversation
- - `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 — conversation, google
- - `light.alphabed_ceiling_light_5_2` — light.alphabed_ceiling_light_5_2 — conversation
- - `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 — conversation, google
- - `light.bathroom` — light.bathroom — conversation, google
- - `light.bedroom` — light.bedroom — conversation
- - `light.bedroom_ceiling` — light.bedroom_ceiling — conversation, google
- - `light.bedroom_lamps` — light.bedroom_lamps — conversation, google
- - `light.beige_ola_spotlight_lamp` — light.beige_ola_spotlight_lamp — conversation
- - `light.beta_bed_lightstrip` — light.beta_bed_lightstrip — conversation
- - `light.beta_bedroom_bath` — light.beta_bedroom_bath — conversation, google
- - `light.beta_ceiling_light_3` — light.beta_ceiling_light_3 — conversation
- - `light.beta_ceiling_light_3_2` — light.beta_ceiling_light_3_2 — conversation
- - `light.beta_ceiling_light_4` — light.beta_ceiling_light_4 — conversation
- - `light.beta_ceiling_light_6` — light.beta_ceiling_light_6 — conversation
- - `light.betaflex_ceiling_light_1` — Betaflex Ceiling Light.1 — conversation
- - `light.betaflex_ceiling_light_2` — light.betaflex_ceiling_light_2 — conversation
- - `light.core_ceiling_3` — light.core_ceiling_3 — conversation
- - `light.core_ceiling_light_1` — light.core_ceiling_light_1 — conversation
- - `light.core_ceiling_light_10` — light.core_ceiling_light_10 — conversation
- - `light.core_ceiling_light_2` — light.core_ceiling_light_2 — conversation
- - `light.core_ceiling_light_4` — light.core_ceiling_light_4 — conversation
- - `light.core_ceiling_light_5` — light.core_ceiling_light_5 — conversation
- - `light.core_ceiling_light_5_2` — light.core_ceiling_light_5_2 — conversation
- - `light.core_ceiling_light_6` — light.core_ceiling_light_6 — conversation
- - `light.core_ceiling_light_7` — Core Ceiling Light.7 — conversation
- - `light.core_ceiling_light_8` — light.core_ceiling_light_8 — conversation
- - `light.core_ceiling_light_9` — light.core_ceiling_light_9 — conversation
- - `light.core_statement_arc_floor_lamp_monica_vibelucci` — light.core_statement_arc_floor_lamp_monica_vibelucci — conversation
- - `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp — conversation, google
- - `light.hallway` — light.hallway — conversation
- - `light.hue_play_1` — light.hue_play_1 — conversation, google
- - `light.hue_play_2` — light.hue_play_2 — conversation, google
- - `light.hue_signe_white_gradient_floor_lamp_1` — light.hue_signe_white_gradient_floor_lamp_1 — conversation
- - `light.hue_smart_plug_1` — light.hue_smart_plug_1 — conversation, google
- - `light.ikea_skytrax_light` — light.ikea_skytrax_light — conversation
- - `light.kitchen` — light.kitchen — conversation, google
- - `light.kitchen_ceiling` — light.kitchen_ceiling — conversation, google
- - `light.klasnick_beige_table_lamp_with_e14_hue_colour` — light.klasnick_beige_table_lamp_with_e14_hue_colour — conversation
- - `light.laundry_chaos_ceiling_light` — light.laundry_chaos_ceiling_light — conversation
- - `light.laundry_room` — light.laundry_room — conversation, google
- - `light.living_room` — light.living_room — conversation, google
- - `light.living_room_ceiling` — light.living_room_ceiling — conversation, google
- - `light.living_room_lamps` — light.living_room_lamps — conversation, google
- - `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top — conversation, google
- - `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low — conversation, google
- - `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid — conversation, google
- - `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp — conversation, google
- - `light.pass_ceiling_light_1` — light.pass_ceiling_light_1 — conversation
- - `light.pass_ceiling_light_1_2` — light.pass_ceiling_light_1_2 — conversation
- - `light.pass_ceiling_light_2` — light.pass_ceiling_light_2 — conversation
- - `light.pass_ceiling_light_4` — light.pass_ceiling_light_4 — conversation
- - `light.pass_ceiling_light_5` — light.pass_ceiling_light_5 — conversation
- - `light.right_bedside_lamp` — light.right_bedside_lamp — conversation, google
- - `light.secondary_bathroom` — light.secondary_bathroom — conversation, google
- - `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 — conversation, google
- - `light.signe_gradient_table_1` — light.signe_gradient_table_1 — conversation, google
- - `light.spare_bedroom` — light.spare_bedroom — conversation
- - `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling — conversation, google
- - `light.splash_ceiling_light_1` — light.splash_ceiling_light_1 — conversation
- - `light.splash_ceiling_light_2` — light.splash_ceiling_light_2 — conversation
- - `light.splash_ceiling_light_3` — light.splash_ceiling_light_3 — conversation
- - `light.splash_ceiling_light_4` — light.splash_ceiling_light_4 — conversation
- - `light.splash_ceiling_light_5` — light.splash_ceiling_light_5 — conversation
- - `light.throne_ceiling_light_2` — light.throne_ceiling_light_2 — conversation
- - `light.throne_ceiling_light_3` — light.throne_ceiling_light_3 — conversation
- - `light.throne_ceiling_light_3_2` — light.throne_ceiling_light_3_2 — conversation
- - `light.throne_ceiling_light_4` — light.throne_ceiling_light_4 — conversation
- - `light.white_e27_hue_bulb` — light.white_e27_hue_bulb — conversation
- - `light.wiz_a60_filament` — light.wiz_a60_filament — conversation, google
- - `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv — conversation, google
- - `media_player.bedroom_display` — media_player.bedroom_display — conversation
- - `media_player.core_lounge_homepod` — media_player.core_lounge_homepod — conversation, google
- - `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 — conversation, google
- - `media_player.living_room_2` — media_player.living_room_2 — conversation, google
- - `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired — conversation, google
- - `media_player.nesthubd029` — media_player.nesthubd029 — conversation, google
- - `media_player.nesthubd029_2` — media_player.nesthubd029_2 — conversation, google
- - `media_player.nesthubd029_3` — media_player.nesthubd029_3 — conversation, google
- - `media_player.orange_homepod_mini` — media_player.orange_homepod_mini — conversation, google
- - `media_player.serif_tv` — media_player.serif_tv — conversation
- - `media_player.white_homepod_mini` — media_player.white_homepod_mini — conversation, google
- - `scene.bedroom_concentrate` — Concentrate — conversation, google
- - `scene.bedroom_dimmed` — Dimmed — conversation, google
- - `scene.bedroom_energise` — Energise — conversation, google
- - `scene.bedroom_nightlight` — Nightlight — conversation, google
- - `scene.bedroom_read` — Read — conversation, google
- - `scene.bedroom_relax` — Relax — conversation, google
- - `scene.bedroom_sleepy` — Sleepy — conversation, google
- - `scene.hallway_concentrate` — Concentrate — conversation, google
- - `scene.hallway_energise` — Energise — conversation, google
- - `scene.hallway_nightlight` — Nightlight — conversation, google
- - `scene.hallway_read` — Read — conversation, google
- - `scene.hallway_relax` — Relax — conversation, google
- - `scene.new_scene` — New scene — conversation, google
- - `sensor.core_300s_pm2_5` — PM2.5 — conversation, google
- - `sensor.hub_3_humisensor_humidity` — Humidity — conversation, google
- - `sensor.hub_3_tempsensor_temperature` — Temperature — conversation, google
- - `sensor.hue_motion_sensor_temperature` — Temperature — conversation
- - `sensor.hue_motion_sensor_temperature_2` — Temperature — conversation
- - `switch.bot_4a` — switch.bot_4a — conversation, google
- - `switch.core_300s_child_lock` — Child lock — conversation, google
- - `switch.core_300s_display` — Display — conversation, google
- - `todo.shopping_list` — Shopping List — conversation

#### Google Assistant exposed (83)

- - `binary_sensor.aqara_door_and_window_sensor_door` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_10` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_11` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_12` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_13` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_14` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_2` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_3` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_4` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_5` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_6` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_7` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_8` — Door — conversation, google
- - `binary_sensor.aqara_door_and_window_sensor_door_9` — Door — conversation, google
- - `binary_sensor.bathroom_motion` — Motion — conversation, google
- - `binary_sensor.hallway_motionaware_ceiling` — Hallway MotionAware Ceiling — conversation, google
- - `binary_sensor.secondary_bathroom_motion` — Motion — conversation, google
- - `cover.aqara_curtain_driver_e1` — cover.aqara_curtain_driver_e1 — conversation, google
- - `cover.aqara_curtain_driver_e1_2` — cover.aqara_curtain_driver_e1_2 — conversation, google
- - `cover.aqara_curtain_driver_e1_3` — cover.aqara_curtain_driver_e1_3 — conversation, google
- - `cover.aqara_curtain_driver_e1_4` — cover.aqara_curtain_driver_e1_4 — conversation, google
- - `cover.roller_shade_0a` — cover.roller_shade_0a — conversation, google
- - `cover.roller_shade_2a` — cover.roller_shade_2a — conversation, google
- - `cover.roller_shade_84` — cover.roller_shade_84 — conversation, google
- - `fan.core_300s` — fan.core_300s — conversation, google
- - `light.all_bedroom_bathroom` — light.all_bedroom_bathroom — conversation, google
- - `light.alpha_ceiling_light_6` — light.alpha_ceiling_light_6 — conversation, google
- - `light.alpha_gradient_light_tube_1` — light.alpha_gradient_light_tube_1 — conversation, google
- - `light.alphabed_ceiling_light_5` — light.alphabed_ceiling_light_5 — conversation, google
- - `light.alphadoor_ceiling_light_6` — alphadoor ceiling light.6 — conversation, google
- - `light.bathroom` — light.bathroom — conversation, google
- - `light.bedroom_ceiling` — light.bedroom_ceiling — conversation, google
- - `light.bedroom_lamps` — light.bedroom_lamps — conversation, google
- - `light.beta_bedroom_bath` — light.beta_bedroom_bath — conversation, google
- - `light.fado_glass_globe_lamp` — light.fado_glass_globe_lamp — conversation, google
- - `light.hue_play_1` — light.hue_play_1 — conversation, google
- - `light.hue_play_2` — light.hue_play_2 — conversation, google
- - `light.hue_smart_plug_1` — light.hue_smart_plug_1 — conversation, google
- - `light.kitchen` — light.kitchen — conversation, google
- - `light.kitchen_ceiling` — light.kitchen_ceiling — conversation, google
- - `light.laundry_room` — light.laundry_room — conversation, google
- - `light.living_room` — light.living_room — conversation, google
- - `light.living_room_ceiling` — light.living_room_ceiling — conversation, google
- - `light.living_room_lamps` — light.living_room_lamps — conversation, google
- - `light.nyamane_3_spot_lamp_top` — light.nyamane_3_spot_lamp_top — conversation, google
- - `light.nymane_3_spot_lamp_low` — light.nymane_3_spot_lamp_low — conversation, google
- - `light.nymane_3_spot_lamp_mid` — light.nymane_3_spot_lamp_mid — conversation, google
- - `light.ola_whitborg_xl_floor_lamp` — light.ola_whitborg_xl_floor_lamp — conversation, google
- - `light.right_bedside_lamp` — light.right_bedside_lamp — conversation, google
- - `light.secondary_bathroom` — light.secondary_bathroom — conversation, google
- - `light.signe_gradient_floor_1` — light.signe_gradient_floor_1 — conversation, google
- - `light.signe_gradient_table_1` — light.signe_gradient_table_1 — conversation, google
- - `light.spare_bedroom_ceiling` — light.spare_bedroom_ceiling — conversation, google
- - `light.wiz_a60_filament` — light.wiz_a60_filament — conversation, google
- - `media_player.bedroom_apple_tv` — media_player.bedroom_apple_tv — conversation, google
- - `media_player.core_lounge_homepod` — media_player.core_lounge_homepod — conversation, google
- - `media_player.core_lounge_homepod_2` — media_player.core_lounge_homepod_2 — conversation, google
- - `media_player.living_room_2` — media_player.living_room_2 — conversation, google
- - `media_player.lounge_apple_tv_wired` — media_player.lounge_apple_tv_wired — conversation, google
- - `media_player.nesthubd029` — media_player.nesthubd029 — conversation, google
- - `media_player.nesthubd029_2` — media_player.nesthubd029_2 — conversation, google
- - `media_player.nesthubd029_3` — media_player.nesthubd029_3 — conversation, google
- - `media_player.orange_homepod_mini` — media_player.orange_homepod_mini — conversation, google
- - `media_player.white_homepod_mini` — media_player.white_homepod_mini — conversation, google
- - `scene.bedroom_concentrate` — Concentrate — conversation, google
- - `scene.bedroom_dimmed` — Dimmed — conversation, google
- - `scene.bedroom_energise` — Energise — conversation, google
- - `scene.bedroom_nightlight` — Nightlight — conversation, google
- - `scene.bedroom_read` — Read — conversation, google
- - `scene.bedroom_relax` — Relax — conversation, google
- - `scene.bedroom_sleepy` — Sleepy — conversation, google
- - `scene.hallway_concentrate` — Concentrate — conversation, google
- - `scene.hallway_energise` — Energise — conversation, google
- - `scene.hallway_nightlight` — Nightlight — conversation, google
- - `scene.hallway_read` — Read — conversation, google
- - `scene.hallway_relax` — Relax — conversation, google
- - `scene.new_scene` — New scene — conversation, google
- - `sensor.core_300s_pm2_5` — PM2.5 — conversation, google
- - `sensor.hub_3_humisensor_humidity` — Humidity — conversation, google
- - `sensor.hub_3_tempsensor_temperature` — Temperature — conversation, google
- - `switch.bot_4a` — switch.bot_4a — conversation, google
- - `switch.core_300s_child_lock` — Child lock — conversation, google
- - `switch.core_300s_display` — Display — conversation, google

#### Alexa exposed (0)


## 8. YAML / Config Surface

### YAML Files

- `/srv/homeassistant/config/automations.yaml`
- `/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml`
- `/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml`
- `/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml`
- `/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml`
- `/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml`
- `/srv/homeassistant/config/configuration.yaml`
- `/srv/homeassistant/config/packages/.example.yaml`
- `/srv/homeassistant/config/packages/test_mode.yaml`
- `/srv/homeassistant/config/scenes.yaml`
- `/srv/homeassistant/config/scripts.yaml`
- `/srv/homeassistant/config/secrets.yaml`

### YAML Line Counts

| File | Lines |
| --- | ---: |
| `/srv/homeassistant/config/automations.yaml` | 1 |
| `/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml` | 10567 |
| `/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml` | 199 |
| `/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml` | 58 |
| `/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml` | 50 |
| `/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml` | 86 |
| `/srv/homeassistant/config/configuration.yaml` | 20 |
| `/srv/homeassistant/config/packages/.example.yaml` | 1 |
| `/srv/homeassistant/config/packages/test_mode.yaml` | 15 |
| `/srv/homeassistant/config/scenes.yaml` | 18 |
| `/srv/homeassistant/config/scripts.yaml` | 0 |
| `/srv/homeassistant/config/secrets.yaml` | 4 |

## 9. Raw Appendix: Full Entity Table

| Entity | Name | Platform | Device | Area | Category | Disabled | Exposure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `binary_sensor.absence_for_3mins_dining_zone_occupancy` | Occupancy | matter | Absence for 3mins dining zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_dining_zone_occupancy_2` | Occupancy | matter | Absence for 3mins dining zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_kitchen_zone_occupancy` | Occupancy | matter | Absence for 3mins kitchen zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2` | Occupancy | matter | Absence for 3mins kitchen zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_living_zone_occupancy` | Occupancy | matter | Absence for 3mins living zone |  |  |  |  |
| `binary_sensor.absence_for_3mins_living_zone_occupancy_2` | Occupancy | matter | Absence for 3mins living zone |  |  |  |  |
| `binary_sensor.absence_for_5mins_openplan_occupancy` | Occupancy | matter | Absence for 5mins Openplan |  |  |  |  |
| `binary_sensor.absence_for_5mins_openplan_occupancy_2` | Occupancy | matter | Absence for 5mins Openplan |  |  |  |  |
| `binary_sensor.approaching_openplan_room_occupancy` | Occupancy | matter | Approaching Openplan room |  |  |  |  |
| `binary_sensor.approaching_openplan_room_occupancy_2` | Occupancy | matter | Approaching Openplan room |  |  |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem_2` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem_3` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_curtain_driver_e1_problem_4` | Problem | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `binary_sensor.aqara_door_and_window_sensor_door` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_10` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_11` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_12` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_13` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_14` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_2` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_3` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_4` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_5` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_6` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_7` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_8` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_door_and_window_sensor_door_9` | Door | matter | Aqara Door and Window Sensor |  |  |  | conversation, google |
| `binary_sensor.aqara_motion_sensor_p1_occupancy` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_motion_sensor_p1_occupancy_2` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_motion_sensor_p1_occupancy_3` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_motion_sensor_p1_occupancy_4` | Occupancy | matter | Aqara Motion Sensor P1 |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy_2` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy_3` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_presence_sensor_fp1e_occupancy_4` | Occupancy | matter | Aqara Presence Sensor FP1E |  |  |  |  |
| `binary_sensor.aqara_vibration_sensor_occupancy` | Occupancy | matter | Aqara Vibration Sensor |  |  |  |  |
| `binary_sensor.aqara_vibration_sensor_occupancy_2` | Occupancy | matter | Aqara Vibration Sensor |  |  |  |  |
| `binary_sensor.bathroom_motion` | Motion | hue | Bathroom | My Bathroom |  |  | conversation, google |
| `binary_sensor.beta_bedroom_no_presence_3mins_occupancy` | Occupancy | matter | Beta bedroom no presence 3mins |  |  |  |  |
| `binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2` | Occupancy | matter | Beta bedroom no presence 3mins |  |  |  |  |
| `binary_sensor.beta_bedroom_presence_detected_occupancy` | Occupancy | matter | Beta bedroom presence detected |  |  |  |  |
| `binary_sensor.beta_bedroom_presence_detected_occupancy_2` | Occupancy | matter | Beta bedroom presence detected |  |  |  |  |
| `binary_sensor.hallway_motionaware_ceiling` | Hallway MotionAware Ceiling | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `binary_sensor.hub_3_motionsensor_occupancy` | Occupancy | matter | Hub 3 MotionSensor |  |  |  |  |
| `binary_sensor.hue_motion_sensor_motion` | Motion | hue | Hue Motion Sensor | Spare Bedroom |  |  | conversation |
| `binary_sensor.hue_motion_sensor_motion_2` | Motion | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  |  | conversation |
| `binary_sensor.iphone_16pro_max_focus` | iPhone 16Pro Max  Focus | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `binary_sensor.macbook_air_active` | MacBook Air  Active | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.macbook_air_audio_input_in_use` | MacBook Air  Audio Input In Use | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.macbook_air_audio_output_in_use` | MacBook Air  Audio Output In Use | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.macbook_air_camera_in_use` | MacBook Air  Camera In Use | mobile_app | MacBook Air  |  |  |  |  |
| `binary_sensor.presence_dining_zone_occupancy` | Occupancy | matter | Presence Dining zone |  |  |  |  |
| `binary_sensor.presence_dining_zone_occupancy_2` | Occupancy | matter | Presence Dining zone |  |  |  |  |
| `binary_sensor.presence_kitchen_zone_occupancy` | Occupancy | matter | Presence kitchen zone |  |  |  |  |
| `binary_sensor.presence_kitchen_zone_occupancy_2` | Occupancy | matter | Presence kitchen zone |  |  |  |  |
| `binary_sensor.presence_living_zone_occupancy` | Occupancy | matter | Presence living zone |  |  |  |  |
| `binary_sensor.presence_living_zone_occupancy_2` | Occupancy | matter | Presence living zone |  |  |  |  |
| `binary_sensor.remote_ui` | Remote UI | cloud |  |  | diagnostic |  |  |
| `binary_sensor.roller_shade_0a_problem` | Problem | matter | Roller Shade 0A |  | diagnostic |  |  |
| `binary_sensor.roller_shade_2a_problem` | Problem | matter | Roller Shade 2A |  | diagnostic |  |  |
| `binary_sensor.roller_shade_84_problem` | Problem | matter | Roller Shade 84 |  | diagnostic |  |  |
| `binary_sensor.secondary_bathroom_motion` | Motion | hue | Secondary Bathroom | Secondary Bathroom |  |  | conversation, google |
| `binary_sensor.sun_solar_rising` | Solar rising | sun | Sun |  | diagnostic | integration |  |
| `binary_sensor.withings_in_bed` | In bed | withings | Withings | Bedroom (Alpha) |  |  | conversation |
| `button.absence_for_3mins_dining_zone_identify` | Identify | matter | Absence for 3mins dining zone |  | diagnostic |  |  |
| `button.absence_for_3mins_dining_zone_identify_2` | Identify | matter | Absence for 3mins dining zone |  | diagnostic |  |  |
| `button.absence_for_3mins_kitchen_zone_identify` | Identify | matter | Absence for 3mins kitchen zone |  | diagnostic |  |  |
| `button.absence_for_3mins_kitchen_zone_identify_2` | Identify | matter | Absence for 3mins kitchen zone |  | diagnostic |  |  |
| `button.absence_for_3mins_living_zone_identify` | Identify | matter | Absence for 3mins living zone |  | diagnostic |  |  |
| `button.absence_for_3mins_living_zone_identify_2` | Identify | matter | Absence for 3mins living zone |  | diagnostic |  |  |
| `button.absence_for_5mins_openplan_identify` | Identify | matter | Absence for 5mins Openplan |  | diagnostic |  |  |
| `button.absence_for_5mins_openplan_identify_2` | Identify | matter | Absence for 5mins Openplan |  | diagnostic |  |  |
| `button.approaching_openplan_room_identify` | Identify | matter | Approaching Openplan room |  | diagnostic |  |  |
| `button.approaching_openplan_room_identify_2` | Identify | matter | Approaching Openplan room |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify_2` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify_3` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_curtain_driver_e1_identify_4` | Identify | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_10` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_11` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_12` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_13` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_14` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_2` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_3` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_4` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_5` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_6` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_7` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_8` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_door_and_window_sensor_identify_9` | Identify | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `button.aqara_hub_m3_identify` | Identify | matter | Aqara Hub M3 |  | diagnostic |  |  |
| `button.aqara_hub_m3_identify_2` | Identify | matter | Aqara Hub M3 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify_2` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify_3` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_motion_sensor_p1_identify_4` | Identify | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify_2` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify_3` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_presence_sensor_fp1e_identify_4` | Identify | matter | Aqara Presence Sensor FP1E |  | diagnostic |  |  |
| `button.aqara_vibration_sensor_identify` | Identify | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `button.aqara_vibration_sensor_identify_2` | Identify | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify_2` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify_3` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.aqara_wireless_remote_switch_identify_4` | Identify | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `button.beta_bedroom_no_presence_3mins_identify` | Identify | matter | Beta bedroom no presence 3mins |  | diagnostic |  |  |
| `button.beta_bedroom_no_presence_3mins_identify_2` | Identify | matter | Beta bedroom no presence 3mins |  | diagnostic |  |  |
| `button.beta_bedroom_presence_detected_identify` | Identify | matter | Beta bedroom presence detected |  | diagnostic |  |  |
| `button.beta_bedroom_presence_detected_identify_2` | Identify | matter | Beta bedroom presence detected |  | diagnostic |  |  |
| `button.presence_dining_zone_identify` | Identify | matter | Presence Dining zone |  | diagnostic |  |  |
| `button.presence_dining_zone_identify_2` | Identify | matter | Presence Dining zone |  | diagnostic |  |  |
| `button.presence_kitchen_zone_identify` | Identify | matter | Presence kitchen zone |  | diagnostic |  |  |
| `button.presence_kitchen_zone_identify_2` | Identify | matter | Presence kitchen zone |  | diagnostic |  |  |
| `button.presence_living_zone_identify` | Identify | matter | Presence living zone |  | diagnostic |  |  |
| `button.presence_living_zone_identify_2` | Identify | matter | Presence living zone |  | diagnostic |  |  |
| `button.switchbot_hub_3_identify` | Identify | matter | SwitchBot Hub 3 |  | diagnostic |  |  |
| `button.wiz_a60_filament_identify` | Identify | matter | WiZ A60 Filament |  | diagnostic |  |  |
| `cover.aqara_curtain_driver_e1` | cover.aqara_curtain_driver_e1 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.aqara_curtain_driver_e1_2` | cover.aqara_curtain_driver_e1_2 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.aqara_curtain_driver_e1_3` | cover.aqara_curtain_driver_e1_3 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.aqara_curtain_driver_e1_4` | cover.aqara_curtain_driver_e1_4 | matter | Aqara Curtain Driver E1 |  |  |  | conversation, google |
| `cover.roller_shade_0a` | cover.roller_shade_0a | matter | Roller Shade 0A |  |  |  | conversation, google |
| `cover.roller_shade_2a` | cover.roller_shade_2a | matter | Roller Shade 2A |  |  |  | conversation, google |
| `cover.roller_shade_84` | cover.roller_shade_84 | matter | Roller Shade 84 |  |  |  | conversation, google |
| `device_tracker.ipad_pro` | Jeff’s iPad | mobile_app | Jeff’s iPad |  | diagnostic |  |  |
| `device_tracker.iphone_16pro_max` | iPhone 16Pro Max  | mobile_app | iPhone 16Pro Max  |  | diagnostic |  |  |
| `device_tracker.iphone_17_pro_max` | Jeff’s iPhone | mobile_app | Jeff’s iPhone |  | diagnostic |  |  |
| `device_tracker.macbook_air` | MacBook Air  | mobile_app | MacBook Air  |  | diagnostic |  |  |
| `event.alpha_bedroom_dial_switch_button_1` | Button 1 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_button_2` | Button 2 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_button_3` | Button 3 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_button_4` | Button 4 | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_bedroom_dial_switch_rotary` | Rotary | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  |  |  |
| `event.alpha_hue_smart_button_button_1` | Button 1 | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  |  |  |
| `event.aqara_wireless_remote_switch_button` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.aqara_wireless_remote_switch_button_2` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.aqara_wireless_remote_switch_button_3` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.aqara_wireless_remote_switch_button_4` | Button | matter | Aqara Wireless Remote Switch |  |  |  |  |
| `event.backup_automatic_backup` | Automatic backup | backup | Backup |  |  |  |  |
| `event.bathroom_dimmer_switch_button_1` | Button 1 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.bathroom_dimmer_switch_button_2` | Button 2 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.bathroom_dimmer_switch_button_3` | Button 3 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.bathroom_dimmer_switch_button_4` | Button 4 | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  |  |  |
| `event.core_tap_dial_light_switch_button_1` | Button 1 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_button_2` | Button 2 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_button_3` | Button 3 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_button_4` | Button 4 | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.core_tap_dial_light_switch_rotary` | Rotary | hue | Core Tap Dial Light Switch | Openplan (Core) |  |  |  |
| `event.hallway_dimmer_switch_button_1` | Button 1 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_dimmer_switch_button_2` | Button 2 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_dimmer_switch_button_3` | Button 3 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_dimmer_switch_button_4` | Button 4 | hue | Hallway Dimmer Switch | Hallway (Pass) |  |  |  |
| `event.hallway_tap_dial_switch_button_1` | Button 1 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_button_2` | Button 2 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_button_3` | Button 3 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_button_4` | Button 4 | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hallway_tap_dial_switch_rotary` | Rotary | hue | Hallway Tap Dial Switch | Spare Bedroom |  |  |  |
| `event.hub_3_button_1_button` | Button | matter | Hub 3 Button 1 |  |  |  |  |
| `event.hub_3_button_2_button` | Button | matter | Hub 3 Button 2 |  |  |  |  |
| `event.hub_3_button_3_button` | Button | matter | Hub 3 Button 3 |  |  |  |  |
| `event.hue_smart_button_2_button_1` | Button 1 | hue | Hue smart button 2 |  |  |  |  |
| `event.hue_smart_button_3_button_1` | Button 1 | hue | Hue smart button 3 |  |  |  |  |
| `event.splash_dimmer_switch_button_1` | Button 1 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `event.splash_dimmer_switch_button_2` | Button 2 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `event.splash_dimmer_switch_button_3` | Button 3 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `event.splash_dimmer_switch_button_4` | Button 4 | hue | Splash Dimmer Switch | Secondary Bathroom |  |  |  |
| `fan.core_300s` | fan.core_300s | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `input_boolean.test_mode` | Test Mode | input_boolean |  |  |  |  |  |
| `light.all_bedroom_bathroom` | light.all_bedroom_bathroom | hue | All Bedroom & Bathroom | Bedroom |  |  | conversation, google |
| `light.alpha_ceiling_light_4` | light.alpha_ceiling_light_4 | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) |  |  | conversation |
| `light.alpha_ceiling_light_6` | light.alpha_ceiling_light_6 | hue | Alpha Ceiling Light.6 | Bedroom |  |  | conversation, google |
| `light.alpha_gradient_light_tube_1` | light.alpha_gradient_light_tube_1 | hue | alpha gradient light-tube.1 | Bedroom |  |  | conversation, google |
| `light.alphabed_ceiling_light_3` | light.alphabed_ceiling_light_3 | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) |  |  | conversation |
| `light.alphabed_ceiling_light_5` | light.alphabed_ceiling_light_5 | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  | conversation, google |
| `light.alphabed_ceiling_light_5_2` | light.alphabed_ceiling_light_5_2 | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  | conversation |
| `light.alphadoor_ceiling_light_6` | alphadoor ceiling light.6 | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) |  |  | conversation, google |
| `light.bathroom` | light.bathroom | hue | Bathroom | My Bathroom |  |  | conversation, google |
| `light.bedroom` | light.bedroom | hue | Bedroom | Bedroom (Alpha) |  |  | conversation |
| `light.bedroom_ceiling` | light.bedroom_ceiling | hue | Bedroom Ceiling | Bedroom |  |  | conversation, google |
| `light.bedroom_lamps` | light.bedroom_lamps | hue | Bedroom Lamps | Bedroom |  |  | conversation, google |
| `light.beige_ola_spotlight_lamp` | light.beige_ola_spotlight_lamp | hue | Beige Ola Spotlight Lamp | Living Room |  |  | conversation |
| `light.beta_bed_lightstrip` | light.beta_bed_lightstrip | hue | Beta Bed Lightstrip | Spare Bedroom |  |  | conversation |
| `light.beta_bedroom_bath` | light.beta_bedroom_bath | hue | Beta Bedroom & Bath | Spare Bedroom |  |  | conversation, google |
| `light.beta_ceiling_light_3` | light.beta_ceiling_light_3 | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  | conversation |
| `light.beta_ceiling_light_3_2` | light.beta_ceiling_light_3_2 | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  | conversation |
| `light.beta_ceiling_light_4` | light.beta_ceiling_light_4 | hue | Beta Ceiling Light.4 | Spare Bedroom |  |  | conversation |
| `light.beta_ceiling_light_6` | light.beta_ceiling_light_6 | hue | Beta Ceiling Light.6 | Spare Bedroom |  |  | conversation |
| `light.betaflex_ceiling_light_1` | Betaflex Ceiling Light.1 | hue | Betaflex Ceiling Light.1 | Spare Bedroom |  |  | conversation |
| `light.betaflex_ceiling_light_2` | light.betaflex_ceiling_light_2 | hue | Betaflex Ceiling Light.2 | Spare Bedroom |  |  | conversation |
| `light.core_ceiling_3` | light.core_ceiling_3 | hue | core ceiling.3 | Bedroom (Alpha) |  |  | conversation |
| `light.core_ceiling_light_1` | light.core_ceiling_light_1 | hue | Core Ceiling Light.1 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_10` | light.core_ceiling_light_10 | hue | Core Ceiling Light.10 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_2` | light.core_ceiling_light_2 | hue | Core Ceiling Light.2 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_4` | light.core_ceiling_light_4 | hue | Core Ceiling Light.4 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_5` | light.core_ceiling_light_5 | hue | Core Ceiling Light.5 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_5_2` | light.core_ceiling_light_5_2 | hue | Core Ceiling Light.5 | Living Room |  |  | conversation |
| `light.core_ceiling_light_6` | light.core_ceiling_light_6 | hue | Core Ceiling Light.6 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_7` | Core Ceiling Light.7 | hue | Core Ceiling Light.4 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_8` | light.core_ceiling_light_8 | hue | Core Ceiling Light.8 | Openplan (Core) |  |  | conversation |
| `light.core_ceiling_light_9` | light.core_ceiling_light_9 | hue | Core Ceiling Light.9 | Core_kitchen |  |  | conversation |
| `light.core_statement_arc_floor_lamp_monica_vibelucci` | light.core_statement_arc_floor_lamp_monica_vibelucci | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) |  |  | conversation |
| `light.fado_glass_globe_lamp` | light.fado_glass_globe_lamp | hue | fado glass globe lamp |  |  |  | conversation, google |
| `light.hallway` | light.hallway | hue | Hallway | Hallway (Pass) |  |  | conversation |
| `light.hue_play_1` | light.hue_play_1 | hue | Hue Play 1 |  |  |  | conversation, google |
| `light.hue_play_2` | light.hue_play_2 | hue | Hue Play 2 |  |  |  | conversation, google |
| `light.hue_signe_white_gradient_floor_lamp_1` | light.hue_signe_white_gradient_floor_lamp_1 | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) |  |  | conversation |
| `light.hue_smart_plug_1` | light.hue_smart_plug_1 | hue | Hue smart plug 1 |  |  |  | conversation, google |
| `light.ikea_skytrax_light` | light.ikea_skytrax_light | hue | Ikea Skytrax Light | Bedroom |  |  | conversation |
| `light.kitchen` | light.kitchen | hue | Kitchen | Core_kitchen |  |  | conversation, google |
| `light.kitchen_ceiling` | light.kitchen_ceiling | hue | Kitchen Ceiling | Core_kitchen |  |  | conversation, google |
| `light.klasnick_beige_table_lamp_with_e14_hue_colour` | light.klasnick_beige_table_lamp_with_e14_hue_colour | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) |  |  | conversation |
| `light.laundry_chaos_ceiling_light` | light.laundry_chaos_ceiling_light | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities |  |  | conversation |
| `light.laundry_room` | light.laundry_room | hue | Laundry room | Laundry room |  |  | conversation, google |
| `light.living_room` | light.living_room | hue | Living room | Living Room |  |  | conversation, google |
| `light.living_room_ceiling` | light.living_room_ceiling | hue | Core Living Ceiling | Living Room |  |  | conversation, google |
| `light.living_room_lamps` | light.living_room_lamps | hue | Living room lamps | Living Room |  |  | conversation, google |
| `light.nyamane_3_spot_lamp_top` | light.nyamane_3_spot_lamp_top | hue | Nyamane 3-spot Lamp - Top  |  |  |  | conversation, google |
| `light.nymane_3_spot_lamp_low` | light.nymane_3_spot_lamp_low | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) |  |  | conversation, google |
| `light.nymane_3_spot_lamp_mid` | light.nymane_3_spot_lamp_mid | hue | Nymane 3-spot Lamp - Mid |  |  |  | conversation, google |
| `light.ola_whitborg_xl_floor_lamp` | light.ola_whitborg_xl_floor_lamp | hue | Ola Whitborg XL Floor Lamp |  |  |  | conversation, google |
| `light.pass_ceiling_light_1` | light.pass_ceiling_light_1 | hue | Pass Ceiling Light.1 | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_1_2` | light.pass_ceiling_light_1_2 | hue | Pass Ceiling Light.1  | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_2` | light.pass_ceiling_light_2 | hue | Pass Ceiling Light.2 | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_4` | light.pass_ceiling_light_4 | hue | Pass Ceiling Light.4 | Hallway (Pass) |  |  | conversation |
| `light.pass_ceiling_light_5` | light.pass_ceiling_light_5 | hue | Pass Ceiling Light.5 | Hallway (Pass) |  |  | conversation |
| `light.right_bedside_lamp` | light.right_bedside_lamp | hue | Right Bedside Lamp | Bedroom |  |  | conversation, google |
| `light.secondary_bathroom` | light.secondary_bathroom | hue | Secondary Bathroom | Secondary Bathroom |  |  | conversation, google |
| `light.signe_gradient_floor_1` | light.signe_gradient_floor_1 | hue | Signe gradient floor 1 | Openplan (Core) |  |  | conversation, google |
| `light.signe_gradient_table_1` | light.signe_gradient_table_1 | hue | Signe gradient table 1 |  |  |  | conversation, google |
| `light.spare_bedroom` | light.spare_bedroom | hue | Spare Bedroom | Spare Bedroom |  |  | conversation |
| `light.spare_bedroom_ceiling` | light.spare_bedroom_ceiling | hue | Spare Bedroom Ceiling | Spare Bedroom |  |  | conversation, google |
| `light.splash_ceiling_light_1` | light.splash_ceiling_light_1 | hue | Splash Ceiling Light.1 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_2` | light.splash_ceiling_light_2 | hue | Splash Ceiling Light.2 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_3` | light.splash_ceiling_light_3 | hue | Splash Ceiling Light.3 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_4` | light.splash_ceiling_light_4 | hue | Splash Ceiling Light.4 | Secondary Bathroom |  |  | conversation |
| `light.splash_ceiling_light_5` | light.splash_ceiling_light_5 | hue | Splash Ceiling Light.5 | Secondary Bathroom |  |  | conversation |
| `light.throne_ceiling_light_2` | light.throne_ceiling_light_2 | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.throne_ceiling_light_3` | light.throne_ceiling_light_3 | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.throne_ceiling_light_3_2` | light.throne_ceiling_light_3_2 | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.throne_ceiling_light_4` | light.throne_ceiling_light_4 | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom |  |  | conversation |
| `light.white_e27_hue_bulb` | light.white_e27_hue_bulb | hue | White (E27) Hue Bulb | Laundry/Utilities |  |  | conversation |
| `light.wiz_a60_filament` | light.wiz_a60_filament | matter | WiZ A60 Filament |  |  |  | conversation, google |
| `media_player.bedroom_apple_tv` | media_player.bedroom_apple_tv | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  | conversation, google |
| `media_player.bedroom_display` | media_player.bedroom_display | cast | Bedroom Display |  |  |  | conversation |
| `media_player.core_lounge_homepod` | media_player.core_lounge_homepod | apple_tv | Core Lounge HomePod | Living Room |  |  | conversation, google |
| `media_player.core_lounge_homepod_2` | media_player.core_lounge_homepod_2 | apple_tv | Core Lounge HomePod | Living Room |  |  | conversation, google |
| `media_player.living_room_2` | media_player.living_room_2 | apple_tv | Living Room (2) | Living Room (2) |  |  | conversation, google |
| `media_player.lounge_apple_tv_wired` | media_player.lounge_apple_tv_wired | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  | conversation, google |
| `media_player.nesthubd029` | media_player.nesthubd029 | cast | NestHubD029 |  |  |  | conversation, google |
| `media_player.nesthubd029_2` | media_player.nesthubd029_2 | cast | Loft Display |  |  |  | conversation, google |
| `media_player.nesthubd029_3` | media_player.nesthubd029_3 | cast | NestHubD029 |  |  |  | conversation, google |
| `media_player.orange_homepod_mini` | media_player.orange_homepod_mini | apple_tv | Orange HomePod Mini | Bedroom |  |  | conversation, google |
| `media_player.serif_tv` | media_player.serif_tv | cast | Serif TV |  |  |  | conversation |
| `media_player.white_homepod_mini` | media_player.white_homepod_mini | apple_tv | White HomePod Mini | White HomePod Mini |  |  | conversation, google |
| `number.wiz_a60_filament_off_transition_time` | Off transition time | matter | WiZ A60 Filament |  | config |  |  |
| `number.wiz_a60_filament_on_level` | On level | matter | WiZ A60 Filament |  | config |  |  |
| `number.wiz_a60_filament_on_off_transition_time` | On/off transition time | matter | WiZ A60 Filament |  | config |  |  |
| `number.wiz_a60_filament_on_transition_time` | On transition time | matter | WiZ A60 Filament |  | config |  |  |
| `person.jeffffff` | Jeff | person |  |  |  |  |  |
| `remote.bedroom_apple_tv` | remote.bedroom_apple_tv | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  |  |
| `remote.core_lounge_homepod` | remote.core_lounge_homepod | apple_tv | Core Lounge HomePod | Living Room |  |  |  |
| `remote.core_lounge_homepod_2` | remote.core_lounge_homepod_2 | apple_tv | Core Lounge HomePod | Living Room |  |  |  |
| `remote.living_room_2` | remote.living_room_2 | apple_tv | Living Room (2) | Living Room (2) |  |  |  |
| `remote.lounge_apple_tv_wired` | remote.lounge_apple_tv_wired | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  |  |
| `remote.orange_homepod_mini` | remote.orange_homepod_mini | apple_tv | Orange HomePod Mini | Bedroom |  |  |  |
| `remote.white_homepod_mini` | remote.white_homepod_mini | apple_tv | White HomePod Mini | White HomePod Mini |  |  |  |
| `scene.bedroom_concentrate` | Concentrate | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_dimmed` | Dimmed | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_energise` | Energise | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_nightlight` | Nightlight | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_read` | Read | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_relax` | Relax | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.bedroom_sleepy` | Sleepy | hue | Bedroom | Bedroom (Alpha) |  |  | conversation, google |
| `scene.hallway_concentrate` | Concentrate | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_energise` | Energise | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_nightlight` | Nightlight | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_read` | Read | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.hallway_relax` | Relax | hue | Hallway | Hallway (Pass) |  |  | conversation, google |
| `scene.new_scene` | New scene | homeassistant |  |  |  |  | conversation, google |
| `select.wiz_a60_filament_power_on_behaviour_on_startup` | Power-on behaviour on startup | matter | WiZ A60 Filament |  | config |  |  |
| `sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity` | Zigbee connectivity | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.alpha_bedroom_dial_switch_battery` | Battery | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) | diagnostic |  |  |
| `sensor.alpha_bedroom_dial_switch_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Hue Smart Button | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.alpha_hue_smart_button_battery` | Battery | hue | Alpha Hue Smart Button | Bedroom (Alpha) | diagnostic |  |  |
| `sensor.alpha_pass_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.5 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_battery` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_2` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_3` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_4` | Battery | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state_2` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state_3` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_charge_state_4` | Battery charge state | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage_2` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage_3` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_battery_voltage_4` | Battery voltage | matter | Aqara Curtain Driver E1 |  | diagnostic |  |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position_2` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position_3` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_curtain_driver_e1_target_opening_position_4` | Target opening position | matter | Aqara Curtain Driver E1 |  | diagnostic | integration |  |
| `sensor.aqara_door_and_window_sensor_battery` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_10` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_11` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_12` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_13` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_14` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_2` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_3` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_4` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_5` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_6` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_7` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_8` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_9` | Battery | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_10` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_11` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_12` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_13` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_14` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_2` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_3` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_4` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_5` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_6` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_7` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_8` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_type_9` | Battery type | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_10` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_11` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_12` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_13` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_14` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_2` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_3` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_4` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_5` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_6` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_7` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_8` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_door_and_window_sensor_battery_voltage_9` | Battery voltage | matter | Aqara Door and Window Sensor |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_2` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_3` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_4` | Battery | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type_2` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type_3` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_type_4` | Battery type | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage_2` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage_3` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_motion_sensor_p1_battery_voltage_4` | Battery voltage | matter | Aqara Motion Sensor P1 |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery` | Battery | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_2` | Battery | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_type` | Battery type | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_type_2` | Battery type | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_voltage` | Battery voltage | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_vibration_sensor_battery_voltage_2` | Battery voltage | matter | Aqara Vibration Sensor |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery` | Battery | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_2` | Battery | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_type` | Battery type | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_type_2` | Battery type | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_voltage` | Battery voltage | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_battery_voltage_2` | Battery voltage | matter | Aqara Wireless Remote Switch |  | diagnostic |  |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position_2` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position_3` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.aqara_wireless_remote_switch_current_switch_position_4` | Current switch position | matter | Aqara Wireless Remote Switch |  | diagnostic | integration |  |
| `sensor.backup_backup_manager_state` | Backup Manager state | backup | Backup |  |  |  |  |
| `sensor.backup_last_attempted_automatic_backup` | Last attempted automatic backup | backup | Backup |  |  |  |  |
| `sensor.backup_last_successful_automatic_backup` | Last successful automatic backup | backup | Backup |  |  |  |  |
| `sensor.backup_next_scheduled_automatic_backup` | Next scheduled automatic backup | backup | Backup |  |  |  |  |
| `sensor.bathroom2_hue_motion_sensor_zigbee_connectivity` | Zigbee connectivity | hue | Hue Motion Sensor | Spare Bedroom | diagnostic | integration |  |
| `sensor.bathroom_dimmer_switch_battery` | Battery | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom | diagnostic |  |  |
| `sensor.bathroom_illuminance` | Illuminance | hue | Bathroom | My Bathroom |  |  |  |
| `sensor.bed1_zigbee_connectivity` | Zigbee connectivity | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.bed3_zigbee_connectivity` | Zigbee connectivity | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.beige_ola_spotlight_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Beige Ola Spotlight Lamp | Living Room | diagnostic | integration |  |
| `sensor.beta_bed_lightstrip_zigbee_connectivity` | Zigbee connectivity | hue | Beta Bed Lightstrip | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity` | Zigbee connectivity | hue | Hallway Tap Dial Switch | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_3_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.3 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_4_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.4 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_6_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.6 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_ceiling_light_zigbee_connectivity` | Zigbee connectivity | hue | Beta Ceiling Light.3 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_flex_ceiling_light_1_zigbee_connectivity` | Zigbee connectivity | hue | Betaflex Ceiling Light.1 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_flex_ceiling_light_2_zigbee_connectivity` | Zigbee connectivity | hue | Betaflex Ceiling Light.2 | Spare Bedroom | diagnostic | integration |  |
| `sensor.beta_pass_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.1  | Hallway (Pass) | diagnostic | integration |  |
| `sensor.betaflex_lower_shelf_zigbee_connectivity` | Zigbee connectivity | hue | Ikea Skytrax Light | Bedroom | diagnostic | integration |  |
| `sensor.bot_4a_battery` | Battery | matter | Bot 4A |  | diagnostic |  |  |
| `sensor.ceiling_bedroom1_bed4_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity` | Zigbee connectivity | hue | core ceiling.3 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.ceiling_bedroom1_door_zone_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity` | Zigbee connectivity | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2` | Zigbee connectivity | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3` | Zigbee connectivity | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4` | Zigbee connectivity | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.ceiling_kitchen_fridge_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.9 | Core_kitchen | diagnostic | integration |  |
| `sensor.ceiling_kitchen_sink_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.10 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_br_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.8 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.1 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_north_wall_zone_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.2 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_op_south_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.5 | Living Room | diagnostic | integration |  |
| `sensor.ceiling_open_plan_east_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.5 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_open_plan_mm_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.6 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_open_plan_mr_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.4 | Openplan (Core) | diagnostic | integration |  |
| `sensor.ceiling_open_plan_se_zigbee_connectivity` | Zigbee connectivity | hue | Core Ceiling Light.4 | Openplan (Core) | diagnostic | integration |  |
| `sensor.chaos_laundry_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities | diagnostic | integration |  |
| `sensor.chaos_storage_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | White (E27) Hue Bulb | Laundry/Utilities | diagnostic | integration |  |
| `sensor.chaos_vault_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.1 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.core_300s_air_quality` | Air quality | vesync | Core 300S | Bedroom |  |  |  |
| `sensor.core_300s_filter_lifetime` | Filter lifetime | vesync | Core 300S | Bedroom | diagnostic |  |  |
| `sensor.core_300s_pm2_5` | PM2.5 | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `sensor.core_hue_tap_dial_switch_zigbee_connectivity` | Zigbee connectivity | hue | Core Tap Dial Light Switch | Openplan (Core) | diagnostic | integration |  |
| `sensor.core_signe_floor_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) | diagnostic | integration |  |
| `sensor.core_tap_dial_light_switch_battery` | Battery | hue | Core Tap Dial Light Switch | Openplan (Core) | diagnostic |  |  |
| `sensor.core_vault_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.4 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.hallway_dimmer_switch_battery` | Battery | hue | Hallway Dimmer Switch | Hallway (Pass) | diagnostic |  |  |
| `sensor.hallway_tap_dial_switch_battery` | Battery | hue | Hallway Tap Dial Switch | Spare Bedroom | diagnostic |  |  |
| `sensor.hub_3_button_1_current_switch_position` | Current switch position | matter | Hub 3 Button 1 |  | diagnostic | integration |  |
| `sensor.hub_3_button_2_current_switch_position` | Current switch position | matter | Hub 3 Button 2 |  | diagnostic | integration |  |
| `sensor.hub_3_button_3_current_switch_position` | Current switch position | matter | Hub 3 Button 3 |  | diagnostic | integration |  |
| `sensor.hub_3_humisensor_humidity` | Humidity | matter | Hub 3 HumiSensor |  |  |  | conversation, google |
| `sensor.hub_3_tempsensor_temperature` | Temperature | matter | Hub 3 TempSensor |  |  |  | conversation, google |
| `sensor.hue_bridge_pro_zigbee_connectivity` | Zigbee connectivity | hue | Hue Bridge Pro | Laundry/Utilities | diagnostic | integration |  |
| `sensor.hue_color_candle_1_zigbee_connectivity` | Zigbee connectivity | hue | Right Bedside Lamp | Bedroom | diagnostic | integration |  |
| `sensor.hue_color_lamp_1_zigbee_connectivity` | Zigbee connectivity | hue | Ola Whitborg XL Floor Lamp |  | diagnostic | integration |  |
| `sensor.hue_color_lamp_1_zigbee_connectivity_2` | Zigbee connectivity | hue | fado glass globe lamp |  | diagnostic | integration |  |
| `sensor.hue_dimmer_switch_4_zigbee_connectivity` | Zigbee connectivity | hue | Hallway Dimmer Switch | Hallway (Pass) | diagnostic | integration |  |
| `sensor.hue_essential_spot_1_zigbee_connectivity` | Zigbee connectivity | hue | Nymane 3-spot Lamp - Mid |  | diagnostic | integration |  |
| `sensor.hue_essential_spot_2_zigbee_connectivity` | Zigbee connectivity | hue | Alpha Ceiling Light.6 | Bedroom | diagnostic | integration |  |
| `sensor.hue_essential_spot_3_zigbee_connectivity` | Zigbee connectivity | hue | Nyamane 3-spot Lamp - Top  |  | diagnostic | integration |  |
| `sensor.hue_motion_sensor_battery` | Battery | hue | Hue Motion Sensor | Spare Bedroom | diagnostic |  |  |
| `sensor.hue_motion_sensor_battery_2` | Battery | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | diagnostic |  |  |
| `sensor.hue_motion_sensor_illuminance` | Illuminance | hue | Hue Motion Sensor | Spare Bedroom |  |  |  |
| `sensor.hue_motion_sensor_illuminance_2` | Illuminance | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  |  |  |
| `sensor.hue_motion_sensor_temperature` | Temperature | hue | Hue Motion Sensor | Spare Bedroom |  |  | conversation |
| `sensor.hue_motion_sensor_temperature_2` | Temperature | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  |  | conversation |
| `sensor.hue_play_1_zigbee_connectivity` | Zigbee connectivity | hue | Hue Play 1 |  | diagnostic | integration |  |
| `sensor.hue_play_2_zigbee_connectivity` | Zigbee connectivity | hue | Hue Play 2 |  | diagnostic | integration |  |
| `sensor.hue_smart_button_2_battery` | Battery | hue | Hue smart button 2 |  | diagnostic |  |  |
| `sensor.hue_smart_button_2_zigbee_connectivity` | Zigbee connectivity | hue | Hue smart button 2 |  | diagnostic | integration |  |
| `sensor.hue_smart_button_3_battery` | Battery | hue | Hue smart button 3 |  | diagnostic |  |  |
| `sensor.hue_smart_button_3_zigbee_connectivity` | Zigbee connectivity | hue | Hue smart button 3 |  | diagnostic | integration |  |
| `sensor.hue_smart_plug_1_zigbee_connectivity` | Zigbee connectivity | hue | Hue smart plug 1 |  | diagnostic | integration |  |
| `sensor.iphone_16pro_max_activity` | iPhone 16Pro Max  Activity | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_app_version` | iPhone 16Pro Max  App Version | mobile_app | iPhone 16Pro Max  |  | diagnostic |  |  |
| `sensor.iphone_16pro_max_audio_output` | iPhone 16Pro Max  Audio Output | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_average_active_pace` | iPhone 16Pro Max  Average Active Pace | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_battery_level` | iPhone 16Pro Max  Battery Level | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_battery_state` | iPhone 16Pro Max  Battery State | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_bssid` | iPhone 16Pro Max  BSSID | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_connection_type` | iPhone 16Pro Max  Connection Type | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_distance` | iPhone 16Pro Max  Distance | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_floors_ascended` | iPhone 16Pro Max  Floors Ascended | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_floors_descended` | iPhone 16Pro Max  Floors Descended | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_geocoded_location` | iPhone 16Pro Max  Geocoded Location | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_last_update_trigger` | iPhone 16Pro Max  Last Update Trigger | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_location_permission` | iPhone 16Pro Max  Location permission | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_sim_1` | iPhone 16Pro Max  SIM 1 | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_sim_2` | iPhone 16Pro Max  SIM 2 | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_ssid` | iPhone 16Pro Max  SSID | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_steps` | iPhone 16Pro Max  Steps | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.iphone_16pro_max_storage` | iPhone 16Pro Max  Storage | mobile_app | iPhone 16Pro Max  |  |  |  |  |
| `sensor.jeffs_ipad_app_version` | Jeff’s iPad App Version | mobile_app | Jeff’s iPad |  | diagnostic |  |  |
| `sensor.jeffs_ipad_audio_output` | Jeff’s iPad Audio Output | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_battery_level` | Jeff’s iPad Battery Level | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_battery_state` | Jeff’s iPad Battery State | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_bssid` | Jeff’s iPad BSSID | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_connection_type` | Jeff’s iPad Connection Type | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_geocoded_location` | Jeff’s iPad Geocoded Location | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_last_update_trigger` | Jeff’s iPad Last Update Trigger | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_location_permission` | Jeff’s iPad Location permission | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_ssid` | Jeff’s iPad SSID | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_ipad_storage` | Jeff’s iPad Storage | mobile_app | Jeff’s iPad |  |  |  |  |
| `sensor.jeffs_iphone_app_version` | Jeff’s iPhone App Version | mobile_app | Jeff’s iPhone |  | diagnostic |  |  |
| `sensor.jeffs_iphone_audio_output` | Jeff’s iPhone Audio Output | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_battery_level` | Jeff’s iPhone Battery Level | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_battery_state` | Jeff’s iPhone Battery State | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_bssid` | Jeff’s iPhone BSSID | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_connection_type` | Jeff’s iPhone Connection Type | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_geocoded_location` | Jeff’s iPhone Geocoded Location | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_last_update_trigger` | Jeff’s iPhone Last Update Trigger | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_location_permission` | Jeff’s iPhone Location permission | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_sim_1` | Jeff’s iPhone SIM 1 | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_sim_2` | Jeff’s iPhone SIM 2 | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_ssid` | Jeff’s iPhone SSID | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.jeffs_iphone_storage` | Jeff’s iPhone Storage | mobile_app | Jeff’s iPhone |  |  |  |  |
| `sensor.klasnick_beige_table_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) | diagnostic | integration |  |
| `sensor.macbook_air_active_audio_input` | MacBook Air  Active Audio Input | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_active_audio_output` | MacBook Air  Active Audio Output | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_active_camera` | MacBook Air  Active Camera | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_app_version` | MacBook Air  App Version | mobile_app | MacBook Air  |  | diagnostic |  |  |
| `sensor.macbook_air_audio_output` | MacBook Air  Audio Output | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_bssid` | MacBook Air  BSSID | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_connection_type` | MacBook Air  Connection Type | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_displays` | MacBook Air  Displays | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_frontmost_app` | MacBook Air  Frontmost App | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_geocoded_location` | MacBook Air  Geocoded Location | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_internal_battery_level` | MacBook Air  Internal Battery Level | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_internal_battery_state` | MacBook Air  Internal Battery State | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_last_update_trigger` | MacBook Air  Last Update Trigger | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_location_permission` | MacBook Air  Location permission | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_primary_display_id` | MacBook Air  Primary Display ID | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_primary_display_name` | MacBook Air  Primary Display Name | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_ssid` | MacBook Air  SSID | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.macbook_air_storage` | MacBook Air  Storage | mobile_app | MacBook Air  |  |  |  |  |
| `sensor.monica_vibelucci_arc_lamp_zigbee_connectivity` | Zigbee connectivity | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) | diagnostic | integration |  |
| `sensor.nymane_3_spot_lamp_low_zigbee_connectivity` | Zigbee connectivity | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) | diagnostic | integration |  |
| `sensor.play_gradient_tube_1_zigbee_connectivity` | Zigbee connectivity | hue | alpha gradient light-tube.1 | Bedroom | diagnostic | integration |  |
| `sensor.roller_shade_0a_battery` | Battery | matter | Roller Shade 0A |  | diagnostic |  |  |
| `sensor.roller_shade_0a_target_opening_position` | Target opening position | matter | Roller Shade 0A |  | diagnostic | integration |  |
| `sensor.roller_shade_2a_battery` | Battery | matter | Roller Shade 2A |  | diagnostic |  |  |
| `sensor.roller_shade_2a_target_opening_position` | Target opening position | matter | Roller Shade 2A |  | diagnostic | integration |  |
| `sensor.roller_shade_84_battery` | Battery | matter | Roller Shade 84 |  | diagnostic |  |  |
| `sensor.roller_shade_84_target_opening_position` | Target opening position | matter | Roller Shade 84 |  | diagnostic | integration |  |
| `sensor.secondary_bathroom_illuminance` | Illuminance | hue | Secondary Bathroom | Secondary Bathroom |  |  |  |
| `sensor.signe_gradient_floor_1_zigbee_connectivity` | Zigbee connectivity | hue | Signe gradient floor 1 | Openplan (Core) | diagnostic | integration |  |
| `sensor.signe_gradient_table_1_zigbee_connectivity` | Zigbee connectivity | hue | Signe gradient table 1 |  | diagnostic | integration |  |
| `sensor.speedtest_download` | Download | speedtestdotnet | SpeedTest | Parking |  |  |  |
| `sensor.speedtest_ping` | Ping | speedtestdotnet | SpeedTest | Parking |  |  |  |
| `sensor.speedtest_upload` | Upload | speedtestdotnet | SpeedTest | Parking |  |  |  |
| `sensor.splash_bathroom_dimmer_zigbee_connectivity` | Zigbee connectivity | hue | Splash Dimmer Switch | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_1_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.4 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_2_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.1 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_3_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.2 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_4_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.5 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_ceiling_light_5_zigbee_connectivity` | Zigbee connectivity | hue | Splash Ceiling Light.3 | Secondary Bathroom | diagnostic | integration |  |
| `sensor.splash_dimmer_switch_battery` | Battery | hue | Splash Dimmer Switch | Secondary Bathroom | diagnostic |  |  |
| `sensor.splash_pass_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Pass Ceiling Light.2 | Hallway (Pass) | diagnostic | integration |  |
| `sensor.sun_next_dawn` | Next dawn | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_dusk` | Next dusk | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_midnight` | Next midnight | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_noon` | Next noon | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_rising` | Next rising | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_next_setting` | Next setting | sun | Sun |  | diagnostic |  |  |
| `sensor.sun_solar_azimuth` | Solar azimuth | sun | Sun |  | diagnostic | integration |  |
| `sensor.sun_solar_elevation` | Solar elevation | sun | Sun |  | diagnostic | integration |  |
| `sensor.sun_solar_rising` | Solar rising | sun | Sun |  | diagnostic | integration |  |
| `sensor.throne_bathroom_ceiling_zigbee_connectivity` | Zigbee connectivity | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.throne_hue_motion_sensor_zigbee_connectivity` | Zigbee connectivity | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | diagnostic | integration |  |
| `sensor.withings_active_calories_burnt_today` | Active calories burnt today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_active_time_today` | Active time today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_average_heart_rate` | Average heart rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_average_respiratory_rate` | Average respiratory rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_breathing_disturbances_intensity` | Breathing disturbances intensity | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_deep_sleep` | Deep sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_distance_travelled_today` | Distance travelled today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_elevation_change_today` | Elevation change today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_intense_activity_today` | Intense activity today | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_light_sleep` | Light sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_maximum_heart_rate` | Maximum heart rate | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_maximum_respiratory_rate` | Maximum respiratory rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_minimum_heart_rate` | Minimum heart rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_minimum_respiratory_rate` | Minimum respiratory rate | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_moderate_activity_today` | Moderate activity today | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_rem_sleep` | REM sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_sleep_score` | Sleep score | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_snoring` | Snoring | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_snoring_episode_count` | Snoring episode count | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_soft_activity_today` | Soft activity today | withings | Withings | Bedroom (Alpha) |  | integration |  |
| `sensor.withings_steps_today` | Steps today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_time_to_sleep` | Time to sleep | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_time_to_wakeup` | Time to wakeup | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_total_calories_burnt_today` | Total calories burnt today | withings | Withings | Bedroom (Alpha) |  | user |  |
| `sensor.withings_wakeup_count` | Wakeup count | withings | Withings | Bedroom (Alpha) |  |  |  |
| `sensor.withings_wakeup_time` | Wakeup time | withings | Withings | Bedroom (Alpha) |  |  |  |
| `stt.home_assistant_cloud` | Home Assistant Cloud | cloud |  |  |  |  |  |
| `switch.automation_alpha_bedroom_dial_switch` | Automation: Alpha Bedroom Dial Switch | hue | Hue Bridge Pro | Laundry/Utilities | config |  |  |
| `switch.automation_hue_smart_button_3` | Automation: Hue smart button 3 | hue | Hue Bridge Pro | Laundry/Utilities | config |  |  |
| `switch.bot_4a` | switch.bot_4a | matter | Bot 4A |  |  |  | conversation, google |
| `switch.core_300s_child_lock` | Child lock | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `switch.core_300s_display` | Display | vesync | Core 300S | Bedroom |  |  | conversation, google |
| `switch.hue_motion_sensor_light_sensor_enabled` | Light sensor enabled | hue | Hue Motion Sensor | Spare Bedroom | config |  |  |
| `switch.hue_motion_sensor_light_sensor_enabled_2` | Light sensor enabled | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | config |  |  |
| `switch.hue_motion_sensor_motion_sensor_enabled` | Motion sensor enabled | hue | Hue Motion Sensor | Spare Bedroom | config |  |  |
| `switch.hue_motion_sensor_motion_sensor_enabled_2` | Motion sensor enabled | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom | config |  |  |
| `todo.shopping_list` | Shopping List | shopping_list |  |  |  |  | conversation |
| `tts.google_translate_en_com` | Google Translate en com | google_translate |  |  |  |  |  |
| `tts.home_assistant_cloud` | Home Assistant Cloud | cloud |  |  |  |  |  |
| `update.core_300s_firmware` | Firmware | vesync | Core 300S | Bedroom | diagnostic |  |  |
| `weather.forecast_home` | Home | met | Forecast |  |  |  |  |

## 10. Runtime Containers

```text
homeassistantz	ghcr.io/home-assistant/home-assistant:stable	Up 16 hours	
matter-server	ghcr.io/home-assistant-libs/python-matter-server:stable	Up 16 hours	
nodered	nodered/node-red:latest	Up 16 hours (healthy)	0.0.0.0:1880->1880/tcp, [::]:1880->1880/tcp
mosquitto	eclipse-mosquitto:2	Up 16 hours	0.0.0.0:1883->1883/tcp, [::]:1883->1883/tcp
```

## 11. Node-RED Surface

```json
{
  "counts": {
    "tab": 1,
    "comment": 1
  },
  "tabs": [
    {
      "id": "f6f2187d.f17ca8",
      "label": "Flow 1",
      "disabled": false
    }
  ],
  "nodes": [
    {
      "id": "f6f2187d.f17ca8",
      "type": "tab",
      "label": "Flow 1",
      "z": null
    },
    {
      "id": "3cc11d24.ff01a2",
      "type": "comment",
      "label": "WARNING: please check you have started this container with a volume that is mounted to /data\\n otherwise any flow changes are lost when you redeploy or upgrade the container\\n (e.g. upgrade to a more recent node-red docker image).\\n  If you are using named volumes you can ignore this warning.\\n Double click or see info side panel to learn how to start Node-RED in Docker to save your work",
      "z": "f6f2187d.f17ca8"
    }
  ]
}
```

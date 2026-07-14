# Hue Flat Naming & Structure

Last checked: 2026-05-24

This document tracks the Hue and Home Assistant naming layer for the flat. The priority is daily usability in Hue, HomeKit, Siri/voice, Home Assistant, dashboards, and physical control habits.

The flat uses a hybrid naming model:

- preserve the spatial codes because they are meaningful in the home model
- pair them with plain room/use language so the names remain readable in Hue, HomeKit, and HA
- keep fixture numbers stable so physical location, dashboards, and automations can converge

## Room Codes

| Code | User-facing meaning |
| --- | --- |
| Core | Shared open-plan living / dining / kitchen area |
| Alpha | Bedroom |
| Beta | Bedroom / spare room |
| Throne | Bathroom |
| Splash | Bathroom |
| Pass | Hallway |
| Chaos | Utility / storage |

## Current Hue Rooms

| Hue room |
| --- |
| Core Open Plan |
| Alpha Bedroom |
| Beta Bedroom |
| Pass Hallway |
| Splash Bathroom |
| Throne Bathroom |
| Chaos Utility |

`Core Kitchen` was deleted as a separate Hue room. Kitchen is now represented as a Core lighting zone rather than a separate room.

## Current Home Assistant Areas

Home Assistant areas were consolidated on 2026-05-24 to match the flat's room model. Duplicate, stale, and device-named areas were retired after their devices were moved.

| HA area | Aliases | Device count |
| --- | --- | ---: |
| Core Open Plan | Open Plan; Openplan; Openplan Core; Living Room; Living; Dining | 23 |
| Core Kitchen | Kitchen | 3 |
| Alpha Bedroom | Bedroom; Bedroom Alpha; Primary Bedroom; Main Bedroom | 20 |
| Beta Bedroom | Spare Bedroom; Spare Room; Room 2; Rear Bedroom; Guest Bedroom | 13 |
| Pass Hallway | Hallway; Pass; Front Door; Entry; Entrance | 9 |
| Throne Bathroom | Ensuite; Ensuite Bathroom; Main Bathroom; My Bathroom | 7 |
| Splash Bathroom | Secondary Bathroom; Rear Bathroom; Bathroom 2; Splash | 7 |
| Chaos Utility | Chaos; Utility; Laundry; Laundry Room; Laundry/Utilities; Storage | 5 |
| Parking | | 1 |

Retired HA areas:

- `Attic`
- `Bedroom`
- `Beta Bedroom` duplicate area
- `Default`
- `Dining`
- `Front Door`
- `Laundry room`
- `Living Room`
- `Living Room (2)`
- `My Bathroom`
- `Openplan`
- `Orange HomePod Mini`
- `Storage`
- `White HomePod Mini`

Area consolidation verification:

- Stale device area references: 0
- Stale entity area references: 0
- Registry backups were created before the merge in `/srv/homeassistant/config/.storage/` with the suffix `codex-area-merge-20260524-030121.bak`.

## Core Ceiling Numbering

Core ceiling fixtures are now numbered across the whole Core area:

| Range | Meaning |
| --- | --- |
| Core Ceiling 01-02 | Pathway to balcony |
| Core Ceiling 03-08 | Living area |
| Core Ceiling 09-10 | Kitchen area |

Individual fixture names in Hue and HA:

| Hue name | HA entity |
| --- | --- |
| Core Ceiling 01 | `light.core_ceiling_01` |
| Core Ceiling 02 | `light.core_ceiling_02` |
| Core Ceiling 03 | `light.core_ceiling_03` |
| Core Ceiling 04 | `light.core_ceiling_04` |
| Core Ceiling 05 | `light.core_ceiling_05` |
| Core Ceiling 06 | `light.core_ceiling_06` |
| Core Ceiling 07 | `light.core_ceiling_07` |
| Core Ceiling 08 | `light.core_ceiling_08` |
| Core Ceiling 09 | `light.core_ceiling_09` |
| Core Ceiling 10 | `light.core_ceiling_10` |

## Core Groups / Zones

The Core control layer exists in both Hue zones and HA light entities:

| Group | Contents | HA entity |
| --- | --- | --- |
| Core Path | Core Ceiling 01-02 | `light.core_path` |
| Core Living | Core Ceiling 03-08 | `light.core_living` |
| Core Kitchen | Core Ceiling 09-10 | `light.core_kitchen` |
| Core Ceiling | Core Ceiling 01-10 | `light.core_ceiling` |
| Core Ambient | Core lamps / strips / decorative ambient lights | `light.core_ambient` |
| Core All | Core Ceiling plus Core Ambient | `light.core_all` |

Hue zone child counts after verification:

| Hue zone | Child count |
| --- | ---: |
| Core Path | 2 |
| Core Living | 6 |
| Core Kitchen | 2 |
| Core Ceiling | 10 |
| Core Ambient | 9 |
| Core All | 19 |

## Applied Core Changes

Applied on 2026-05-24:

- Renamed Hue fixtures from `Core Open Plan Ceiling 01-08` and `Core Kitchen Ceiling 01-02` to `Core Ceiling 01-10`.
- Updated/created Hue zones: `Core Path`, `Core Living`, `Core Kitchen`, `Core Ceiling`, `Core All`.
- Renamed HA entity IDs and friendly names for the ten Core ceiling fixtures.
- Renamed HA entity IDs and friendly names for the Core group layer.

Applied ambient layer on 2026-05-24:

- Created Hue zone `Core Ambient`.
- Home Assistant exposed it as `light.core_ambient`.
- `Core Ambient` is the non-ceiling Core layer: lamps, Hue Play, gradient tube/strip, and decorative ambient fixtures.

## Verification

Hue verification:

- Core ceiling fixtures found: `Core Ceiling 01` through `Core Ceiling 10`
- Core zones found: `Core Path`, `Core Living`, `Core Kitchen`, `Core Ceiling`, `Core Ambient`, `Core All`

Home Assistant verification:

- Individual fixtures found as `light.core_ceiling_01` through `light.core_ceiling_10`
- Groups found as `light.core_path`, `light.core_living`, `light.core_kitchen`, `light.core_ceiling`, `light.core_ambient`, `light.core_all`

## Remaining Notes

- `Core All` currently includes Core Ceiling 01-10 plus the Core ambient layer available from Hue at the time of the change.
- The HA registry was updated through Home Assistant's websocket registry API, not by editing `.storage` directly.
- Future structural changes should preserve the hybrid naming model: code first, plain-language meaning second where needed.

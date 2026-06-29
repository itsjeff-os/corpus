# Smart Home Devices & Hubs — Full Inventory

Created by: Jefffffff
Created time: 13 January 2026 01:36
Category: Smart Home
Last edited by: Jefffffff
Last updated time: 13 January 2026 01:39
External Source: manual
Status: Active
Summary: Complete smart home device inventory including hubs, sensors, lighting, climate, media, and room-by-room mapping

## Overview

Complete inventory of all smart home hubs, bridges, and IoT devices. Organized by category with room-by-room mapping for spatial reference. Includes quantities, models, status, and integration notes.

---

## Smart Home Hubs & Bridges

### Aqara M3 Hub

- **Role:** Zigbee/Matter bridge
- **Primary use:** Scenes, sensors, and Aqara device control
- **Connectivity:** Wired ethernet (production)
- **Integration:** Home Assistant, Apple HomeKit (Matter), Aqara app
- **Status:** Production

### Philips Hue Bridge Pro

- **Role:** Lighting control for all rooms
- **Coverage:** All Hue lights, sensors, switches, dimmers, and buttons across flat
- **Connectivity:** Wired ethernet (production)
- **Integration:** Home Assistant, Apple HomeKit, Hue app
- **Status:** Production

### Apple HomeKit

- **Hubs:** Apple TV (x2), HomePods (x3)
- **Primary hub:** Apple TV (Open Plan, wired for reliability)
- **Role:** Orchestration, presence detection, automation triggers, Siri control, media playback
- **Integration:** Native HomeKit devices + Home Assistant bridge
- **Status:** Production

### Switchbot Hub 3

- **Role:** Switchbot device bridge (blinds)
- **Connectivity:** Wifi
- **Integration:** Home Assistant, Switchbot app
- **Status:** Production

### Google Home / Nest Mini

- **Role:** Voice assistant, media playback, smart home interface, Google Assistant routines
- **Quantity:** 1x Google Nest Mini
- **Integration:** Home Assistant, Google Home app, Chromecast
- **Status:** Production

---

## IoT Devices by Category

### Presence, Motion & Door Sensors

**Hue Motion Sensors** (x2)

- **Locations:** Bedroom 2, Hallway
- **Use:** Motion-triggered lighting, occupancy detection
- **Integration:** Hue Bridge → Home Assistant

**Aqara Motion Sensors** (x2)

- **Locations:** Various
- **Use:** Motion-triggered automation, security monitoring
- **Integration:** Aqara M3 Hub → Home Assistant

**Aqara FP1E Presence Sensor** (x1)

- **Location:** Bedroom 2
- **Technology:** mmWave radar (detects stationary presence)
- **Use:** Presence-aware lighting and climate control
- **Integration:** Aqara M3 Hub → Home Assistant

**Aqara FP2 Presence Sensors** (x3)

- **Locations:** Open Plan, Bedroom 1, Hallway (pending final config)
- **Technology:** mmWave radar with zone detection
- **Use:** Multi-zone presence detection, fine-grained automation triggers
- **Integration:** Matter → HomeKit/Home Assistant

**Aqara Door/Window Sensors** (x7 + 1x FP2 Matter-compatible)

- **Locations:** Main entry, bedrooms, bathrooms, laundry, storage
- **Use:** Open/close detection, security monitoring, automation triggers
- **Integration:** Aqara M3 Hub → Home Assistant

---

### Lighting & Control Interfaces

### Switches & Controllers

**Aqara Wireless H1 Switches** (x2)

- **Locations:** Various
- **Use:** Scene triggers, wireless control points
- **Integration:** Aqara M3 Hub → Home Assistant

**Hue Dimmer Switches** (x4)

- **Locations:** Bedrooms, Open Plan, Hallway
- **Use:** Lighting scenes, dimming, on/off control
- **Integration:** Hue Bridge → Home Assistant

**Hue Tap Dial Switches** (x3)

- **Locations:** Bedrooms, Open Plan
- **Use:** Rotary dimming, multi-scene control
- **Integration:** Hue Bridge → Home Assistant

**Hue Smart Buttons** (x3)

- **Locations:** Various
- **Use:** Single-action triggers, bedside controls
- **Integration:** Hue Bridge → Home Assistant

**Switchbot Switch Tongue** (x1)

- **Use:** Physical switch automation (non-smart switch control)
- **Integration:** Switchbot Hub 3 → Home Assistant

### Lights

**Philips Hue:**

- **Full flat coverage:** GU10 White Ambiance or Colour ceiling lights in all rooms
- **Ambient lighting:** Colour bulbs and lamps for mood/scene lighting
- **Gradient/strip lighting:** Gradient Lightstrip and solo strips for accent lighting
- **Integration:** Hue Bridge (all lights)
- **Control:** Hue app, HomeKit, Home Assistant, voice assistants, physical switches/dimmers

**Govee Colour Light Strip** (x1)

- **Location:** Accent lighting (room-specific)
- **Use:** RGB effects, music sync, accent lighting
- **Integration:** Govee app, Home Assistant (via API)

**Switchbot Switch Tongue** (x1)

- **Use:** Retrofit control for non-smart lighting
- **Integration:** Switchbot Hub 3 → Home Assistant

---

### Climate, Environment & Window Treatments

### Window Treatments

**Aqara Curtain Controller E1** (x2, U/I Track, paired as set)

- **Location:** Open Plan (main windows)
- **Type:** Electric curtain motors, paired for synchronized operation
- **Integration:** Aqara M3 Hub → Home Assistant
- **Automation:** Scheduled open/close, light-level triggers, presence-based

**Switchbot Roller Blinds**

- **Grey L** (x2)
- **Grey M** (x2)
- **Locations:** Bedrooms, bathrooms
- **Integration:** Switchbot Hub 3 → Home Assistant
- **Automation:** Scheduled, light-based, manual app/voice control

### Climate Control

**Dreo Smart Humidifiers**

- **HM713S** (6L capacity)
- **HM311S** (4L capacity)
- **Locations:** Bedrooms (humidity management)
- **Features:** Auto mode, app control, scheduling, humidity sensors
- **Integration:** Dreo app, Home Assistant (via API)

**Levoit Dual 200S Humidifier**

- **Location:** Open Plan or Bedroom
- **Features:** Dual mist output, app control, auto mode
- **Integration:** VeSync app, Home Assistant (via API)

**Levoit Air 300S Purifier**

- **Location:** Bedroom 1
- **Features:** HEPA filtration, auto mode, air quality sensor, sleep mode
- **Integration:** VeSync app, Home Assistant (via API)

**Dreo Smart Portable AC** (14,000 BTU – 516S)

- **Location:** Open Plan or Bedroom (mobile)
- **Features:** App control, scheduling, dehumidify mode
- **Integration:** Dreo app, Home Assistant (via API)

**Meaco Smart Portable AC** (12,000 BTU Pro CH)

- **Location:** Bedroom or Open Plan (mobile)
- **Features:** App control, scheduling, low-noise mode
- **Integration:** MeacoLink app, Home Assistant (via API)

---

### Scent, Health & Utility

### Aroma/Scent Devices

**Muji Diffuser** (x1)

- **Type:** Ultrasonic aroma diffuser
- **Location:** Bedroom or Open Plan
- **Integration:** Manual control (no smart integration)

**Aera Full-Size** (x2)

- **Locations:** Open Plan, Bedroom
- **Features:** App-controlled scent intensity, scheduling, capsule-based
- **Integration:** Aera app (limited or no HA integration)

**Aera Minis** (x4)

- **Locations:** Distributed across rooms
- **Features:** Compact scent diffusion, app control, scheduling
- **Integration:** Aera app

### Health Monitoring

**Withings Sleep Mat**

- **Location:** Bedroom 1 (under mattress)
- **Features:** Sleep tracking, heart rate, breathing, sleep cycle analysis
- **Integration:** Withings Health Mate app, potential HA webhook

**Oura Gen 4 Ring**

- **Type:** Wearable health/sleep tracker
- **Metrics:** Sleep stages, HRV, temperature, activity, readiness
- **Integration:** Oura app, potential API → HA

**Larq Pitcher & Bottle**

- **Type:** UV-C self-cleaning water purification
- **Integration:** None (standalone devices)

**Eufy Smart Scale**

- **Metrics:** Weight, body composition (BMI, body fat %, etc.)
- **Integration:** EufyLife app, potential HA integration

### Utilities

**Eufy S1 Omni Pro RoboVac & Mop**

- **Location:** Entire flat (auto-navigation)
- **Features:** Vacuum, mop, auto-empty dock, room mapping, scheduling
- **Integration:** Eufy app, Home Assistant (via API or Tuya)
- **Status:** Production

---

### Media, Audio & Entertainment

### Video Devices

**Apple TV** (x2)

- **Open Plan:** Wired ethernet, primary HomeKit hub
- **Bedroom:** Wireless, secondary hub and media playback
- **Use:** Media streaming, HomeKit control, AirPlay, automation hub
- **Integration:** Native HomeKit, Home Assistant bridge

**Samsung Serif 50"** (Open Plan)

- **Type:** 4K QLED TV
- **Features:** Smart TV apps, AirPlay 2, HDMI-CEC
- **Integration:** Home Assistant (via SmartThings or Samsung API), HomeKit (via AirPlay)

**Samsung UHD 50" Black** (Bedroom)

- **Type:** 4K UHD TV
- **Features:** Smart TV apps, AirPlay 2, HDMI-CEC
- **Integration:** Home Assistant (via SmartThings or Samsung API), HomeKit (via AirPlay)

### Audio Devices

**HomePod** (x1, Open Plan)

- **Use:** Music playback, Siri control, HomeKit hub, intercom
- **Integration:** Native HomeKit, Home Assistant bridge

**HomePod Minis** (x2)

- **Locations:** Bedrooms
- **Use:** Music playback, Siri control, HomeKit hubs, intercom
- **Integration:** Native HomeKit, Home Assistant bridge

**Google Nest Mini** (x1)

- **Location:** Open Plan or Bedroom
- **Use:** Google Assistant, media playback, smart home voice control
- **Integration:** Google Home, Home Assistant (via Google Assistant)

**Samsung Q700D Soundbar with Subwoofer**

- **Status:** In storage or pending replacement/upgrade
- **Previous location:** Open Plan (paired with Samsung Serif)
- **Features:** Dolby Atmos, wireless sub, HDMI-CRC

---

## Room-by-Room Device Mapping

### Open Plan (Core)

**Lighting:**

- Philips Hue GU10 ceiling lights
- Hue Colour ambient lights and lamps
- Gradient Lightstrip (accent)

**Presence & Sensors:**

- Aqara FP2 mmWave presence sensor

**Window Treatments:**

- Aqara Curtain Controllers E1 (x2, paired set)

**Climate:**

- Dreo Portable AC (14,000 BTU) or Meaco AC (12,000 BTU)
- Levoit Dual 200S Humidifier (seasonal)

**Media:**

- Apple TV (wired)
- Samsung Serif 50" TV
- HomePod
- Q700D Soundbar (in storage or pending)

---

### Bedroom 1 (Alpha)

**Lighting:**

- Hue GU10 ceiling lights (x6)
- Hue Colour gradient/ambient lights
- Hue lamps

**Presence & Sensors:**

- Aqara FP2 mmWave presence sensor
- Aqara door sensor

**Window Treatments:**

- Switchbot Roller Blinds (Grey L or M)

**Climate:**

- Dreo Humidifier (HM713S or HM311S)
- Levoit Air 300S Purifier

**Health:**

- Withings Sleep Mat (under mattress)

**Media:**

- Samsung UHD 50" Black TV
- HomePod Mini

---

### Bedroom 2 (Beta)

**Lighting:**

- Hue White Ambiance ceiling lights

**Presence & Sensors:**

- Aqara FP1E mmWave presence sensor
- Aqara FP2 presence sensor
- Aqara door sensor
- Hue motion sensor

**Window Treatments:**

- Switchbot Roller Blinds (Grey L or M)

---

### Hallway (Pass)

**Lighting:**

- Hue ceiling lights

**Presence & Sensors:**

- Hue motion sensors
- Aqara FP2 or FP1E sensors (pending final configuration)
- Aqara door/contact sensors

---

### Laundry/Utility (Chaos)

**Lighting:**

- Hue ceiling lights

**Sensors:**

- Aqara door sensors

**Utilities:**

- Eufy S1 Omni Pro RoboVac & Mop (docking station)

**Infrastructure Hubs (all located here):**

- Aqara M3 Hub
- Philips Hue Bridge Pro
- Switchbot Hub 3
- Network equipment (Unifi, switches)

---

## Integration Summary

**Primary Control Platform:** Home Assistant (all devices integrated)

**Secondary Platforms:**

- Apple HomeKit (Hue, Aqara Matter devices, Apple TVs, HomePods)
- Google Home (Nest Mini, Chromecast-enabled devices)
- Native apps (Hue, Aqara, Switchbot, Dreo, Levoit, Eufy, etc.)

**Voice Control:**

- Siri (via HomePods, Apple TVs, iPhone)
- Google Assistant (via Nest Mini)

**Automation Engine:** Home Assistant + Apple Home automations (redundant triggers for reliability)

---

## Documentation Notes

- All devices catalogued with model numbers, quantities, locations, and integration paths
- Room mapping provides spatial reference for troubleshooting and planning
- Hub inventory shows control topology (which hub manages which device types)
- Spare/retired smart home hardware tracked separately in compute/infrastructure docs
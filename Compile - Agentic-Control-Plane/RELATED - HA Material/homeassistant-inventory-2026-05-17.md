# Home Assistant Inventory

Generated: 2026-05-17
Source: read-only registry/config inspection from `servers` / `/srv/homeassistant/config`.
Secrets and token-like config data are not included.

## Summary

- Integrations: `28`
- Areas: `21`
- Floors: `1`
- Labels: `5`
- Devices: `147`
- Entities: `589`
- Disabled entities: `103`
- Hidden entities: `0`
- Disabled devices: `0`
- Conversation-exposed entities: `136`
- Google Assistant-exposed entities: `83`
- Alexa-exposed entities: `0`

## Integrations

| Domain | Title | Source | Disabled | Entry ID | Unique ID |
| --- | --- | --- | --- | --- | --- |
| apple_tv | Bedroom | zeroconf |  | 01KK0KGB01KC0MEVTHC9V9Y72H | DA:FC:63:11:CF:75 |
| apple_tv | Beta Bedroom | zeroconf |  | 01KKYZPS9WVV23VF427JP3729K | 0E:42:85:E6:20:95 |
| apple_tv | Living Room | zeroconf |  | 01KJG27B1BS9B3SQP56B6FHP76 | 16:54:0E:A3:12:0A |
| apple_tv | Living Room (2) | zeroconf |  | 01KJG25VSZS1CQXWN50A25JC5T | 5E:69:D8:92:7B:06 |
| apple_tv | Living Room (2) | zeroconf |  | 01KKYZMZ0H4MDY0PDSSTHGVWBQ | E6D3120B306D |
| apple_tv | White HomePod Mini | zeroconf |  | 01KKFP0AH670JVYE9N6BAV6ASA | 82:CA:6B:AD:C9:B5 |
| apple_tv | living Room Apple TV | zeroconf |  | 01KJCWC7FPDDF3JTKWKPS60A2W | 7E:55:28:08:27:9A |
| backup | Backup | system |  | 01KE8C76DVYAAG1D1G773A2P8T |  |
| bluetooth | Shenzhen Phaten Tech. LTD None (8C:BD:37:64:26:26) | integration_discovery |  | 01KE8C76D83VV14J40VFV2MY6Q | 8C:BD:37:64:26:26 |
| cast | Google Cast | zeroconf |  | 01KE8C7AA1W2XK0SDM7KHZZQ1P | cast |
| cloud | Home Assistant Cloud | system |  | 01KEAYSHQG86NT532ZXKVH54WA |  |
| go2rtc | go2rtc | system |  | 01KE8C76DJFSEZ46J6ZA8RJNMX |  |
| google_translate | Google Translate text-to-speech | onboarding |  | 01KE91DVJ87CB7GDQN3816E1T4 |  |
| hue | Hue Bridge c42996c58a91 | zeroconf |  | 01KQJ6JHKQQ2DZ0PK6M0DT3WFR | c42996c58a91 |
| matter | Matter | zeroconf |  | 01KKR0E56PAZ568V40ARDBAMYR |  |
| met | Home | onboarding |  | 01KE91DVPP110V3YHQ6Y1RBFJN |  |
| mobile_app | Jeff’s iPad | registration |  | 01KJXBWPPBWFEJMJ21N1ZVQ6AV | io.robbie.HomeAssistant-2C1B5EF5-AC23-48F3-A01F-3BE96720A309 |
| mobile_app | Jeff’s iPhone | registration |  | 01KMEC8P6EFQAEMK2SR21A30AZ | io.robbie.HomeAssistant-45A83C97-F647-4D17-B996-48F246A805CE |
| mobile_app | MacBook Air  | registration |  | 01KEAY01EBMBS1WC70CWY2KRMM | io.robbie.HomeAssistant-4DF379A5-B89E-587F-9550-D89639687D16 |
| mobile_app | iPhone 16Pro Max  | registration |  | 01KE9K0JRMH5EAY8JFWNCQGM4W | io.robbie.HomeAssistant-1FA7ACC1-D32A-4AF7-96F2-405105601FB7 |
| mqtt | 192.168.1.39 | user |  | 01KJCTC70CN506EE23RWK1JMG3 |  |
| radio_browser | Radio Browser | onboarding |  | 01KE91DVP4CM1GP7W3NQ6RFSES |  |
| shopping_list | Shopping list | onboarding |  | 01KE91DVHS4B7KB3RD5BE8B6DJ | shopping_list |
| speedtestdotnet | SpeedTest | user |  | 01KKQ16Q9W2JX6D0ZPV70901WF |  |
| sun | Sun | import |  | 01KE8C760923KJ4PC4FPDD7AC2 |  |
| thread | Thread | zeroconf |  | 01KE8C797FV5PXCY333VPVMWVE |  |
| vesync | Home@itsjeff.org | user |  | 01KN8Y3019MX4C436429W21Z4A |  |
| withings | Withings | user |  | 01KFF3W24JX0DFXRRAS4KD66QR | 43916788 |

## Integration Domain Counts

| Value | Count |
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

## Entity Domain Counts

| Value | Count |
| --- | ---: |
| binary_sensor | 65 |
| button | 56 |
| cover | 7 |
| device_tracker | 4 |
| event | 38 |
| fan | 1 |
| input_boolean | 1 |
| light | 74 |
| media_player | 12 |
| number | 4 |
| person | 1 |
| remote | 7 |
| scene | 13 |
| select | 1 |
| sensor | 290 |
| stt | 1 |
| switch | 9 |
| todo | 1 |
| tts | 2 |
| update | 1 |
| weather | 1 |

## Entity Platform Counts

| Value | Count |
| --- | ---: |
| apple_tv | 14 |
| backup | 5 |
| cast | 5 |
| cloud | 3 |
| google_translate | 1 |
| homeassistant | 1 |
| hue | 212 |
| input_boolean | 1 |
| matter | 227 |
| met | 1 |
| mobile_app | 70 |
| person | 1 |
| shopping_list | 1 |
| speedtestdotnet | 3 |
| sun | 10 |
| vesync | 7 |
| withings | 27 |

## Device Manufacturer Counts

| Value | Count |
| --- | ---: |
| Signify Netherlands B.V. | 85 |
| Aqara | 26 |
| Apple | 11 |
| SwitchBot | 11 |
| Google Inc. | 4 |
| Unknown | 2 |
| Shenzhen Phaten Tech. LTD | 1 |
| Home Assistant | 1 |
| Met.no | 1 |
| Withings | 1 |
| Signify | 1 |
| Unknown manufacturer | 1 |
| VeSync | 1 |
| IKEA of Sweden | 1 |

## Device Model Counts

| Value | Count |
| --- | ---: |
| Hue ambiance spot | 24 |
| Hue color spot | 12 |
| Zone | 10 |
| Aqara Door and Window Sensor | 7 |
| Room | 7 |
| Hub 3 | 6 |
| Unknown | 4 |
| Google Nest Hub | 4 |
| Hue Essential spot | 4 |
| HomePod (gen 2) | 3 |
| Roller Shade | 3 |
| Hue smart button | 3 |
| Hue color lamp | 3 |
| Hue tap dial switch | 3 |
| Hue dimmer switch | 3 |
| Apple TV 4K (gen 3) | 2 |
| HomePod Mini | 2 |
| Aqara Curtain Driver E1 | 2 |
| Aqara Presence Sensor FP1E | 2 |
| Aqara Motion Sensor P1 | 2 |
| Hue motion sensor | 2 |
| Hue white lamp | 2 |
| Signe gradient floor | 2 |
| Hue color candle | 2 |
| Hue Play | 2 |
| Home Assistant Backup | 1 |
| Forecast | 1 |
| iPhone17,2 | 1 |
| Mac15,12 | 1 |
| iPhone18,2 | 1 |
| iPad17,1 | 1 |
| Aqara Hub M3 | 1 |
| Aqara Vibration Sensor | 1 |
| Aqara Wireless Remote Switch | 1 |
| SwitchBot Hub 3 | 1 |
| Presence kitchen zone | 1 |
| Approaching Openplan room | 1 |
| Presence living zone | 1 |
| Presence Dining zone | 1 |
| Absence for 5mins Openplan | 1 |
| Absence for 3mins kitchen zone | 1 |
| Absence for 3mins living zone | 1 |
| Absence for 3mins dining zone | 1 |
| WiZ A60 Filament | 1 |
| Beta bedroom presence detected | 1 |
| Beta bedroom no presence 3mins | 1 |
| LS01D | 1 |
| Core300S | 1 |
| Bot | 1 |
| Hue Bridge | 1 |
| Signe gradient table | 1 |
| Hue lightguide bulb | 1 |
| Play gradient tube | 1 |
| Dimmable light | 1 |
| Hue smart plug | 1 |
| Hue lightstrip plus | 1 |

## Floors

| Name | ID | Aliases |
| --- | --- | --- |
| Flat |  |  |

## Areas

| Name | ID | Floor | Aliases |
| --- | --- | --- | --- |
| Attic | attic |  |  |
| Bedroom | bedroom |  |  |
| Bedroom (Alpha) | alpha_bedroom |  |  |
| Beta Bedroom | beta_bedroom_2 |  |  |
| Core_kitchen | core_kitchen |  | Kitchen |
| Default | default |  |  |
| Dining | dining |  |  |
| Ensuite (Throne) Bathroom | throne_bathroom |  |  |
| Hallway (Pass) | pass |  |  |
| Laundry room | laundry_room |  |  |
| Laundry/Utilities | chaos |  |  |
| Living Room | living_room |  |  |
| Living Room (2) | living_room_2 |  |  |
| My Bathroom | my_bathroom |  |  |
| Openplan | openplan |  |  |
| Openplan (Core) | core |  |  |
| Parking | parking |  |  |
| Secondary Bathroom | secondary_bathroom |  |  |
| Spare Bedroom | beta_bedroom |  | Beta Bedroom, Guest Bedroom, Rear Bedroom |
| Storage | storage |  |  |
| White HomePod Mini | white_homepod_mini |  |  |

## Devices By Area Count

| Area | Devices |
| --- | ---: |
| Bedroom | 9 |
| Bedroom (Alpha) | 11 |
| Core_kitchen | 4 |
| Ensuite (Throne) Bathroom | 6 |
| Hallway (Pass) | 7 |
| Laundry room | 1 |
| Laundry/Utilities | 3 |
| Living Room | 8 |
| Living Room (2) | 1 |
| My Bathroom | 1 |
| Openplan (Core) | 13 |
| Parking | 1 |
| Secondary Bathroom | 7 |
| Spare Bedroom | 13 |
| Unassigned | 61 |
| White HomePod Mini | 1 |

## Entities By Direct Area Count

| Area | Entities |
| --- | ---: |
| Unassigned | 589 |

## Full Device List

| Name | Area | Manufacturer | Model | Model ID | Domains | Disabled | ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| All Bedroom & Bathroom | Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | 9bcdac103a6fe193a4cd1ff6864c8012 |
| Alpha Ceiling Light.6 | Bedroom | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | ba9d7d9777253c445066c26aca659483 |
| alpha gradient light-tube.1 | Bedroom | Signify Netherlands B.V. | Play gradient tube | 915005988001 | hue |  | e6b677474cc1f572d83596e2d103af6a |
| Bedroom Ceiling | Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | b0e22adacb7b181d0195839086e46516 |
| Bedroom Lamps | Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | ee40c0ac85ca50f3ee21e699ac8f14ed |
| Core 300S | Bedroom | VeSync | Core300S |  | vesync |  | 735ef7fcb4452be87b579182ccbe01a5 |
| Ikea Skytrax Light | Bedroom | IKEA of Sweden | Dimmable light | TRADFRI Driver 30W | hue |  | 475fe7c2987064f9797a7860b2e6f7ad |
| Orange HomePod Mini | Bedroom | Apple | HomePod Mini |  | apple_tv |  | 2f4611589743ae3b7fbd280c7f611782 |
| Right Bedside Lamp | Bedroom | Signify Netherlands B.V. | Hue color candle | LCE002 | hue |  | a3f86e911440eba9848a331183d010d2 |
| Alpha Bedroom Dial Switch | Bedroom (Alpha) | Signify Netherlands B.V. | Hue tap dial switch | RDM002 | hue |  | f3a36de300c078041de5869a79f49dbe |
| Alpha Ceiling Light.4 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | eb2058653fe9e0f95ad5aa8018b97de2 |
| Alpha Ceiling Light.6 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | c1c0e309ed8147ef57d651df415bc548 |
| Alpha Hue Smart Button | Bedroom (Alpha) | Signify Netherlands B.V. | Hue smart button | RDM005 | hue |  | 500c186b1b951c54ec8b27c162c9e452 |
| Alphabed Ceiling Light.3 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | 5d5d2cd72b6952b59a09cb567a37284c |
| Alphabed Ceiling Light.5 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | 55f7455e695e1ce7fdddb9b06f95ac1e |
| Alphabed Ceiling Light.5 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | c679070b7932d16308b82b9e3d646938 |
| Bedroom | Bedroom (Alpha) | Signify Netherlands B.V. | Room |  | hue |  | 50a528511760fe9c34e7301b1e2e3cc3 |
| core ceiling.3 | Bedroom (Alpha) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 3ea5d1bb94beb7cccc04318580529ee7 |
| Nymane 3-spot Lamp - Low | Bedroom (Alpha) | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | 2e19b66efcd2fdf07d25df6ff0dd9518 |
| Withings | Bedroom (Alpha) | Withings |  |  | withings |  | f30934f854f8d5d86ff183095961de55 |
| Core Ceiling Light.9 | Core_kitchen | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | f31d63cbe41b5f1acd30ad687951c840 |
| Kitchen | Core_kitchen | Signify Netherlands B.V. | Room |  | hue |  | c4511e091350b7f37d4f417193c8d386 |
| Kitchen Ceiling | Core_kitchen | Signify Netherlands B.V. | Zone |  | hue |  | fa6e413f91600e74a6443af15cf1797b |
| Kitchen Task | Core_kitchen | Signify Netherlands B.V. | Zone |  | hue |  | 8cc5a4ca37e3955327e390a50af4630f |
| Bathroom dimmer switch | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue dimmer switch | RWL022 | hue |  | 9262c97c808756f1c42c9a5f56d07b44 |
| Hue Motion Sensor | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue motion sensor | SML003 | hue |  | 3a26058d1afa9fa8888a9b3865c8eaa7 |
| Throne Ceiling above Door | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | b4da620be9a589bb9a2039e1ab78ebef |
| Throne Ceiling above shower door | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 22a1188f6ffa438992b8004a39cd432f |
| Throne Ceiling above sink | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 062b0dbde1538a39a2caddb290a7f1ec |
| Throne Ceiling Light.3 | Ensuite (Throne) Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 7ad73057c31770c617cd496edba33088 |
| Hallway | Hallway (Pass) | Signify Netherlands B.V. | Room |  | hue |  | a8a5ae19c7ced86ad29d7245978c0d56 |
| Hallway Dimmer Switch | Hallway (Pass) | Signify Netherlands B.V. | Hue dimmer switch | RWL022 | hue |  | 7158827f268292c33df8d3ac80d77f8b |
| Pass Ceiling Light.1 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 1fc62b8e8aa80845dc7cb23e3f0bc24f |
| Pass Ceiling Light.1  | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | a1493cb9fc881b1421e04687bc9553a3 |
| Pass Ceiling Light.2 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | b3b83fe3b391eaa9d7c5e917a8a028d1 |
| Pass Ceiling Light.4 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | fbfcf983165eca43796973ac96dfd87f |
| Pass Ceiling Light.5 | Hallway (Pass) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | b282b813d0ba73db7eb149a8fccfd390 |
| Laundry room | Laundry room | Signify Netherlands B.V. | Zone |  | hue |  | 3c4a13dec7e554b24b395ff8bdc8fda5 |
| Hue Bridge Pro | Laundry/Utilities | Signify Netherlands B.V. | Hue Bridge | BSB003 | hue |  | d655489921cbb3a2585dc855c0d1ea75 |
| Laundry (Chaos) Ceiling Light | Laundry/Utilities | Signify Netherlands B.V. | Hue white lamp | LWA018 | hue |  | cc79d7dfe1b17181869f10c35cc4c833 |
| White (E27) Hue Bulb | Laundry/Utilities | Signify Netherlands B.V. | Hue white lamp | LWA018 | hue |  | f72d9da87ad9f369da5b9fa4bccfb8aa |
| Beige Ola Spotlight Lamp | Living Room | Signify Netherlands B.V. | Hue color lamp | LCA001 | hue |  | 529049bbc4a02b9ebd873f19ca3412da |
| Core Ceiling Light.5 | Living Room | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | 25fd95b77ffb4e30f911e0e44136680e |
| Core Living Ceiling | Living Room | Signify Netherlands B.V. | Zone |  | hue |  | 34f94074f6947cf4bb83f5dcd89ffbd8 |
| Core Lounge HomePod | Living Room | Apple | HomePod (gen 2) |  | apple_tv |  | 12b333bc773ab0d1bc7c261a26743962 |
| Core Lounge HomePod | Living Room | Apple | HomePod (gen 2) |  | apple_tv |  | 4a2969bba349c62c3ae8ed2a0139f3ff |
| Living room | Living Room | Signify Netherlands B.V. | Room |  | hue |  | d658ffac53d39553a6e2140b1e97cef0 |
| Living room lamps | Living Room | Signify Netherlands B.V. | Zone |  | hue |  | 2ca99b27e5a48523c674bcc99b7ee560 |
| Lounge Apple TV (WIred) | Living Room | Apple | Apple TV 4K (gen 3) |  | apple_tv |  | 612098715827acdd9ca11b9286e29057 |
| Living Room (2) | Living Room (2) | Apple | HomePod (gen 2) |  | apple_tv |  | 23a9a926a450af03776a332578199e00 |
| Bathroom | My Bathroom | Signify Netherlands B.V. | Room |  | hue |  | 117c704d9e32a6e962854eb81789dab3 |
| Core Ceiling Light.1 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | 1e9955f25dc9f5c09dcb90e0fb8d60dd |
| Core Ceiling Light.10 | Openplan (Core) | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | de3a3b86f9f861abd8474a0bbee6e039 |
| Core Ceiling Light.2 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG006 | hue |  | cac5cdcc358702139ac465f8994f9e83 |
| Core Ceiling Light.4 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | f8149a06f87fed8bb2412cf2fea76be7 |
| Core Ceiling Light.4 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | c1c74acf710e8ce06117655e979e893e |
| Core Ceiling Light.5 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | 7ff3eb57a4f7b8b83823e6bbc1cd43c0 |
| Core Ceiling Light.6 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | f2bdc76a73830aa7fa6193766aed417e |
| Core Ceiling Light.8 | Openplan (Core) | Signify Netherlands B.V. | Hue color spot | LCG002 | hue |  | 11501df1df87e0a6ea1a99334fded6d2 |
| Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) | Signify Netherlands B.V. | Hue lightguide bulb | LCZ001 | hue |  | 9000c66a1b0d6684075d3e5c53d1543c |
| Core Tap Dial Light Switch | Openplan (Core) | Signify Netherlands B.V. | Hue tap dial switch | RDM002 | hue |  | 9f1606f2d60df3ef87d614354986c424 |
| Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) | Signify Netherlands B.V. | Signe gradient floor | 915005987701 | hue |  | 258fcb0a550539cc7ec6fffe58967e36 |
| Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) | Signify Netherlands B.V. | Hue color candle | LCE002 | hue |  | 33595151421af22100a3e06457f0d43f |
| Signe gradient floor 1 | Openplan (Core) | Signify Netherlands B.V. | Signe gradient floor | 915005987701 | hue |  | c2789cbe73d4b79832da4a6a2e328737 |
| SpeedTest | Parking |  |  |  | speedtestdotnet |  | 298e8da3405ebce662aec90ec1c65a87 |
| Secondary Bathroom | Secondary Bathroom | Signify Netherlands B.V. | Room |  | hue |  | 6d7b499febad4be04c50281d66c355b9 |
| Splash Ceiling Light.1 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 712dfdefa747a25fb6b5491f50d4fc77 |
| Splash Ceiling Light.2 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 33028e1253bd920ca8025d846edbb6e6 |
| Splash Ceiling Light.3 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 345f22c2aac0cf310cc467f20ad291d4 |
| Splash Ceiling Light.4 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 5200e66fdc90aad0dd0cbceb76c22319 |
| Splash Ceiling Light.5 | Secondary Bathroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 1aecb535c3b242ba001f8fe849f0cc66 |
| Splash Dimmer Switch | Secondary Bathroom | Signify Netherlands B.V. | Hue dimmer switch | RWL022 | hue |  | 0a7d029aeef8c21cb1ed5d3be91ad78e |
| Bedroom Apple TV | Spare Bedroom | Apple | Apple TV 4K (gen 3) |  | apple_tv |  | f417c8f588f9fd252fc32de6be532da9 |
| Beta Bed Lightstrip | Spare Bedroom | Signify Netherlands B.V. | Hue lightstrip plus | LCL007 | hue |  | d9da816eb1ea175c045b94dda1fab89c |
| Beta Bedroom & Bath | Spare Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | 0fade83b4b0b0f8f4cd529c4720bd2c2 |
| Beta Ceiling Light.3 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | d82ba9da0b831576a30a6202b35686cc |
| Beta Ceiling Light.3 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | ec259a6304fedd4f2569aa942ef6edb9 |
| Beta Ceiling Light.4 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | 95dba2dec02b41db4ea3ca072dcdd6d0 |
| Beta Ceiling Light.6 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | dc71020d45c5332607408e59045efbf9 |
| Betaflex Ceiling Light.1 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | fb3b1cc5cd84b7435b46d79ba3160450 |
| Betaflex Ceiling Light.2 | Spare Bedroom | Signify Netherlands B.V. | Hue ambiance spot | LTG005 | hue |  | c27b8a08b76af2ed70e81a475a781ac8 |
| Hallway Tap Dial Switch | Spare Bedroom | Signify Netherlands B.V. | Hue tap dial switch | RDM002 | hue |  | b8a1e7c445f4889533cbd7600f709aee |
| Hue Motion Sensor | Spare Bedroom | Signify Netherlands B.V. | Hue motion sensor | SML003 | hue |  | c61c4551d3ec38cda5ef874359c7d174 |
| Spare Bedroom | Spare Bedroom | Signify Netherlands B.V. | Room |  | hue |  | 38f7ad003f2fa943ee7574fb8e21dcb2 |
| Spare Bedroom Ceiling | Spare Bedroom | Signify Netherlands B.V. | Zone |  | hue |  | 514f06a7f929e6441e7c3208365296bd |
| Absence for 3mins dining zone | Unassigned | Aqara | Absence for 3mins dining zone |  | matter |  | d87b349943815bc7c6955598c148be6e |
| Absence for 3mins kitchen zone | Unassigned | Aqara | Absence for 3mins kitchen zone |  | matter |  | 9cf834287d35c92b1c2b15d4e2563e3d |
| Absence for 3mins living zone | Unassigned | Aqara | Absence for 3mins living zone |  | matter |  | 9c402f1bb0f2e12aad2c1a3445cc2973 |
| Absence for 5mins Openplan | Unassigned | Aqara | Absence for 5mins Openplan |  | matter |  | b12ba98833de10944c276b8c986b48d5 |
| Approaching Openplan room | Unassigned | Aqara | Approaching Openplan room |  | matter |  | ef6a2abe0d1fa53d01b8198d8aeadee0 |
| Aqara Curtain Driver E1 | Unassigned | Aqara | Aqara Curtain Driver E1 |  | matter |  | 3e1dbf216befd9366e10e291f07948db |
| Aqara Curtain Driver E1 | Unassigned | Aqara | Aqara Curtain Driver E1 |  | matter |  | 412148a8ec0f5f9ba347008bb9c48d19 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 880b2d33ed5a8a7f7f00c30568e2f664 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 55707b23ebbe9e56dac212af4d16e418 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 0cd6f6ad32a2c0b7c938478dc91b1347 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 92e1843e781f34e8bcc13aa84f423eb9 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 0728ce0e83045cf9666b391c53941d1e |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | 9398c3235542814e4cca0c14249228e4 |
| Aqara Door and Window Sensor | Unassigned | Aqara | Aqara Door and Window Sensor |  | matter |  | e7b7536f089b76b864bc1668e48f665c |
| Aqara Hub M3 | Unassigned | Aqara | Aqara Hub M3 | 2051 | matter |  | acc4a38ba4cb4997f8ce1533f1d485e3 |
| Aqara Motion Sensor P1 | Unassigned | Aqara | Aqara Motion Sensor P1 |  | matter |  | c9d8d61f1d40653e629c68ceabddf488 |
| Aqara Motion Sensor P1 | Unassigned | Aqara | Aqara Motion Sensor P1 |  | matter |  | 5f9599ebee4bf62fc9fb3038a1819397 |
| Aqara Vibration Sensor | Unassigned | Aqara | Aqara Vibration Sensor |  | matter |  | eaefa575e0142c1b997ad86338a1e36e |
| Aqara Wireless Remote Switch | Unassigned | Aqara | Aqara Wireless Remote Switch |  | matter |  | 50568567cd5b532f7c719f8af20887d5 |
| Aqara Presence Sensor FP1E | Unassigned | Aqara | Aqara Presence Sensor FP1E |  | matter |  | a5cccdcd99030b787285cf002880f130 |
| Aqara Presence Sensor FP1E | Unassigned | Aqara | Aqara Presence Sensor FP1E |  | matter |  | 2668f542fc4a530b359a16f4de5cb7e8 |
| Backup | Unassigned | Home Assistant | Home Assistant Backup |  | backup |  | 3c608d14afaa97bf113a32eef969c850 |
| Bedroom Display | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | c6dca7bee9771780c1d8225014c04fb1 |
| Beta bedroom no presence 3mins | Unassigned | Aqara | Beta bedroom no presence 3mins |  | matter |  | b9219d3d32ad3432d09e71878ad14022 |
| Beta bedroom presence detected | Unassigned | Aqara | Beta bedroom presence detected |  | matter |  | 88018fd32d736c704bff5dc3e6d3973b |
| Bot 4A | Unassigned | SwitchBot | Bot |  | matter |  | e1e44b9e90ff621f67173abf1228ec8f |
| fado glass globe lamp | Unassigned | Signify Netherlands B.V. | Hue color lamp | LCA004 | hue |  | b9139ec0152442d7ffe7ec7119dfec48 |
| Forecast | Unassigned | Met.no | Forecast |  | met |  | 38f2f9e968d284138312ff4dafd8961d |
| hci0 (8C:BD:37:64:26:26) | Unassigned | Shenzhen Phaten Tech. LTD | Unknown |  | bluetooth |  | 939eb0b4c92e782ea3d06053bf6421c5 |
| Hub 3 Button 1 | Unassigned | SwitchBot | Hub 3 |  | matter |  | 5a333ca87d58a8ff878d4618c15a08c6 |
| Hub 3 Button 2 | Unassigned | SwitchBot | Hub 3 |  | matter |  | a94fde18da4f2126110649a104e1dc4e |
| Hub 3 Button 3 | Unassigned | SwitchBot | Hub 3 |  | matter |  | 9beffa7c4c3798840d68b0965a880731 |
| Hub 3 HumiSensor | Unassigned | SwitchBot | Hub 3 |  | matter |  | dd6d6604699f9bcb3f1785f0734ca0c7 |
| Hub 3 MotionSensor | Unassigned | SwitchBot | Hub 3 |  | matter |  | f8bce4a32d0483c8e5998ec525bb9369 |
| Hub 3 TempSensor | Unassigned | SwitchBot | Hub 3 |  | matter |  | 46a08e3c0c4c210971727daa590c917f |
| Hue Play 1 | Unassigned | Signify Netherlands B.V. | Hue Play | 440400982842 | hue |  | d89bf5602e1724bf0b26f43bf6866f40 |
| Hue Play 2 | Unassigned | Signify Netherlands B.V. | Hue Play | 440400982841 | hue |  | e6939abcf85960114033763df1633e2e |
| Hue smart button 2 | Unassigned | Signify Netherlands B.V. | Hue smart button | RDM005 | hue |  | da1dd2355bbec3191d522313064aa97c |
| Hue smart button 3 | Unassigned | Signify Netherlands B.V. | Hue smart button | RDM005 | hue |  | 027c1c392e1914472aebdad116e88d1f |
| Hue smart plug 1 | Unassigned | Signify Netherlands B.V. | Hue smart plug | LOM009 | hue |  | 2c9a65b5226b60f36e9fa994d5db3e92 |
| iPhone 16Pro Max  | Unassigned | Apple | iPhone17,2 |  | mobile_app |  | 4ffe60a6382ee637e98da4868aeca8e1 |
| Jeff’s iPad | Unassigned | Apple | iPad17,1 |  | mobile_app |  | 93101baa2aef650396ea126fd61765af |
| Jeff’s iPhone | Unassigned | Apple | iPhone18,2 |  | mobile_app |  | a2e81a41c2ee0a9e1daec770ead9da75 |
| Loft Display | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | fb3b52c889646a1c8fc6bc77fe30205b |
| MacBook Air  | Unassigned | Apple | Mac15,12 |  | mobile_app |  | 652c8cbed207e4d069bdaa8bdcf93e52 |
| NestHubD029 | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | d2d4396241886122805bf4a3ee0450bf |
| NestHubD029 | Unassigned | Google Inc. | Google Nest Hub |  | cast |  | 6a4f6e0da1c233db98df89c682696867 |
| Nyamane 3-spot Lamp - Top  | Unassigned | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | 543d647ade89fd9e32afd034b4937846 |
| Nymane 3-spot Lamp - Mid | Unassigned | Signify Netherlands B.V. | Hue Essential spot | LCG008 | hue |  | 5c5088969773c38740cbd5f823f58d65 |
| Ola Whitborg XL Floor Lamp | Unassigned | Signify Netherlands B.V. | Hue color lamp | LCA006 | hue |  | 5525c9fb0db1dab203c66826dc6847a0 |
| Presence Dining zone | Unassigned | Aqara | Presence Dining zone |  | matter |  | 57b210076090a8a7602f2c14819c6a71 |
| Presence kitchen zone | Unassigned | Aqara | Presence kitchen zone |  | matter |  | e76350da340adc8f514b17cde07bed88 |
| Presence living zone | Unassigned | Aqara | Presence living zone |  | matter |  | 5347696d7632da6e8853f05ff7706010 |
| Roller Shade 0A | Unassigned | SwitchBot | Roller Shade |  | matter |  | dcd0cddfa4a2499b515bac0840fc7abf |
| Roller Shade 2A | Unassigned | SwitchBot | Roller Shade |  | matter |  | 6364ed40ff74eae0b9ebfaa1bcdefdfa |
| Roller Shade 84 | Unassigned | SwitchBot | Roller Shade |  | matter |  | 264736363a5bf620236a739daa0a1bb0 |
| Serif TV | Unassigned | Unknown manufacturer | LS01D |  | cast |  | cc5249666d50f9cda4fb6b62d3e4e561 |
| Signe gradient table 1 | Unassigned | Signify Netherlands B.V. | Signe gradient table | 915005987001 | hue |  | 81afd7db5465561e20df193ef451d0f4 |
| Sun | Unassigned |  |  |  | sun |  | a2bb6fe6e55358a2fb83fd847f27a746 |
| SwitchBot Hub 3 | Unassigned | SwitchBot | SwitchBot Hub 3 | 2027 | matter |  | 3ba620e83a81087792b346d2b230c289 |
| WiZ A60 Filament | Unassigned | Signify | WiZ A60 Filament | 8722 | matter |  | a21d7792725515ce9008298a03bb798a |
| White HomePod Mini | White HomePod Mini | Apple | HomePod Mini |  | apple_tv |  | dc26045371744833233dc93dc63eb8bd |

## Full Entity List

| Entity ID | Domain | Platform | Device | Device Area | Entity Area | Original Name | Category | Device Class | Unit | Disabled | Hidden |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| binary_sensor.absence_for_3mins_dining_zone_occupancy | binary_sensor | matter | Absence for 3mins dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_dining_zone_occupancy_2 | binary_sensor | matter | Absence for 3mins dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_kitchen_zone_occupancy | binary_sensor | matter | Absence for 3mins kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_kitchen_zone_occupancy_2 | binary_sensor | matter | Absence for 3mins kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_living_zone_occupancy | binary_sensor | matter | Absence for 3mins living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_3mins_living_zone_occupancy_2 | binary_sensor | matter | Absence for 3mins living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_5mins_openplan_occupancy | binary_sensor | matter | Absence for 5mins Openplan |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.absence_for_5mins_openplan_occupancy_2 | binary_sensor | matter | Absence for 5mins Openplan |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.approaching_openplan_room_occupancy | binary_sensor | matter | Approaching Openplan room |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.approaching_openplan_room_occupancy_2 | binary_sensor | matter | Approaching Openplan room |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem_2 | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem_3 | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_curtain_driver_e1_problem_4 | binary_sensor | matter | Aqara Curtain Driver E1 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_10 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_11 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_12 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_13 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_14 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_2 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_3 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_4 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_5 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_6 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_7 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_8 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_door_and_window_sensor_door_9 | binary_sensor | matter | Aqara Door and Window Sensor |  |  | Door |  | door |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy_2 | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy_3 | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_motion_sensor_p1_occupancy_4 | binary_sensor | matter | Aqara Motion Sensor P1 |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy_2 | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy_3 | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_presence_sensor_fp1e_occupancy_4 | binary_sensor | matter | Aqara Presence Sensor FP1E |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_vibration_sensor_occupancy | binary_sensor | matter | Aqara Vibration Sensor |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.aqara_vibration_sensor_occupancy_2 | binary_sensor | matter | Aqara Vibration Sensor |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.bathroom_motion | binary_sensor | hue | Bathroom | My Bathroom |  | Motion |  | motion |  |  |  |
| binary_sensor.beta_bedroom_no_presence_3mins_occupancy | binary_sensor | matter | Beta bedroom no presence 3mins |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.beta_bedroom_no_presence_3mins_occupancy_2 | binary_sensor | matter | Beta bedroom no presence 3mins |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.beta_bedroom_presence_detected_occupancy | binary_sensor | matter | Beta bedroom presence detected |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.beta_bedroom_presence_detected_occupancy_2 | binary_sensor | matter | Beta bedroom presence detected |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.hallway_motionaware_ceiling | binary_sensor | hue | Hallway | Hallway (Pass) |  | Hallway MotionAware Ceiling |  | motion |  |  |  |
| binary_sensor.hub_3_motionsensor_occupancy | binary_sensor | matter | Hub 3 MotionSensor |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.hue_motion_sensor_motion | binary_sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Motion |  | motion |  |  |  |
| binary_sensor.hue_motion_sensor_motion_2 | binary_sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Motion |  | motion |  |  |  |
| binary_sensor.iphone_16pro_max_focus | binary_sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Focus |  |  |  |  |  |
| binary_sensor.macbook_air_active | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active |  |  |  |  |  |
| binary_sensor.macbook_air_audio_input_in_use | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Audio Input In Use |  |  |  |  |  |
| binary_sensor.macbook_air_audio_output_in_use | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Audio Output In Use |  |  |  |  |  |
| binary_sensor.macbook_air_camera_in_use | binary_sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Camera In Use |  |  |  |  |  |
| binary_sensor.presence_dining_zone_occupancy | binary_sensor | matter | Presence Dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_dining_zone_occupancy_2 | binary_sensor | matter | Presence Dining zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_kitchen_zone_occupancy | binary_sensor | matter | Presence kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_kitchen_zone_occupancy_2 | binary_sensor | matter | Presence kitchen zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_living_zone_occupancy | binary_sensor | matter | Presence living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.presence_living_zone_occupancy_2 | binary_sensor | matter | Presence living zone |  |  | Occupancy |  | occupancy |  |  |  |
| binary_sensor.remote_ui | binary_sensor | cloud |  |  |  | Remote UI | diagnostic | connectivity |  |  |  |
| binary_sensor.roller_shade_0a_problem | binary_sensor | matter | Roller Shade 0A |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.roller_shade_2a_problem | binary_sensor | matter | Roller Shade 2A |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.roller_shade_84_problem | binary_sensor | matter | Roller Shade 84 |  |  | Problem | diagnostic | problem |  |  |  |
| binary_sensor.secondary_bathroom_motion | binary_sensor | hue | Secondary Bathroom | Secondary Bathroom |  | Motion |  | motion |  |  |  |
| binary_sensor.sun_solar_rising | binary_sensor | sun | Sun |  |  | Solar rising | diagnostic |  |  | integration |  |
| binary_sensor.withings_in_bed | binary_sensor | withings | Withings | Bedroom (Alpha) |  | In bed |  | occupancy |  |  |  |
| button.absence_for_3mins_dining_zone_identify | button | matter | Absence for 3mins dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_dining_zone_identify_2 | button | matter | Absence for 3mins dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_kitchen_zone_identify | button | matter | Absence for 3mins kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_kitchen_zone_identify_2 | button | matter | Absence for 3mins kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_living_zone_identify | button | matter | Absence for 3mins living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_3mins_living_zone_identify_2 | button | matter | Absence for 3mins living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_5mins_openplan_identify | button | matter | Absence for 5mins Openplan |  |  | Identify | diagnostic | identify |  |  |  |
| button.absence_for_5mins_openplan_identify_2 | button | matter | Absence for 5mins Openplan |  |  | Identify | diagnostic | identify |  |  |  |
| button.approaching_openplan_room_identify | button | matter | Approaching Openplan room |  |  | Identify | diagnostic | identify |  |  |  |
| button.approaching_openplan_room_identify_2 | button | matter | Approaching Openplan room |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify_2 | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify_3 | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_curtain_driver_e1_identify_4 | button | matter | Aqara Curtain Driver E1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_10 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_11 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_12 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_13 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_14 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_2 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_3 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_4 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_5 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_6 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_7 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_8 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_door_and_window_sensor_identify_9 | button | matter | Aqara Door and Window Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_hub_m3_identify | button | matter | Aqara Hub M3 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_hub_m3_identify_2 | button | matter | Aqara Hub M3 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify_2 | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify_3 | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_motion_sensor_p1_identify_4 | button | matter | Aqara Motion Sensor P1 |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify_2 | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify_3 | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_presence_sensor_fp1e_identify_4 | button | matter | Aqara Presence Sensor FP1E |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_vibration_sensor_identify | button | matter | Aqara Vibration Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_vibration_sensor_identify_2 | button | matter | Aqara Vibration Sensor |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify_2 | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify_3 | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.aqara_wireless_remote_switch_identify_4 | button | matter | Aqara Wireless Remote Switch |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_no_presence_3mins_identify | button | matter | Beta bedroom no presence 3mins |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_no_presence_3mins_identify_2 | button | matter | Beta bedroom no presence 3mins |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_presence_detected_identify | button | matter | Beta bedroom presence detected |  |  | Identify | diagnostic | identify |  |  |  |
| button.beta_bedroom_presence_detected_identify_2 | button | matter | Beta bedroom presence detected |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_dining_zone_identify | button | matter | Presence Dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_dining_zone_identify_2 | button | matter | Presence Dining zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_kitchen_zone_identify | button | matter | Presence kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_kitchen_zone_identify_2 | button | matter | Presence kitchen zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_living_zone_identify | button | matter | Presence living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.presence_living_zone_identify_2 | button | matter | Presence living zone |  |  | Identify | diagnostic | identify |  |  |  |
| button.switchbot_hub_3_identify | button | matter | SwitchBot Hub 3 |  |  | Identify | diagnostic | identify |  |  |  |
| button.wiz_a60_filament_identify | button | matter | WiZ A60 Filament |  |  | Identify | diagnostic | identify |  |  |  |
| cover.aqara_curtain_driver_e1 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.aqara_curtain_driver_e1_2 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.aqara_curtain_driver_e1_3 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.aqara_curtain_driver_e1_4 | cover | matter | Aqara Curtain Driver E1 |  |  |  |  | curtain |  |  |  |
| cover.roller_shade_0a | cover | matter | Roller Shade 0A |  |  |  |  | curtain |  |  |  |
| cover.roller_shade_2a | cover | matter | Roller Shade 2A |  |  |  |  | curtain |  |  |  |
| cover.roller_shade_84 | cover | matter | Roller Shade 84 |  |  |  |  | curtain |  |  |  |
| device_tracker.ipad_pro | device_tracker | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad | diagnostic |  |  |  |  |
| device_tracker.iphone_16pro_max | device_tracker | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  | diagnostic |  |  |  |  |
| device_tracker.iphone_17_pro_max | device_tracker | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone | diagnostic |  |  |  |  |
| device_tracker.macbook_air | device_tracker | mobile_app | MacBook Air  |  |  | MacBook Air  | diagnostic |  |  |  |  |
| event.alpha_bedroom_dial_switch_button_1 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 1 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_button_2 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 2 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_button_3 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 3 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_button_4 | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Button 4 |  | button |  |  |  |
| event.alpha_bedroom_dial_switch_rotary | event | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Rotary |  | button |  |  |  |
| event.alpha_hue_smart_button_button_1 | event | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  | Button 1 |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button_2 | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button_3 | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.aqara_wireless_remote_switch_button_4 | event | matter | Aqara Wireless Remote Switch |  |  | Button |  | button |  |  |  |
| event.backup_automatic_backup | event | backup | Backup |  |  | Automatic backup |  |  |  |  |  |
| event.bathroom_dimmer_switch_button_1 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 1 |  | button |  |  |  |
| event.bathroom_dimmer_switch_button_2 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 2 |  | button |  |  |  |
| event.bathroom_dimmer_switch_button_3 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 3 |  | button |  |  |  |
| event.bathroom_dimmer_switch_button_4 | event | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Button 4 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_1 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 1 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_2 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 2 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_3 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 3 |  | button |  |  |  |
| event.core_tap_dial_light_switch_button_4 | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Button 4 |  | button |  |  |  |
| event.core_tap_dial_light_switch_rotary | event | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Rotary |  | button |  |  |  |
| event.hallway_dimmer_switch_button_1 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 1 |  | button |  |  |  |
| event.hallway_dimmer_switch_button_2 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 2 |  | button |  |  |  |
| event.hallway_dimmer_switch_button_3 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 3 |  | button |  |  |  |
| event.hallway_dimmer_switch_button_4 | event | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Button 4 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_1 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 1 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_2 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 2 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_3 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 3 |  | button |  |  |  |
| event.hallway_tap_dial_switch_button_4 | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Button 4 |  | button |  |  |  |
| event.hallway_tap_dial_switch_rotary | event | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Rotary |  | button |  |  |  |
| event.hub_3_button_1_button | event | matter | Hub 3 Button 1 |  |  | Button |  | button |  |  |  |
| event.hub_3_button_2_button | event | matter | Hub 3 Button 2 |  |  | Button |  | button |  |  |  |
| event.hub_3_button_3_button | event | matter | Hub 3 Button 3 |  |  | Button |  | button |  |  |  |
| event.hue_smart_button_2_button_1 | event | hue | Hue smart button 2 |  |  | Button 1 |  | button |  |  |  |
| event.hue_smart_button_3_button_1 | event | hue | Hue smart button 3 |  |  | Button 1 |  | button |  |  |  |
| event.splash_dimmer_switch_button_1 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 1 |  | button |  |  |  |
| event.splash_dimmer_switch_button_2 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 2 |  | button |  |  |  |
| event.splash_dimmer_switch_button_3 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 3 |  | button |  |  |  |
| event.splash_dimmer_switch_button_4 | event | hue | Splash Dimmer Switch | Secondary Bathroom |  | Button 4 |  | button |  |  |  |
| fan.core_300s | fan | vesync | Core 300S | Bedroom |  |  |  |  |  |  |  |
| input_boolean.test_mode | input_boolean | input_boolean |  |  |  | Test Mode |  |  |  |  |  |
| light.all_bedroom_bathroom | light | hue | All Bedroom & Bathroom | Bedroom |  |  |  |  |  |  |  |
| light.alpha_ceiling_light_4 | light | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alpha_ceiling_light_6 | light | hue | Alpha Ceiling Light.6 | Bedroom |  |  |  |  |  |  |  |
| light.alpha_gradient_light_tube_1 | light | hue | alpha gradient light-tube.1 | Bedroom |  |  |  |  |  |  |  |
| light.alphabed_ceiling_light_3 | light | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alphabed_ceiling_light_5 | light | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alphabed_ceiling_light_5_2 | light | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.alphadoor_ceiling_light_6 | light | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) |  | alphadoor ceiling light.6 |  |  |  |  |  |
| light.bathroom | light | hue | Bathroom | My Bathroom |  |  |  |  |  |  |  |
| light.bedroom | light | hue | Bedroom | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.bedroom_ceiling | light | hue | Bedroom Ceiling | Bedroom |  |  |  |  |  |  |  |
| light.bedroom_lamps | light | hue | Bedroom Lamps | Bedroom |  |  |  |  |  |  |  |
| light.beige_ola_spotlight_lamp | light | hue | Beige Ola Spotlight Lamp | Living Room |  |  |  |  |  |  |  |
| light.beta_bed_lightstrip | light | hue | Beta Bed Lightstrip | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_bedroom_bath | light | hue | Beta Bedroom & Bath | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_3 | light | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_3_2 | light | hue | Beta Ceiling Light.3 | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_4 | light | hue | Beta Ceiling Light.4 | Spare Bedroom |  |  |  |  |  |  |  |
| light.beta_ceiling_light_6 | light | hue | Beta Ceiling Light.6 | Spare Bedroom |  |  |  |  |  |  |  |
| light.betaflex_ceiling_light_1 | light | hue | Betaflex Ceiling Light.1 | Spare Bedroom |  | Betaflex Ceiling Light.1 |  |  |  |  |  |
| light.betaflex_ceiling_light_2 | light | hue | Betaflex Ceiling Light.2 | Spare Bedroom |  |  |  |  |  |  |  |
| light.core_ceiling_3 | light | hue | core ceiling.3 | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.core_ceiling_light_1 | light | hue | Core Ceiling Light.1 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_10 | light | hue | Core Ceiling Light.10 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_2 | light | hue | Core Ceiling Light.2 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_4 | light | hue | Core Ceiling Light.4 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_5 | light | hue | Core Ceiling Light.5 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_5_2 | light | hue | Core Ceiling Light.5 | Living Room |  |  |  |  |  |  |  |
| light.core_ceiling_light_6 | light | hue | Core Ceiling Light.6 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_7 | light | hue | Core Ceiling Light.4 | Openplan (Core) |  | Core Ceiling Light.7 |  |  |  |  |  |
| light.core_ceiling_light_8 | light | hue | Core Ceiling Light.8 | Openplan (Core) |  |  |  |  |  |  |  |
| light.core_ceiling_light_9 | light | hue | Core Ceiling Light.9 | Core_kitchen |  |  |  |  |  |  |  |
| light.core_statement_arc_floor_lamp_monica_vibelucci | light | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) |  |  |  |  |  |  |  |
| light.fado_glass_globe_lamp | light | hue | fado glass globe lamp |  |  |  |  |  |  |  |  |
| light.hallway | light | hue | Hallway | Hallway (Pass) |  |  |  |  |  |  |  |
| light.hue_play_1 | light | hue | Hue Play 1 |  |  |  |  |  |  |  |  |
| light.hue_play_2 | light | hue | Hue Play 2 |  |  |  |  |  |  |  |  |
| light.hue_signe_white_gradient_floor_lamp_1 | light | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) |  |  |  |  |  |  |  |
| light.hue_smart_plug_1 | light | hue | Hue smart plug 1 |  |  |  |  |  |  |  |  |
| light.ikea_skytrax_light | light | hue | Ikea Skytrax Light | Bedroom |  |  |  |  |  |  |  |
| light.kitchen | light | hue | Kitchen | Core_kitchen |  |  |  |  |  |  |  |
| light.kitchen_ceiling | light | hue | Kitchen Ceiling | Core_kitchen |  |  |  |  |  |  |  |
| light.klasnick_beige_table_lamp_with_e14_hue_colour | light | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) |  |  |  |  |  |  |  |
| light.laundry_chaos_ceiling_light | light | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities |  |  |  |  |  |  |  |
| light.laundry_room | light | hue | Laundry room | Laundry room |  |  |  |  |  |  |  |
| light.living_room | light | hue | Living room | Living Room |  |  |  |  |  |  |  |
| light.living_room_ceiling | light | hue | Core Living Ceiling | Living Room |  |  |  |  |  |  |  |
| light.living_room_lamps | light | hue | Living room lamps | Living Room |  |  |  |  |  |  |  |
| light.nyamane_3_spot_lamp_top | light | hue | Nyamane 3-spot Lamp - Top  |  |  |  |  |  |  |  |  |
| light.nymane_3_spot_lamp_low | light | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) |  |  |  |  |  |  |  |
| light.nymane_3_spot_lamp_mid | light | hue | Nymane 3-spot Lamp - Mid |  |  |  |  |  |  |  |  |
| light.ola_whitborg_xl_floor_lamp | light | hue | Ola Whitborg XL Floor Lamp |  |  |  |  |  |  |  |  |
| light.pass_ceiling_light_1 | light | hue | Pass Ceiling Light.1 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_1_2 | light | hue | Pass Ceiling Light.1  | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_2 | light | hue | Pass Ceiling Light.2 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_4 | light | hue | Pass Ceiling Light.4 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.pass_ceiling_light_5 | light | hue | Pass Ceiling Light.5 | Hallway (Pass) |  |  |  |  |  |  |  |
| light.right_bedside_lamp | light | hue | Right Bedside Lamp | Bedroom |  |  |  |  |  |  |  |
| light.secondary_bathroom | light | hue | Secondary Bathroom | Secondary Bathroom |  |  |  |  |  |  |  |
| light.signe_gradient_floor_1 | light | hue | Signe gradient floor 1 | Openplan (Core) |  |  |  |  |  |  |  |
| light.signe_gradient_table_1 | light | hue | Signe gradient table 1 |  |  |  |  |  |  |  |  |
| light.spare_bedroom | light | hue | Spare Bedroom | Spare Bedroom |  |  |  |  |  |  |  |
| light.spare_bedroom_ceiling | light | hue | Spare Bedroom Ceiling | Spare Bedroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_1 | light | hue | Splash Ceiling Light.1 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_2 | light | hue | Splash Ceiling Light.2 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_3 | light | hue | Splash Ceiling Light.3 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_4 | light | hue | Splash Ceiling Light.4 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.splash_ceiling_light_5 | light | hue | Splash Ceiling Light.5 | Secondary Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_2 | light | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_3 | light | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_3_2 | light | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.throne_ceiling_light_4 | light | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom |  |  |  |  |  |  |  |
| light.white_e27_hue_bulb | light | hue | White (E27) Hue Bulb | Laundry/Utilities |  |  |  |  |  |  |  |
| light.wiz_a60_filament | light | matter | WiZ A60 Filament |  |  |  |  |  |  |  |  |
| media_player.bedroom_apple_tv | media_player | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  |  |  |  |  |  |
| media_player.bedroom_display | media_player | cast | Bedroom Display |  |  |  |  |  |  |  |  |
| media_player.core_lounge_homepod | media_player | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| media_player.core_lounge_homepod_2 | media_player | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| media_player.living_room_2 | media_player | apple_tv | Living Room (2) | Living Room (2) |  |  |  |  |  |  |  |
| media_player.lounge_apple_tv_wired | media_player | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  |  |  |  |  |  |
| media_player.nesthubd029 | media_player | cast | NestHubD029 |  |  |  |  |  |  |  |  |
| media_player.nesthubd029_2 | media_player | cast | Loft Display |  |  |  |  |  |  |  |  |
| media_player.nesthubd029_3 | media_player | cast | NestHubD029 |  |  |  |  |  |  |  |  |
| media_player.orange_homepod_mini | media_player | apple_tv | Orange HomePod Mini | Bedroom |  |  |  |  |  |  |  |
| media_player.serif_tv | media_player | cast | Serif TV |  |  |  |  |  |  |  |  |
| media_player.white_homepod_mini | media_player | apple_tv | White HomePod Mini | White HomePod Mini |  |  |  |  |  |  |  |
| number.wiz_a60_filament_off_transition_time | number | matter | WiZ A60 Filament |  |  | Off transition time | config |  | s |  |  |
| number.wiz_a60_filament_on_level | number | matter | WiZ A60 Filament |  |  | On level | config |  |  |  |  |
| number.wiz_a60_filament_on_off_transition_time | number | matter | WiZ A60 Filament |  |  | On/off transition time | config |  | s |  |  |
| number.wiz_a60_filament_on_transition_time | number | matter | WiZ A60 Filament |  |  | On transition time | config |  | s |  |  |
| person.jeffffff | person | person |  |  |  | Jeff |  |  |  |  |  |
| remote.bedroom_apple_tv | remote | apple_tv | Bedroom Apple TV | Spare Bedroom |  |  |  |  |  |  |  |
| remote.core_lounge_homepod | remote | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| remote.core_lounge_homepod_2 | remote | apple_tv | Core Lounge HomePod | Living Room |  |  |  |  |  |  |  |
| remote.living_room_2 | remote | apple_tv | Living Room (2) | Living Room (2) |  |  |  |  |  |  |  |
| remote.lounge_apple_tv_wired | remote | apple_tv | Lounge Apple TV (WIred) | Living Room |  |  |  |  |  |  |  |
| remote.orange_homepod_mini | remote | apple_tv | Orange HomePod Mini | Bedroom |  |  |  |  |  |  |  |
| remote.white_homepod_mini | remote | apple_tv | White HomePod Mini | White HomePod Mini |  |  |  |  |  |  |  |
| scene.bedroom_concentrate | scene | hue | Bedroom | Bedroom (Alpha) |  | Concentrate |  |  |  |  |  |
| scene.bedroom_dimmed | scene | hue | Bedroom | Bedroom (Alpha) |  | Dimmed |  |  |  |  |  |
| scene.bedroom_energise | scene | hue | Bedroom | Bedroom (Alpha) |  | Energise |  |  |  |  |  |
| scene.bedroom_nightlight | scene | hue | Bedroom | Bedroom (Alpha) |  | Nightlight |  |  |  |  |  |
| scene.bedroom_read | scene | hue | Bedroom | Bedroom (Alpha) |  | Read |  |  |  |  |  |
| scene.bedroom_relax | scene | hue | Bedroom | Bedroom (Alpha) |  | Relax |  |  |  |  |  |
| scene.bedroom_sleepy | scene | hue | Bedroom | Bedroom (Alpha) |  | Sleepy |  |  |  |  |  |
| scene.hallway_concentrate | scene | hue | Hallway | Hallway (Pass) |  | Concentrate |  |  |  |  |  |
| scene.hallway_energise | scene | hue | Hallway | Hallway (Pass) |  | Energise |  |  |  |  |  |
| scene.hallway_nightlight | scene | hue | Hallway | Hallway (Pass) |  | Nightlight |  |  |  |  |  |
| scene.hallway_read | scene | hue | Hallway | Hallway (Pass) |  | Read |  |  |  |  |  |
| scene.hallway_relax | scene | hue | Hallway | Hallway (Pass) |  | Relax |  |  |  |  |  |
| scene.new_scene | scene | homeassistant |  |  |  | New scene |  |  |  |  |  |
| select.wiz_a60_filament_power_on_behaviour_on_startup | select | matter | WiZ A60 Filament |  |  | Power-on behaviour on startup | config |  |  |  |  |
| sensor.alpha_bed_zone_ceiling_2_zigbee_connectivity | sensor | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.alpha_bedroom_dial_switch_battery | sensor | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Battery | diagnostic | battery | % |  |  |
| sensor.alpha_bedroom_dial_switch_zigbee_connectivity | sensor | hue | Alpha Bedroom Dial Switch | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.alpha_bedroom_hue_smart_button_zigbee_connectivity | sensor | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.alpha_hue_smart_button_battery | sensor | hue | Alpha Hue Smart Button | Bedroom (Alpha) |  | Battery | diagnostic | battery | % |  |  |
| sensor.alpha_pass_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.5 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.aqara_curtain_driver_e1_battery | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_charge_state_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery charge state | diagnostic | enum |  |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_battery_voltage_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_curtain_driver_e1_target_opening_position | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_curtain_driver_e1_target_opening_position_2 | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_curtain_driver_e1_target_opening_position_3 | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_curtain_driver_e1_target_opening_position_4 | sensor | matter | Aqara Curtain Driver E1 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.aqara_door_and_window_sensor_battery | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_10 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_11 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_12 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_13 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_14 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_2 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_3 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_4 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_5 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_6 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_7 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_8 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_9 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_door_and_window_sensor_battery_type | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_10 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_11 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_12 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_13 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_14 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_2 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_3 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_4 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_5 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_6 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_7 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_8 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_type_9 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_10 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_11 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_12 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_13 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_14 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_2 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_3 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_4 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_5 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_6 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_7 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_8 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_door_and_window_sensor_battery_voltage_9 | sensor | matter | Aqara Door and Window Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_2 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_3 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_4 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_motion_sensor_p1_battery_type | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_type_2 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_type_3 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_type_4 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage_2 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage_3 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_motion_sensor_p1_battery_voltage_4 | sensor | matter | Aqara Motion Sensor P1 |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_vibration_sensor_battery | sensor | matter | Aqara Vibration Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_vibration_sensor_battery_2 | sensor | matter | Aqara Vibration Sensor |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_vibration_sensor_battery_type | sensor | matter | Aqara Vibration Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_vibration_sensor_battery_type_2 | sensor | matter | Aqara Vibration Sensor |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_vibration_sensor_battery_voltage | sensor | matter | Aqara Vibration Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_vibration_sensor_battery_voltage_2 | sensor | matter | Aqara Vibration Sensor |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_wireless_remote_switch_battery | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_wireless_remote_switch_battery_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.aqara_wireless_remote_switch_battery_type | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_wireless_remote_switch_battery_type_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery type | diagnostic |  |  |  |  |
| sensor.aqara_wireless_remote_switch_battery_voltage | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_wireless_remote_switch_battery_voltage_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Battery voltage | diagnostic | voltage | V |  |  |
| sensor.aqara_wireless_remote_switch_current_switch_position | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.aqara_wireless_remote_switch_current_switch_position_2 | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.aqara_wireless_remote_switch_current_switch_position_3 | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.aqara_wireless_remote_switch_current_switch_position_4 | sensor | matter | Aqara Wireless Remote Switch |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.backup_backup_manager_state | sensor | backup | Backup |  |  | Backup Manager state |  | enum |  |  |  |
| sensor.backup_last_attempted_automatic_backup | sensor | backup | Backup |  |  | Last attempted automatic backup |  | timestamp |  |  |  |
| sensor.backup_last_successful_automatic_backup | sensor | backup | Backup |  |  | Last successful automatic backup |  | timestamp |  |  |  |
| sensor.backup_next_scheduled_automatic_backup | sensor | backup | Backup |  |  | Next scheduled automatic backup |  | timestamp |  |  |  |
| sensor.bathroom2_hue_motion_sensor_zigbee_connectivity | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.bathroom_dimmer_switch_battery | sensor | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.bathroom_illuminance | sensor | hue | Bathroom | My Bathroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.bed1_zigbee_connectivity | sensor | hue | Alphabed Ceiling Light.5 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.bed3_zigbee_connectivity | sensor | hue | Alphabed Ceiling Light.3 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beige_ola_spotlight_lamp_zigbee_connectivity | sensor | hue | Beige Ola Spotlight Lamp | Living Room |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_bed_lightstrip_zigbee_connectivity | sensor | hue | Beta Bed Lightstrip | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_bedroom_hue_dial_switch_zigbee_connectivity | sensor | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_3_zigbee_connectivity | sensor | hue | Beta Ceiling Light.3 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_4_zigbee_connectivity | sensor | hue | Beta Ceiling Light.4 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_6_zigbee_connectivity | sensor | hue | Beta Ceiling Light.6 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_ceiling_light_zigbee_connectivity | sensor | hue | Beta Ceiling Light.3 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_flex_ceiling_light_1_zigbee_connectivity | sensor | hue | Betaflex Ceiling Light.1 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_flex_ceiling_light_2_zigbee_connectivity | sensor | hue | Betaflex Ceiling Light.2 | Spare Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.beta_pass_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.1  | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.betaflex_lower_shelf_zigbee_connectivity | sensor | hue | Ikea Skytrax Light | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.bot_4a_battery | sensor | matter | Bot 4A |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.ceiling_bedroom1_bed4_zigbee_connectivity | sensor | hue | Alpha Ceiling Light.4 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_bedroom1_closet_zone_zigbee_connectivity | sensor | hue | core ceiling.3 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_bedroom1_door_zone_zigbee_connectivity | sensor | hue | Alpha Ceiling Light.6 | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity | sensor | hue | Throne Ceiling above sink | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity_2 | sensor | hue | Throne Ceiling above Door | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity_3 | sensor | hue | Throne Ceiling above shower door | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_ensuite_bathroom_zigbee_connectivity_4 | sensor | hue | Throne Ceiling Light.3 | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_kitchen_fridge_zigbee_connectivity | sensor | hue | Core Ceiling Light.9 | Core_kitchen |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_kitchen_sink_zigbee_connectivity | sensor | hue | Core Ceiling Light.10 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_br_zigbee_connectivity | sensor | hue | Core Ceiling Light.8 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_north_wall_zone_a1b_zigbee_connectivity | sensor | hue | Core Ceiling Light.1 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_north_wall_zone_zigbee_connectivity | sensor | hue | Core Ceiling Light.2 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_op_south_zigbee_connectivity | sensor | hue | Core Ceiling Light.5 | Living Room |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_east_zigbee_connectivity | sensor | hue | Core Ceiling Light.5 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_mm_zigbee_connectivity | sensor | hue | Core Ceiling Light.6 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_mr_zigbee_connectivity | sensor | hue | Core Ceiling Light.4 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.ceiling_open_plan_se_zigbee_connectivity | sensor | hue | Core Ceiling Light.4 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.chaos_laundry_ceiling_zigbee_connectivity | sensor | hue | Laundry (Chaos) Ceiling Light | Laundry/Utilities |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.chaos_storage_ceiling_zigbee_connectivity | sensor | hue | White (E27) Hue Bulb | Laundry/Utilities |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.chaos_vault_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.1 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.core_300s_air_quality | sensor | vesync | Core 300S | Bedroom |  | Air quality |  |  |  |  |  |
| sensor.core_300s_filter_lifetime | sensor | vesync | Core 300S | Bedroom |  | Filter lifetime | diagnostic |  | % |  |  |
| sensor.core_300s_pm2_5 | sensor | vesync | Core 300S | Bedroom |  | PM2.5 |  | pm25 | μg/m³ |  |  |
| sensor.core_hue_tap_dial_switch_zigbee_connectivity | sensor | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.core_signe_floor_lamp_zigbee_connectivity | sensor | hue | Hue Signe White Gradient Floor Lamp.1 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.core_tap_dial_light_switch_battery | sensor | hue | Core Tap Dial Light Switch | Openplan (Core) |  | Battery | diagnostic | battery | % |  |  |
| sensor.core_vault_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.4 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hallway_dimmer_switch_battery | sensor | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Battery | diagnostic | battery | % |  |  |
| sensor.hallway_tap_dial_switch_battery | sensor | hue | Hallway Tap Dial Switch | Spare Bedroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.hub_3_button_1_current_switch_position | sensor | matter | Hub 3 Button 1 |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.hub_3_button_2_current_switch_position | sensor | matter | Hub 3 Button 2 |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.hub_3_button_3_current_switch_position | sensor | matter | Hub 3 Button 3 |  |  | Current switch position | diagnostic |  |  | integration |  |
| sensor.hub_3_humisensor_humidity | sensor | matter | Hub 3 HumiSensor |  |  | Humidity |  | humidity | % |  |  |
| sensor.hub_3_tempsensor_temperature | sensor | matter | Hub 3 TempSensor |  |  | Temperature |  | temperature | °C |  |  |
| sensor.hue_bridge_pro_zigbee_connectivity | sensor | hue | Hue Bridge Pro | Laundry/Utilities |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_color_candle_1_zigbee_connectivity | sensor | hue | Right Bedside Lamp | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_color_lamp_1_zigbee_connectivity | sensor | hue | Ola Whitborg XL Floor Lamp |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_color_lamp_1_zigbee_connectivity_2 | sensor | hue | fado glass globe lamp |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_dimmer_switch_4_zigbee_connectivity | sensor | hue | Hallway Dimmer Switch | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_essential_spot_1_zigbee_connectivity | sensor | hue | Nymane 3-spot Lamp - Mid |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_essential_spot_2_zigbee_connectivity | sensor | hue | Alpha Ceiling Light.6 | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_essential_spot_3_zigbee_connectivity | sensor | hue | Nyamane 3-spot Lamp - Top  |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_motion_sensor_battery | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_motion_sensor_battery_2 | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_motion_sensor_illuminance | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.hue_motion_sensor_illuminance_2 | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.hue_motion_sensor_temperature | sensor | hue | Hue Motion Sensor | Spare Bedroom |  | Temperature |  | temperature | °C |  |  |
| sensor.hue_motion_sensor_temperature_2 | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Temperature |  | temperature | °C |  |  |
| sensor.hue_play_1_zigbee_connectivity | sensor | hue | Hue Play 1 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_play_2_zigbee_connectivity | sensor | hue | Hue Play 2 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_smart_button_2_battery | sensor | hue | Hue smart button 2 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_smart_button_2_zigbee_connectivity | sensor | hue | Hue smart button 2 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_smart_button_3_battery | sensor | hue | Hue smart button 3 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.hue_smart_button_3_zigbee_connectivity | sensor | hue | Hue smart button 3 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.hue_smart_plug_1_zigbee_connectivity | sensor | hue | Hue smart plug 1 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.iphone_16pro_max_activity | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Activity |  |  |  |  |  |
| sensor.iphone_16pro_max_app_version | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  App Version | diagnostic |  |  |  |  |
| sensor.iphone_16pro_max_audio_output | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Audio Output |  |  |  |  |  |
| sensor.iphone_16pro_max_average_active_pace | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Average Active Pace |  |  |  |  |  |
| sensor.iphone_16pro_max_battery_level | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Battery Level |  | battery | % |  |  |
| sensor.iphone_16pro_max_battery_state | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Battery State |  |  |  |  |  |
| sensor.iphone_16pro_max_bssid | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  BSSID |  |  |  |  |  |
| sensor.iphone_16pro_max_connection_type | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Connection Type |  |  |  |  |  |
| sensor.iphone_16pro_max_distance | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Distance |  |  |  |  |  |
| sensor.iphone_16pro_max_floors_ascended | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Floors Ascended |  |  |  |  |  |
| sensor.iphone_16pro_max_floors_descended | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Floors Descended |  |  |  |  |  |
| sensor.iphone_16pro_max_geocoded_location | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Geocoded Location |  |  |  |  |  |
| sensor.iphone_16pro_max_last_update_trigger | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Last Update Trigger |  |  |  |  |  |
| sensor.iphone_16pro_max_location_permission | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Location permission |  |  |  |  |  |
| sensor.iphone_16pro_max_sim_1 | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  SIM 1 |  |  |  |  |  |
| sensor.iphone_16pro_max_sim_2 | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  SIM 2 |  |  |  |  |  |
| sensor.iphone_16pro_max_ssid | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  SSID |  |  |  |  |  |
| sensor.iphone_16pro_max_steps | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Steps |  |  |  |  |  |
| sensor.iphone_16pro_max_storage | sensor | mobile_app | iPhone 16Pro Max  |  |  | iPhone 16Pro Max  Storage |  |  |  |  |  |
| sensor.jeffs_ipad_app_version | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad App Version | diagnostic |  |  |  |  |
| sensor.jeffs_ipad_audio_output | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Audio Output |  |  |  |  |  |
| sensor.jeffs_ipad_battery_level | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Battery Level |  | battery | % |  |  |
| sensor.jeffs_ipad_battery_state | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Battery State |  |  |  |  |  |
| sensor.jeffs_ipad_bssid | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad BSSID |  |  |  |  |  |
| sensor.jeffs_ipad_connection_type | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Connection Type |  |  |  |  |  |
| sensor.jeffs_ipad_geocoded_location | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Geocoded Location |  |  |  |  |  |
| sensor.jeffs_ipad_last_update_trigger | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Last Update Trigger |  |  |  |  |  |
| sensor.jeffs_ipad_location_permission | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Location permission |  |  |  |  |  |
| sensor.jeffs_ipad_ssid | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad SSID |  |  |  |  |  |
| sensor.jeffs_ipad_storage | sensor | mobile_app | Jeff’s iPad |  |  | Jeff’s iPad Storage |  |  | % available |  |  |
| sensor.jeffs_iphone_app_version | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone App Version | diagnostic |  |  |  |  |
| sensor.jeffs_iphone_audio_output | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Audio Output |  |  |  |  |  |
| sensor.jeffs_iphone_battery_level | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Battery Level |  | battery | % |  |  |
| sensor.jeffs_iphone_battery_state | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Battery State |  |  |  |  |  |
| sensor.jeffs_iphone_bssid | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone BSSID |  |  |  |  |  |
| sensor.jeffs_iphone_connection_type | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Connection Type |  |  |  |  |  |
| sensor.jeffs_iphone_geocoded_location | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Geocoded Location |  |  |  |  |  |
| sensor.jeffs_iphone_last_update_trigger | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Last Update Trigger |  |  |  |  |  |
| sensor.jeffs_iphone_location_permission | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Location permission |  |  |  |  |  |
| sensor.jeffs_iphone_sim_1 | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone SIM 1 |  |  |  |  |  |
| sensor.jeffs_iphone_sim_2 | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone SIM 2 |  |  |  |  |  |
| sensor.jeffs_iphone_ssid | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone SSID |  |  |  |  |  |
| sensor.jeffs_iphone_storage | sensor | mobile_app | Jeff’s iPhone |  |  | Jeff’s iPhone Storage |  |  |  |  |  |
| sensor.klasnick_beige_table_lamp_zigbee_connectivity | sensor | hue | Klasnick Beige Table Lamp (with E14 Hue Colour) | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.macbook_air_active_audio_input | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active Audio Input |  |  |  |  |  |
| sensor.macbook_air_active_audio_output | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active Audio Output |  |  |  |  |  |
| sensor.macbook_air_active_camera | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Active Camera |  |  |  |  |  |
| sensor.macbook_air_app_version | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  App Version | diagnostic |  |  |  |  |
| sensor.macbook_air_audio_output | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Audio Output |  |  |  |  |  |
| sensor.macbook_air_bssid | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  BSSID |  |  |  |  |  |
| sensor.macbook_air_connection_type | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Connection Type |  |  |  |  |  |
| sensor.macbook_air_displays | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Displays |  |  |  |  |  |
| sensor.macbook_air_frontmost_app | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Frontmost App |  |  |  |  |  |
| sensor.macbook_air_geocoded_location | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Geocoded Location |  |  |  |  |  |
| sensor.macbook_air_internal_battery_level | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Internal Battery Level |  |  |  |  |  |
| sensor.macbook_air_internal_battery_state | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Internal Battery State |  |  |  |  |  |
| sensor.macbook_air_last_update_trigger | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Last Update Trigger |  |  |  |  |  |
| sensor.macbook_air_location_permission | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Location permission |  |  |  |  |  |
| sensor.macbook_air_primary_display_id | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Primary Display ID |  |  |  |  |  |
| sensor.macbook_air_primary_display_name | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Primary Display Name |  |  |  |  |  |
| sensor.macbook_air_ssid | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  SSID |  |  |  |  |  |
| sensor.macbook_air_storage | sensor | mobile_app | MacBook Air  |  |  | MacBook Air  Storage |  |  |  |  |  |
| sensor.monica_vibelucci_arc_lamp_zigbee_connectivity | sensor | hue | Core Statement Arc Floor Lamp Monica Vibelucci | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.nymane_3_spot_lamp_low_zigbee_connectivity | sensor | hue | Nymane 3-spot Lamp - Low | Bedroom (Alpha) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.play_gradient_tube_1_zigbee_connectivity | sensor | hue | alpha gradient light-tube.1 | Bedroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.roller_shade_0a_battery | sensor | matter | Roller Shade 0A |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.roller_shade_0a_target_opening_position | sensor | matter | Roller Shade 0A |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.roller_shade_2a_battery | sensor | matter | Roller Shade 2A |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.roller_shade_2a_target_opening_position | sensor | matter | Roller Shade 2A |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.roller_shade_84_battery | sensor | matter | Roller Shade 84 |  |  | Battery | diagnostic | battery | % |  |  |
| sensor.roller_shade_84_target_opening_position | sensor | matter | Roller Shade 84 |  |  | Target opening position | diagnostic |  | % | integration |  |
| sensor.secondary_bathroom_illuminance | sensor | hue | Secondary Bathroom | Secondary Bathroom |  | Illuminance |  | illuminance | lx |  |  |
| sensor.signe_gradient_floor_1_zigbee_connectivity | sensor | hue | Signe gradient floor 1 | Openplan (Core) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.signe_gradient_table_1_zigbee_connectivity | sensor | hue | Signe gradient table 1 |  |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.speedtest_download | sensor | speedtestdotnet | SpeedTest | Parking |  | Download |  | data_rate | Mbit/s |  |  |
| sensor.speedtest_ping | sensor | speedtestdotnet | SpeedTest | Parking |  | Ping |  | duration | ms |  |  |
| sensor.speedtest_upload | sensor | speedtestdotnet | SpeedTest | Parking |  | Upload |  | data_rate | Mbit/s |  |  |
| sensor.splash_bathroom_dimmer_zigbee_connectivity | sensor | hue | Splash Dimmer Switch | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_1_zigbee_connectivity | sensor | hue | Splash Ceiling Light.4 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_2_zigbee_connectivity | sensor | hue | Splash Ceiling Light.1 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_3_zigbee_connectivity | sensor | hue | Splash Ceiling Light.2 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_4_zigbee_connectivity | sensor | hue | Splash Ceiling Light.5 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_ceiling_light_5_zigbee_connectivity | sensor | hue | Splash Ceiling Light.3 | Secondary Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.splash_dimmer_switch_battery | sensor | hue | Splash Dimmer Switch | Secondary Bathroom |  | Battery | diagnostic | battery | % |  |  |
| sensor.splash_pass_ceiling_zigbee_connectivity | sensor | hue | Pass Ceiling Light.2 | Hallway (Pass) |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.sun_next_dawn | sensor | sun | Sun |  |  | Next dawn | diagnostic | timestamp |  |  |  |
| sensor.sun_next_dusk | sensor | sun | Sun |  |  | Next dusk | diagnostic | timestamp |  |  |  |
| sensor.sun_next_midnight | sensor | sun | Sun |  |  | Next midnight | diagnostic | timestamp |  |  |  |
| sensor.sun_next_noon | sensor | sun | Sun |  |  | Next noon | diagnostic | timestamp |  |  |  |
| sensor.sun_next_rising | sensor | sun | Sun |  |  | Next rising | diagnostic | timestamp |  |  |  |
| sensor.sun_next_setting | sensor | sun | Sun |  |  | Next setting | diagnostic | timestamp |  |  |  |
| sensor.sun_solar_azimuth | sensor | sun | Sun |  |  | Solar azimuth | diagnostic |  | ° | integration |  |
| sensor.sun_solar_elevation | sensor | sun | Sun |  |  | Solar elevation | diagnostic |  | ° | integration |  |
| sensor.sun_solar_rising | sensor | sun | Sun |  |  | Solar rising | diagnostic |  |  | integration |  |
| sensor.throne_bathroom_ceiling_zigbee_connectivity | sensor | hue | Bathroom dimmer switch | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.throne_hue_motion_sensor_zigbee_connectivity | sensor | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Zigbee connectivity | diagnostic | enum |  | integration |  |
| sensor.withings_active_calories_burnt_today | sensor | withings | Withings | Bedroom (Alpha) |  | Active calories burnt today |  |  | calories | user |  |
| sensor.withings_active_time_today | sensor | withings | Withings | Bedroom (Alpha) |  | Active time today |  | duration | h | user |  |
| sensor.withings_average_heart_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Average heart rate |  |  | bpm | integration |  |
| sensor.withings_average_respiratory_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Average respiratory rate |  |  | br/min | integration |  |
| sensor.withings_breathing_disturbances_intensity | sensor | withings | Withings | Bedroom (Alpha) |  | Breathing disturbances intensity |  |  |  | integration |  |
| sensor.withings_deep_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | Deep sleep |  | duration | h |  |  |
| sensor.withings_distance_travelled_today | sensor | withings | Withings | Bedroom (Alpha) |  | Distance travelled today |  | distance | m | user |  |
| sensor.withings_elevation_change_today | sensor | withings | Withings | Bedroom (Alpha) |  | Elevation change today |  | distance | m | user |  |
| sensor.withings_intense_activity_today | sensor | withings | Withings | Bedroom (Alpha) |  | Intense activity today |  | duration | min | integration |  |
| sensor.withings_light_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | Light sleep |  | duration | h |  |  |
| sensor.withings_maximum_heart_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Maximum heart rate |  |  | bpm |  |  |
| sensor.withings_maximum_respiratory_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Maximum respiratory rate |  |  | br/min | integration |  |
| sensor.withings_minimum_heart_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Minimum heart rate |  |  | bpm | integration |  |
| sensor.withings_minimum_respiratory_rate | sensor | withings | Withings | Bedroom (Alpha) |  | Minimum respiratory rate |  |  | br/min | integration |  |
| sensor.withings_moderate_activity_today | sensor | withings | Withings | Bedroom (Alpha) |  | Moderate activity today |  | duration | min | integration |  |
| sensor.withings_rem_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | REM sleep |  | duration | h |  |  |
| sensor.withings_sleep_score | sensor | withings | Withings | Bedroom (Alpha) |  | Sleep score |  |  | points |  |  |
| sensor.withings_snoring | sensor | withings | Withings | Bedroom (Alpha) |  | Snoring |  | duration | min |  |  |
| sensor.withings_snoring_episode_count | sensor | withings | Withings | Bedroom (Alpha) |  | Snoring episode count |  |  |  | integration |  |
| sensor.withings_soft_activity_today | sensor | withings | Withings | Bedroom (Alpha) |  | Soft activity today |  | duration | min | integration |  |
| sensor.withings_steps_today | sensor | withings | Withings | Bedroom (Alpha) |  | Steps today |  |  | steps | user |  |
| sensor.withings_time_to_sleep | sensor | withings | Withings | Bedroom (Alpha) |  | Time to sleep |  | duration | h |  |  |
| sensor.withings_time_to_wakeup | sensor | withings | Withings | Bedroom (Alpha) |  | Time to wakeup |  | duration | h |  |  |
| sensor.withings_total_calories_burnt_today | sensor | withings | Withings | Bedroom (Alpha) |  | Total calories burnt today |  |  | calories | user |  |
| sensor.withings_wakeup_count | sensor | withings | Withings | Bedroom (Alpha) |  | Wakeup count |  |  | times |  |  |
| sensor.withings_wakeup_time | sensor | withings | Withings | Bedroom (Alpha) |  | Wakeup time |  | duration | h |  |  |
| stt.home_assistant_cloud | stt | cloud |  |  |  | Home Assistant Cloud |  |  |  |  |  |
| switch.automation_alpha_bedroom_dial_switch | switch | hue | Hue Bridge Pro | Laundry/Utilities |  | Automation: Alpha Bedroom Dial Switch | config | switch |  |  |  |
| switch.automation_hue_smart_button_3 | switch | hue | Hue Bridge Pro | Laundry/Utilities |  | Automation: Hue smart button 3 | config | switch |  |  |  |
| switch.bot_4a | switch | matter | Bot 4A |  |  |  |  | outlet |  |  |  |
| switch.core_300s_child_lock | switch | vesync | Core 300S | Bedroom |  | Child lock |  |  |  |  |  |
| switch.core_300s_display | switch | vesync | Core 300S | Bedroom |  | Display |  |  |  |  |  |
| switch.hue_motion_sensor_light_sensor_enabled | switch | hue | Hue Motion Sensor | Spare Bedroom |  | Light sensor enabled | config | switch |  |  |  |
| switch.hue_motion_sensor_light_sensor_enabled_2 | switch | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Light sensor enabled | config | switch |  |  |  |
| switch.hue_motion_sensor_motion_sensor_enabled | switch | hue | Hue Motion Sensor | Spare Bedroom |  | Motion sensor enabled | config | switch |  |  |  |
| switch.hue_motion_sensor_motion_sensor_enabled_2 | switch | hue | Hue Motion Sensor | Ensuite (Throne) Bathroom |  | Motion sensor enabled | config | switch |  |  |  |
| todo.shopping_list | todo | shopping_list |  |  |  | Shopping List |  |  |  |  |  |
| tts.google_translate_en_com | tts | google_translate |  |  |  | Google Translate en com |  |  |  |  |  |
| tts.home_assistant_cloud | tts | cloud |  |  |  | Home Assistant Cloud |  |  |  |  |  |
| update.core_300s_firmware | update | vesync | Core 300S | Bedroom |  | Firmware | diagnostic | firmware |  |  |  |
| weather.forecast_home | weather | met | Forecast |  |  | Home |  |  |  |  |  |

## Labels

| Name | ID | Color | Description |
| --- | --- | --- | --- |
| Alpha-pass | alpha_pass |  |  |
| Beta Bedroom | beta_bedroom |  |  |
| Core | core | amber |  |
| Core - Kitchen | core_kitchen |  |  |
| Core- Living | core_living |  |  |


## YAML / Config Surface

### YAML Files
```text
/srv/homeassistant/config/automations.yaml
/srv/homeassistant/config/blueprints/automation/Blackshome/sensor-light.yaml
/srv/homeassistant/config/blueprints/automation/follow_me/room_follow_me_atmosphere.yaml
/srv/homeassistant/config/blueprints/automation/homeassistant/motion_light.yaml
/srv/homeassistant/config/blueprints/automation/homeassistant/notify_leaving_zone.yaml
/srv/homeassistant/config/blueprints/script/homeassistant/confirmable_notification.yaml
/srv/homeassistant/config/configuration.yaml
/srv/homeassistant/config/packages/.example.yaml
/srv/homeassistant/config/packages/test_mode.yaml
/srv/homeassistant/config/scenes.yaml
/srv/homeassistant/config/scripts.yaml
/srv/homeassistant/config/secrets.yaml
```

### Line Counts
```text
  20 /srv/homeassistant/config/configuration.yaml
   1 /srv/homeassistant/config/automations.yaml
   0 /srv/homeassistant/config/scripts.yaml
  18 /srv/homeassistant/config/scenes.yaml
  15 /srv/homeassistant/config/packages/test_mode.yaml
  54 total
```

### Package Directories
```text
/srv/homeassistant/config/packages
/srv/homeassistant/config/packages/gpt_automations
```

## Runtime Containers

```text
homeassistantz	ghcr.io/home-assistant/home-assistant:stable	Up 16 hours	
matter-server	ghcr.io/home-assistant-libs/python-matter-server:stable	Up 16 hours	
nodered	nodered/node-red:latest	Up 16 hours (healthy)	0.0.0.0:1880->1880/tcp, [::]:1880->1880/tcp
mosquitto	eclipse-mosquitto:2	Up 16 hours	0.0.0.0:1883->1883/tcp, [::]:1883->1883/tcp
```

## Node-RED Surface

### Flow Summary
```json
bash: -c: line 1: syntax error near unexpected token `)'
bash: -c: line 1: `docker exec nodered sh -lc 'node -e "const fs=require(\'fs\'); const f=\'/data/flows.json\'; if(!fs.existsSync(f)){console.log(JSON.stringify({missing:true},null,2)); process.exit(0)}; const flows=JSON.parse(fs.readFileSync(f,\'utf8\')); const counts={}; for(const n of flows){counts[n.type]=(counts[n.type]||0)+1}; console.log(JSON.stringify({counts,tabs:flows.filter(n=>n.type===\'tab\').map(n=>({id:n.id,label:n.label,disabled:n.disabled})),nodes:flows.map(n=>({id:n.id,type:n.type,label:n.label||n.name||null,z:n.z||null}))},null,2))"''
```

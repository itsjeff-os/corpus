# Home Network Topology

## Overview

This document describes the home network topology. It is the source of truth for all network-related facts.

## VLANs

### VLAN 10 — Management

- Subnet: 192.168.10.0/24
- Gateway: 192.168.10.1
- Purpose: Network infrastructure management
- Devices: Router, managed switches, AP controllers

### VLAN 20 — IoT

- Subnet: 192.168.20.0/24
- Gateway: 192.168.20.1
- Purpose: IoT and media devices (isolated from main LAN)
- Devices: Apple TV Lounge, smart home hubs, streaming devices

### VLAN 30 — Trusted LAN

- Subnet: 192.168.30.0/24
- Gateway: 192.168.30.1
- Purpose: Primary workstations and trusted devices

## Devices

### NAS Main
- VLAN: 10 (Management)
- IP: 192.168.10.50
- Services: Samba, NFS, Plex
- Owner: Jeffe

### Apple TV Lounge
- VLAN: 20 (IoT)
- IP: DHCP (192.168.20.x)
- Services: AirPlay receiver
- Owner: Jeffe

### Router (Main)
- Management IP: 192.168.10.1
- Model: Ubiquiti UniFi Dream Machine Pro
- mDNS reflector: disabled (requires manual config per VLAN)

## Known Issues

- Apple TV Lounge cannot discover NAS Main via mDNS because they are on different VLANs
  and the mDNS reflector is disabled.
- To resolve: enable mDNS reflector in router settings, or move NAS to VLAN 20.

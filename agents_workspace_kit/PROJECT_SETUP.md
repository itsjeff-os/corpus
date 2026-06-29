# Project Setup Guide (Tier 1 — Project-only)

This guide assumes you will run the agents *inside a ChatGPT Project*.

## 1) Create the Project
- Name: **Agents — Smart Home & Life**
- Icon/color: anything memorable

## 2) Upload files
If you have a low file limit:
1. `AGENTS_ALL_IN_ONE.md`
2. `PROJECT_INSTRUCTIONS.txt`
3. `INVENTORY_TEMPLATE.md`

Otherwise upload everything in this kit.

## 3) Add Project instructions
Project → menu (⋯) → Project settings → paste `PROJECT_INSTRUCTIONS.txt`.

## 4) Create a baseline “Inventory” chat
Start a chat called “Inventory” and paste:
- your filled `INVENTORY_TEMPLATE.md`
- (optional) your naming conventions and any existing modes/helpers

This becomes the shared memory anchor for all future work in the Project.

## 5) Use the agents
- `@AE` for YAML builds/debug
- `@LD` for lighting design and scene planning
- `@DO` for refactor/config health
- `@LA` for routines/habits/environment design

## 6) Ship safely
Use `protocols/QA_CHECKLIST.md` before applying changes in HA.
If you keep HA config in Git, ship via small commits.


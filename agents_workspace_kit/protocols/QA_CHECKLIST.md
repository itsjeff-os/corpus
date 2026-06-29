# Home Assistant Change QA Checklist (shared)

Use before shipping config changes:

## Correctness
- [ ] YAML validates (no indentation / schema issues)
- [ ] Entity IDs and domains are correct
- [ ] Services exist and have correct fields
- [ ] Triggers fire as expected (trace / manual trigger)
- [ ] Conditions are correct at runtime
- [ ] Actions are idempotent (avoid toggles unless intentional)

## Safety & UX
- [ ] Manual override behavior defined
- [ ] “Do not disturb” respected
- [ ] No rapid oscillation (debounce / cooldown)
- [ ] Night-time lighting safe (no sudden bright light)

## Maintainability
- [ ] Names follow a convention
- [ ] Duplication minimized (scripts / variables / choose)
- [ ] Comment / description explains intent
- [ ] Rollback plan exists

## Release
- [ ] Smallest safe change shipped first
- [ ] Changelog line added (what/why)

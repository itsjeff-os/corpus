# Smoke Tests (run after setup)

## Router
1) In the Project, type `/agents` → expect menu.
2) Type `@AE Build a motion-activated closet light with a 2 minute timeout` → expect AE Build Mode.
3) Type `@LD Design an evening lighting arc for the living room` → expect arc table + scenes.
4) Type `@DO Review this automation for refactors: <paste YAML>` → expect review format.
5) Type `@LA Help me design a 10 minute wind-down routine` → expect system + keystone routine.

## Content safety checks
- Agents should not ask for tokens or passwords.
- Agents should use placeholders if entity IDs are unknown.

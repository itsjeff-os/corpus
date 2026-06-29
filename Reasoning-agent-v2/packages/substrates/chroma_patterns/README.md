# chroma_patterns

Runtime retrieval boundary for the Chroma semantic pattern substrate.

The home system uses typed collections:

- `home_ha_automations`
- `home_ha_reference`
- `home_system_docs`
- `home_patterns_rituals`

The client resolves collection names to Chroma collection IDs through the v2
collections API unless IDs are supplied in config. Semantic query methods require
either a caller-provided `queryEmbedding` or a configured `embedQuery` function.

Query helpers:

- `queryByIntent`
- `queryByEntity`
- `queryByRoom`
- `querySimilarAutomation`

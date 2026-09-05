---
name: imports
description: >-
  Project import alias and module hierarchy. Use when adding or changing
  imports, editing src/core, src/chess, or src/ui, or when a lower layer
  starts depending on a higher one.
---

# Imports

Project imports use the `@/` alias. No relative `./` or `../`, except `index.ts` barrels re-exporting from their own folder.

```typescript
import type { Board } from "@/core/domain/entities/Board";
import { Movement } from "@/core/domain/value-objects/Movement";
```

Modules are layers. A module may import itself and layers below it, never above. Current layers, lowest first:

- `src/core` — generic board-game kernel
- `src/chess` — chess on top of core
- `src/ui` — console and web

Enforced by `eslint-plugin-boundaries` in `eslint.config.mjs`. Do not put higher-layer types into a lower layer (e.g. chess piece names in core). Leftovers still in core: `src/core/README.md` (**To move**).

---
name: update-readme-todos
description: >-
  Updates module README backlog after work lands. Use when finishing a change
  in src/core or src/chess, extracting leftovers, implementing a chess feature,
  or when the user mentions README todo, To do, or To move.
---

# Update README todos

Backlog lives in module READMEs, not a separate `todo.md`. After a change that finishes or reveals work, update the matching README in the same turn.

- `src/core/README.md` — **To move**: chess leftovers still in core
- `src/chess/README.md` — **Implemented** and **To do**: chess features

1. If an item is done: check it off (`[x]`) or remove it; for chess, move it from **To do** into **Implemented**.
2. If new leftover or missing feature showed up: add a line. Core leftovers go only to **To move**. Feature work goes only to chess **To do**.
3. Keep wording short and concrete (type/name + why).
4. Do not invent a new todo file.

---
name: test-structure
description: >-
  Unit spec structure, isolation, and happy vs pessimistic paths. Use when
  writing or editing *.spec.ts, planning tests, or before implementing a
  method or use-case.
---

# Test structure

Wrap `it` blocks inside a `describe` named after the method being tested. Cover both happy and pessimistic paths.

```typescript
describe("MyClass", () => {
  describe("execute", () => {
    describe("happy path", () => {
      it("does X when ...", () => { /* ... */ });
    });

    describe("pessimistic path", () => {
      it("throws when ...", () => { /* ... */ });
    });
  });
});
```

In unit tests, collaborators are local fakes or stubs. Do not wire real domain implementations — that is an integration test.

## Propose paths before implementing

Before writing tests or production code, list in chat — as a separate message, not mixed into the implementation — the happy and pessimistic cases you would cover. Call out ones the user may have missed (empty input, missing collaborator, invalid state after a move, already-moved, wrong player, undo of empty history, etc.). Wait for the user to confirm or drop cases, then implement.

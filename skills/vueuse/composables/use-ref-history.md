# useRefHistory

Track the change history of a ref, also provides undo and redo functionality

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
// @include: usage
// ---cut---
counter.value += 1

await nextTick()
console.log(history.value)
/* [
  { snapshot: 1, timestamp: 1601912898062 },
  { snapshot: 0, timestamp: 1601912898061 }
] */
```

## Reference

[VueUse Docs](https://vueuse.org/core/useRefHistory/)

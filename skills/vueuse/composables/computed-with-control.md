# computedWithControl

Explicitly define the dependencies of computed.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
// @include: main
// ---cut---
console.log(computedRef.value) // 0

counter.value += 1

console.log(computedRef.value) // 0

source.value = 'bar'

console.log(computedRef.value) // 1
```

## Reference

[VueUse Docs](https://vueuse.org/core/computedWithControl/)

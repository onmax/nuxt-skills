# reactiveComputed

Computed reactive object. Instead of returning a ref that does, returns a reactive object.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { reactiveComputed } from '@vueuse/core'

const state = reactiveComputed(() => {
  return {
    foo: 'bar',
    bar: 'baz',
  }
})

state.bar // 'baz'
```

## Reference

[VueUse Docs](https://vueuse.org/core/reactiveComputed/)

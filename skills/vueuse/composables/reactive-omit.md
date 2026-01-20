# reactiveOmit

Reactively omit fields from a reactive object.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { reactiveOmit } from '@vueuse/core'

const obj = reactive({
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0,
})

const picked = reactiveOmit(obj, 'x', 'elementX') // { y: number, elementY: number }
```

## Reference

[VueUse Docs](https://vueuse.org/core/reactiveOmit/)

# reactivePick

Reactively pick fields from a reactive object.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { reactivePick } from '@vueuse/core'

const obj = reactive({
  x: 0,
  y: 0,
  elementX: 0,
  elementY: 0,
})

const picked = reactivePick(obj, 'x', 'elementX') // { x: number, elementX: number }
```

## Reference

[VueUse Docs](https://vueuse.org/core/reactivePick/)

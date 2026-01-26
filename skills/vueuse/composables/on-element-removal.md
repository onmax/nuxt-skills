# onElementRemoval

Fires when the element or any element containing it is removed from the DOM.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { onElementRemoval } from '@vueuse/core'

onElementRemoval(targetRef, (mutationRecords) => {
  console.log('Element removed', mutationRecords)
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/onElementRemoval/)

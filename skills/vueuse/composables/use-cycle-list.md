# useCycleList

Cycle through a list of items.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useCycleList } from '@vueuse/core'

const { state, next, prev, go } = useCycleList([
  'Dog',
  'Cat',
  'Lizard',
  'Shark',
  'Whale',
  'Dolphin',
  'Octopus',
  'Seal',
])

console.log(state.value) // 'Dog'

prev()

console.log(state.value) // 'Seal'

go(3)

console.log(state.value) // 'Shark'
```

## Reference

[VueUse Docs](https://vueuse.org/core/useCycleList/)

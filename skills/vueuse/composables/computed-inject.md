# computedInject

Combine and . Useful for creating a computed property based on an injected value.

**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
// @filename: provider.ts
// @include: main
// ---cut---
import { computedInject } from '@vueuse/core'

import { ArrayKey } from './provider'

const computedArray = computedInject(ArrayKey, (source) => {
  const arr = [...source.value]
  arr.unshift({ key: 0, value: 'all' })
  return arr
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/computedInject/)

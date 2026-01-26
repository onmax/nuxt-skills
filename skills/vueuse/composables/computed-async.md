# computedAsync

Computed for async functions.

**Package:** `@vueuse/core`
**Category:** Reactivity

## Usage

```ts
import { computedAsync } from '@vueuse/core'
import { shallowRef } from 'vue'

const name = shallowRef('jack')

const userInfo = computedAsync(
  async () => {
    return await mockLookUp(name.value)
  },
  null, // initial state
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/computedAsync/)

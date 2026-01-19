# createGlobalState

Keep states in the global scope to be reusable across Vue instances.

**Package:** `@vueuse/shared`
**Category:** State

## Usage

```ts
// store.ts
import { createGlobalState } from '@vueuse/core'
import { shallowRef } from 'vue'

export const useGlobalState = createGlobalState(
  () => {
    const count = shallowRef(0)
    return { count }
  }
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/createGlobalState/)

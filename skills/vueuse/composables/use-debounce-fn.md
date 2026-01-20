# useDebounceFn

Debounce execution of a function.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { useDebounceFn, useEventListener } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

useEventListener(window, 'resize', debouncedFn)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useDebounceFn/)

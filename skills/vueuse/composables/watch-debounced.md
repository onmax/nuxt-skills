# watchDebounced

Debounced watch. The callback will only be invoked after the source stops changing for the specified duration.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchDebounced } from '@vueuse/core'

watchDebounced(
  source,
  () => { console.log('changed!') },
  { debounce: 500, maxWait: 1000 },
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchDebounced/)

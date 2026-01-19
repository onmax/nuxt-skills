# watchDebounced

Debounced watch

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

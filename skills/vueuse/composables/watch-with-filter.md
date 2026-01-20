# watchWithFilter

with additional EventFilter control.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { debounceFilter, watchWithFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') }, // callback will be called in 500ms debounced manner
  {
    eventFilter: debounceFilter(500), // throttledFilter, pausableFilter or custom filters
  },
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchWithFilter/)

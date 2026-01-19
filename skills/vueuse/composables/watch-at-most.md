# watchAtMost

with the number of times triggered.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchAtMost } from '@vueuse/core'

watchAtMost(
  source,
  () => { console.log('trigger!') }, // triggered it at most 3 times
  {
    count: 3, // the number of times triggered
  },
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchAtMost/)

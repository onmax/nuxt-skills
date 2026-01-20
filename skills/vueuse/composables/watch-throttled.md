# watchThrottled

Throttled watch.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchThrottled } from '@vueuse/core'

watchThrottled(
  source,
  () => { console.log('changed!') },
  { throttle: 500 },
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchThrottled/)

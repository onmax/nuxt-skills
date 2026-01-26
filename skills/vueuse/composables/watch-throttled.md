# watchThrottled

Throttled watch. The callback will be invoked at most once per specified duration.

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

# until

Promised one-time watch for changes

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { until, useAsyncState } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

;(async () => {
  await until(isReady).toBe(true)

  console.log(state) // state is now ready!
})()
```

## Reference

[VueUse Docs](https://vueuse.org/core/until/)

# useThrottleFn

Throttle execution of a function. Especially useful for rate limiting execution of handlers on events like resize and scroll.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something, it will be called at most 1 time per second
}, 1000)

useEventListener(window, 'resize', throttledFn)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useThrottleFn/)

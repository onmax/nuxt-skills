# useThrottledRefHistory

Shorthand for with throttled filter.

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
import { useThrottledRefHistory } from '@vueuse/core'
import { shallowRef } from 'vue'

const counter = shallowRef(0)
const { history, undo, redo } = useThrottledRefHistory(counter, { deep: true, throttle: 1000 })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useThrottledRefHistory/)

# usePerformanceObserver

Observe performance metrics.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { usePerformanceObserver } from '@vueuse/core'

const entrys = ref<PerformanceEntry[]>([])
usePerformanceObserver({
  entryTypes: ['paint'],
}, (list) => {
  entrys.value = list.getEntries()
})
```

## Returns

| Name        | Type           |
| ----------- | -------------- |
| isSupported | `useSupported` |
| start       | `Ref`          |
| stop        | `Ref`          |

## Reference

[VueUse Docs](https://vueuse.org/core/usePerformanceObserver/)

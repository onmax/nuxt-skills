# useLastChanged

Records the timestamp of the last change

**Package:** `@vueuse/shared`
**Category:** State

## Usage

```ts
import { useLastChanged } from '@vueuse/core'
import { nextTick } from 'vue'

const a = ref(0)
const lastChanged = useLastChanged(a)

a.value = 1

await nextTick()

console.log(lastChanged.value) // 1704709379457
```

## Reference

[VueUse Docs](https://vueuse.org/core/useLastChanged/)

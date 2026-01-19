# useArrayIncludes

Reactive

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayIncludes } from '@vueuse/core'

const list = ref([0, 2, 4, 6, 8])
const result = useArrayIncludes(list, 10)
// result.value: false
list.value.push(10)
// result.value: true
list.value.pop()
// result.value: false
```

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayIncludes/)

# useArrayUnique

reactive unique array

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayUnique } from '@vueuse/core'

const item1 = ref(0)
const item2 = ref(1)
const item3 = ref(1)
const item4 = ref(2)
const item5 = ref(3)
const list = [item1, item2, item3, item4, item5]
const result = useArrayUnique(list)
// result.value: [0, 1, 2, 3]
item5.value = 1
// result.value: [0, 1, 2]
```

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayUnique/)

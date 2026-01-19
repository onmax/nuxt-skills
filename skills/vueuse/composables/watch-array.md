# watchArray

Watch for an array with additions and removals.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchArray } from '@vueuse/core'

const list = ref([1, 2, 3])

watchArray(list, (newList, oldList, added, removed) => {
  console.log(newList) // [1, 2, 3, 4]
  console.log(oldList) // [1, 2, 3]
  console.log(added) // [4]
  console.log(removed) // []
})

onMounted(() => {
  list.value = [...list.value, 4]
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchArray/)

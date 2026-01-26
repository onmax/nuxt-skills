# useArrayDifference

Reactive get array difference of two arrays.

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayDifference } from '@vueuse/core'

const list1 = ref([0, 1, 2, 3, 4, 5])
const list2 = ref([4, 5, 6])
const result = useArrayDifference(list1, list2)
// result.value: [0, 1, 2, 3]
list2.value = [0, 1, 2]
// result.value: [3, 4, 5]
```

## Options

| Option    | Type      | Default | Description                   |
| --------- | --------- | ------- | ----------------------------- |
| symmetric | `boolean` | false   | Returns asymmetric difference |

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayDifference/)

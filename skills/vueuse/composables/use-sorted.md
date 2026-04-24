# useSorted

reactive sort array

**Package:** `@vueuse/core`
**Category:** Array

## Usage

```ts
import { useSorted } from '@vueuse/core'

// general sort
const source = [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]
const sorted = useSorted(source)
console.log(sorted.value) // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(source) // [10, 3, 5, 7, 2, 1, 8, 6, 9, 4]

// object sort
const objArr = [{
  name: 'John',
  age: 40,
}, {
  name: 'Jane',
  age: 20,
}, {
  name: 'Joe',
  age: 30,
}, {
  name: 'Jenny',
  age: 22,
}]
const objSorted = useSorted(objArr, (a, b) => a.age - b.age)
```

## Options

| Option    | Type                          | Default | Description                          |
| --------- | ----------------------------- | ------- | ------------------------------------ |
| sortFn    | `UseSortedFn&lt;T&gt;`        | -       | sort algorithm                       |
| compareFn | `UseSortedCompareFn&lt;T&gt;` | -       | compare function                     |
| dirty     | `boolean`                     | false   | change the value of the source array |

## Reference

[VueUse Docs](https://vueuse.org/core/useSorted/)

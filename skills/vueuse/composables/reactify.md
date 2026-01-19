# reactify

Converts plain functions into reactive functions. The converted function accepts refs as its arguments and returns a ComputedRef, with proper typing.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { reactify } from '@vueuse/core'
import { shallowRef } from 'vue'

// a plain function
function add(a: number, b: number): number {
  return a + b
}

// now it accept refs and returns a computed ref
// (a: number | Ref<number>, b: number | Ref<number>) => ComputedRef<number>
const reactiveAdd = reactify(add)

const a = shallowRef(1)
const b = shallowRef(2)
const sum = reactiveAdd(a, b)

console.log(sum.value) // 3

a.value = 5

console.log(sum.value) // 7
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| computedGetter | `T` | true | Accept passing a function as a reactive getter |

## Reference

[VueUse Docs](https://vueuse.org/core/reactify/)

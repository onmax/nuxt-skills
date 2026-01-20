# computedEager

Eager computed without lazy evaluation.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { computedEager } from '@vueuse/core'

const todos = ref([])
const hasOpenTodos = computedEager(() => !!todos.length)

console.log(hasOpenTodos.value) // false
toTodos.value.push({ title: 'Learn Vue' })
console.log(hasOpenTodos.value) // true
```

## Reference

[VueUse Docs](https://vueuse.org/core/computedEager/)

# syncRef

Two-way refs synchronization.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { syncRef } from '@vueuse/core'

const a = ref('a')
const b = ref('b')

const stop = syncRef(a, b)

console.log(a.value) // a

b.value = 'foo'

console.log(a.value) // foo

a.value = 'bar'

console.log(b.value) // bar
```

## Reference

[VueUse Docs](https://vueuse.org/core/syncRef/)

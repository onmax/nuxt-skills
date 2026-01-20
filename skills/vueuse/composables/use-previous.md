# usePrevious

Holds the previous value of a ref.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { usePrevious } from '@vueuse/core'
import { shallowRef } from 'vue'

const counter = shallowRef('Hello')
const previous = usePrevious(counter)

console.log(previous.value) // undefined

counter.value = 'World'

console.log(previous.value) // Hello
```

## Reference

[VueUse Docs](https://vueuse.org/core/usePrevious/)

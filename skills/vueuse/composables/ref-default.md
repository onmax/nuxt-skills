# refDefault

Apply default value to a ref.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { refDefault, useStorage } from '@vueuse/core'

const raw = useStorage('key')
const state = refDefault(raw, 'default')

raw.value = 'hello'
console.log(state.value) // hello

raw.value = undefined
console.log(state.value) // default
```

## Reference

[VueUse Docs](https://vueuse.org/core/refDefault/)

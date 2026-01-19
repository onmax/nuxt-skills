# useToString

Reactively convert a ref to string.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { useToString } from '@vueuse/core'
import { shallowRef } from 'vue'

const number = shallowRef(3.14)
const str = useToString(number)

str.value // '3.14'
```

## Reference

[VueUse Docs](https://vueuse.org/core/useToString/)

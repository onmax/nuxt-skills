# useToNumber

Reactively convert a string ref to number.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { useToNumber } from '@vueuse/core'
import { shallowRef } from 'vue'

const str = shallowRef('123')
const number = useToNumber(str)

number.value // 123
```

## Reference

[VueUse Docs](https://vueuse.org/core/useToNumber/)

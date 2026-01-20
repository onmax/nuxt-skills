# useArrayReduce

Reactive .

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayReduce } from '@vueuse/core'

const sum = useArrayReduce([ref(1), ref(2), ref(3)], (sum, val) => sum + val)
// sum.value: 6
```

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayReduce/)

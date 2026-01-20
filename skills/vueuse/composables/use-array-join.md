# useArrayJoin

Reactive

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayJoin } from '@vueuse/core'

const item1 = ref('foo')
const item2 = ref(0)
const item3 = ref({ prop: 'val' })
const list = [item1, item2, item3]
const result = useArrayJoin(list)
// result.value: foo,0,[object Object]
item1.value = 'bar'
// result.value: bar,0,[object Object]
```

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayJoin/)

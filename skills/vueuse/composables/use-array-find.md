# useArrayFind

Reactive .

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayFind } from '@vueuse/core'

const list = [ref(1), ref(-1), ref(2)]
const positive = useArrayFind(list, val => val > 0)
// positive.value: 1
```

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayFind/)

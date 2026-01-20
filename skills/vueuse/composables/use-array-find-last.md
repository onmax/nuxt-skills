# useArrayFindLast

Reactive .

**Package:** `@vueuse/shared`
**Category:** Array

## Usage

```ts
import { useArrayFindLast } from '@vueuse/core'

const list = [ref(1), ref(-1), ref(2)]
const positive = useArrayFindLast(list, val => val > 0)
// positive.value: 2
```

## Reference

[VueUse Docs](https://vueuse.org/core/useArrayFindLast/)

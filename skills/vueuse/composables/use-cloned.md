# useCloned

Reactive clone of a ref. By default, it use to do the clone.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useCloned } from '@vueuse/core'

const original = ref({ key: 'value' })

const { cloned } = useCloned(original)

original.value.key = 'some new value'

console.log(cloned.value.key) // 'value'
```

## Reference

[VueUse Docs](https://vueuse.org/core/useCloned/)

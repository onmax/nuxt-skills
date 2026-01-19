# toRef

Normalize value/ref/getter to or .

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { toRef } from '@vueuse/core'

const foo = ref('hi')

const a = toRef(0) // Ref<number>
const b = toRef(foo) // Ref<string>
const c = toRef(() => 'hi') // ComputedRef<string>
```

## Reference

[VueUse Docs](https://vueuse.org/core/toRef/)

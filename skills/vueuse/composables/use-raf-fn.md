# useRafFn

Call function on every . With controls of pausing and resuming.

**Package:** `@vueuse/core`
**Category:** Animation

## Usage

```ts
import { useRafFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const count = shallowRef(0)

const { pause, resume } = useRafFn(() => {
  count.value++
  console.log(count.value)
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useRafFn/)

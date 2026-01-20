# logicOr

conditions for refs.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { whenever } from '@vueuse/core'
import { logicOr } from '@vueuse/math'

const a = ref(true)
const b = ref(false)

whenever(logicOr(a, b), () => {
  console.log('either a or b is truthy!')
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/logicOr/)

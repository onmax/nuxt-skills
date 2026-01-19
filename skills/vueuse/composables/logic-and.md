# logicAnd

condition for refs.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { whenever } from '@vueuse/core'
import { logicAnd } from '@vueuse/math'

const a = ref(true)
const b = ref(false)

whenever(logicAnd(a, b), () => {
  console.log('both a and b are now truthy!')
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/logicAnd/)

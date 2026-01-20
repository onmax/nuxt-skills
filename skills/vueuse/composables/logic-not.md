# logicNot

condition for ref.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { whenever } from '@vueuse/core'
import { logicNot } from '@vueuse/math'

const a = ref(true)

whenever(logicNot(a), () => {
  console.log('a is now falsy!')
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/logicNot/)

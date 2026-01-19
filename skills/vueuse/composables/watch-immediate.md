# watchImmediate

Shorthand for watching value with

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchImmediate } from '@vueuse/core'

const obj = ref('vue-use')

// changing the value from some external store/composables
obj.value = 'VueUse'

watchImmediate(obj, (updated) => {
  console.log(updated) // Console.log will be logged twice
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchImmediate/)

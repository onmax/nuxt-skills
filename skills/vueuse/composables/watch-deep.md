# watchDeep

Shorthand for watching value with

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchDeep } from '@vueuse/core'

const nestedObject = ref({ foo: { bar: { deep: 5 } } })

watchDeep(nestedObject, (updated) => {
  console.log(updated)
})

onMounted(() => {
  nestedObject.value.foo.bar.deep = 10
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchDeep/)

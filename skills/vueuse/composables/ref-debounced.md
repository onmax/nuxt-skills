# refDebounced

Debounce execution of a ref value.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { refDebounced } from '@vueuse/core'
import { shallowRef } from 'vue'

const data = shallowRef({
  name: 'foo',
  age: 18,
})
const debounced = refDebounced(data, 1000)

function update() {
  data.value = {
    ...data.value,
    name: 'bar',
  }
}

console.log(debounced.value) // { name: 'foo', age: 18 }
update()
await sleep(1100)

console.log(debounced.value) // { name: 'bar', age: 18 }
```

## Reference

[VueUse Docs](https://vueuse.org/core/refDebounced/)

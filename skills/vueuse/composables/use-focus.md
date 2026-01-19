# useFocus

Reactive utility to track or set the focus state of a DOM element. State changes to reflect whether the target element is the focused element. Setting reactive value from the outside will trigger and events for and values respectively.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useFocus } from '@vueuse/core'

const target = shallowRef()
const { focused } = useFocus(target)

watch(focused, (focused) => {
  if (focused)
    console.log('input element has been focused')
  else console.log('input element has lost focus')
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useFocus/)

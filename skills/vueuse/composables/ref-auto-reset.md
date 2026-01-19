# refAutoReset

A ref which will be reset to the default value after some time.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { refAutoReset } from '@vueuse/core'

const message = refAutoReset('default message', 1000)

function setMessage() {
  // here the value will change to 'message has set' but after 1000ms, it will change to 'default message'
  message.value = 'message has set'
}
```

## Reference

[VueUse Docs](https://vueuse.org/core/refAutoReset/)

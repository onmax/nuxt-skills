# refManualReset

Create a ref with manual reset functionality.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { refManualReset } from '@vueuse/core'

const message = refManualReset('default message')

message.value = 'message has set'

message.reset()

console.log(message.value) // 'default message'
```

## Reference

[VueUse Docs](https://vueuse.org/core/refManualReset/)

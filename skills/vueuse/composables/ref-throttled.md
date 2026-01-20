# refThrottled

Throttle changing of a ref value.

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { refThrottled } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('')
const throttled = refThrottled(input, 1000)
```

## Reference

[VueUse Docs](https://vueuse.org/core/refThrottled/)

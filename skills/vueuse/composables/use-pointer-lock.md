# usePointerLock

Reactive pointer lock.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { usePointerLock } from '@vueuse/core'

const {
  isSupported,
  lock,
  unlock,
  element,
  triggerElement
} = usePointerLock()
```

## Returns

| Name           | Type                             |
| -------------- | -------------------------------- |
| isSupported    | `useSupported`                   |
| element        | `shallowRef&lt;MaybeElement&gt;` |
| triggerElement | `shallowRef&lt;MaybeElement&gt;` |
| lock           | `Ref`                            |
| unlock         | `Ref`                            |

## Reference

[VueUse Docs](https://vueuse.org/core/usePointerLock/)

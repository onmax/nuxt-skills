# useScreenOrientation

Reactive Screen Orientation API. It provides web developers with information about the user's current screen orientation.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useScreenOrientation } from '@vueuse/core'

const {
  isSupported,
  orientation,
  angle,
  lockOrientation,
  unlockOrientation,
} = useScreenOrientation()
```

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| orientation | `deepRef&lt;OrientationType \| undefined&gt;` |
| angle | `shallowRef` |
| lockOrientation | `Ref` |
| unlockOrientation | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useScreenOrientation/)

# useDeviceOrientation

Reactive DeviceOrientationEvent. Provide web developers with information from the physical orientation of the device running the web page.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useDeviceOrientation } from '@vueuse/core'

const {
  isAbsolute,
  alpha,
  beta,
  gamma,
} = useDeviceOrientation()
```

## Returns

| Name        | Type           |
| ----------- | -------------- |
| isSupported | `useSupported` |
| isAbsolute  | `shallowRef`   |
| alpha       | `Ref`          |
| beta        | `Ref`          |
| gamma       | `Ref`          |

## Reference

[VueUse Docs](https://vueuse.org/core/useDeviceOrientation/)

# useDeviceMotion

Reactive DeviceMotionEvent. Provide web developers with information about the speed of changes for the device's position and orientation.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useDeviceMotion } from '@vueuse/core'

const {
  acceleration,
  accelerationIncludingGravity,
  rotationRate,
  interval,
} = useDeviceMotion()
```

## Returns

| Name                         | Type           |
| ---------------------------- | -------------- |
| acceleration                 | `Ref`          |
| accelerationIncludingGravity | `Ref`          |
| rotationRate                 | `Ref`          |
| interval                     | `shallowRef`   |
| isSupported                  | `useSupported` |
| requirePermissions           | `useSupported` |
| ensurePermissions            | `Ref`          |
| permissionGranted            | `shallowRef`   |

## Reference

[VueUse Docs](https://vueuse.org/core/useDeviceMotion/)

# useDevicesList

Reactive enumerateDevices listing available input/output devices.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useDevicesList } from '@vueuse/core'

const {
  devices,
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = useDevicesList()
```

## Options

| Option             | Type      | Default | Description                                              |
| ------------------ | --------- | ------- | -------------------------------------------------------- |
| requestPermissions | `boolean` | false   | Request for permissions immediately if it's not granted, |

## Returns

| Name              | Type           |
| ----------------- | -------------- |
| devices           | `deepRef`      |
| ensurePermissions | `Ref`          |
| permissionGranted | `shallowRef`   |
| videoInputs       | `computed`     |
| audioInputs       | `computed`     |
| audioOutputs      | `computed`     |
| isSupported       | `useSupported` |

## Reference

[VueUse Docs](https://vueuse.org/core/useDevicesList/)

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

## Reference

[VueUse Docs](https://vueuse.org/core/useDevicesList/)

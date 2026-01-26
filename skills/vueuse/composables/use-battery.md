# useBattery

Reactive Battery Status API, more often referred to as the Battery API, provides information about the system's battery charge level and lets you be notified by events that are sent when the battery level or charging status change. This can be used to adjust your app's resource usage to reduce battery drain when the battery is low, or to save changes before the battery runs out in order to prevent data loss.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useBattery } from '@vueuse/core'

const { isSupported, charging, chargingTime, dischargingTime, level } = useBattery()
```

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| charging | `shallowRef` |
| chargingTime | `shallowRef` |
| dischargingTime | `shallowRef` |
| level | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useBattery/)

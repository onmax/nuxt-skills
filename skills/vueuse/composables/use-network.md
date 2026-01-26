# useNetwork

Reactive Network status. The Network Information API provides information about the system's connection in terms of general connection type (e.g., 'wifi', 'cellular', etc.). This can be used to select high definition content or low definition content based on the user's connection. The entire API consists of the addition of the NetworkInformation interface and a single property to the Navigator interface: Navigator.connection.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useNetwork } from '@vueuse/core'

const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData, type } = useNetwork()

console.log(isOnline.value)
```

## Returns

| Name          | Type                                     |
| ------------- | ---------------------------------------- |
| isSupported   | `useSupported`                           |
| isOnline      | `shallowRef`                             |
| saveData      | `shallowRef`                             |
| offlineAt     | `shallowRef&lt;number \| undefined&gt;`  |
| onlineAt      | `shallowRef&lt;number \| undefined&gt;`  |
| downlink      | `shallowRef&lt;number \| undefined&gt;`  |
| downlinkMax   | `shallowRef&lt;number \| undefined&gt;`  |
| effectiveType | `shallowRef&lt;NetworkEffectiveType&gt;` |
| rtt           | `shallowRef&lt;number \| undefined&gt;`  |
| type          | `shallowRef&lt;NetworkType&gt;`          |

## Reference

[VueUse Docs](https://vueuse.org/core/useNetwork/)

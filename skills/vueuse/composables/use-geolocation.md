# useGeolocation

Reactive Geolocation API. It allows the user to provide their location to web applications if they so desire. For privacy reasons, the user is asked for permission to report location information.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useGeolocation } from '@vueuse/core'

const { coords, locatedAt, error, resume, pause } = useGeolocation()
```

## Returns

| Name        | Type                                                 |
| ----------- | ---------------------------------------------------- |
| isSupported | `useSupported`                                       |
| coords      | `Ref`                                                |
| locatedAt   | `shallowRef&lt;number \| null&gt;`                   |
| error       | `shallowRef&lt;GeolocationPositionError \| null&gt;` |
| resume      | `Ref`                                                |
| pause       | `Ref`                                                |

## Reference

[VueUse Docs](https://vueuse.org/core/useGeolocation/)

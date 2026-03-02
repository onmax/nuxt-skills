# useVibrate

Reactive Vibration API

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useVibrate } from '@vueuse/core'

// This vibrates the device for 300 ms
// then pauses for 100 ms before vibrating the device again for another 300 ms:
const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] })

// Start the vibration, it will automatically stop when the pattern is complete:
vibrate()

// But if you want to stop it, you can:
stop()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| pattern | `MaybeRefOrGetter&lt;Arrayable&lt;number&gt;&gt;` | [] | * Vibration Pattern |
| interval | `number` | 0 | Interval to run a persistent vibration, in ms |

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| pattern | `Ref` |
| intervalControls | `Ref` |
| vibrate | `Ref` |
| stop | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useVibrate/)

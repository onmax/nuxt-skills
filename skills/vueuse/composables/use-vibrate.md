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

## Reference

[VueUse Docs](https://vueuse.org/core/useVibrate/)

# useWakeLock

Reactive Screen Wake Lock API. Provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useWakeLock } from '@vueuse/core'

const { isSupported, isActive, forceRequest, request, release } = useWakeLock()
```

## Reference

[VueUse Docs](https://vueuse.org/core/useWakeLock/)

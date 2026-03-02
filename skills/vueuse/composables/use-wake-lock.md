# useWakeLock

Reactive Screen Wake Lock API. Provides a way to prevent devices from dimming or locking the screen when an application needs to keep running.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useWakeLock } from '@vueuse/core'

const { isSupported, isActive, forceRequest, request, release } = useWakeLock()
```

## Returns

| Name | Type |
| --- | --- |
| sentinel | `shallowRef&lt;WakeLockSentinel \| null&gt;` |
| isSupported | `useSupported` |
| isActive | `computed` |
| request | `Ref` |
| forceRequest | `Ref` |
| release | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useWakeLock/)

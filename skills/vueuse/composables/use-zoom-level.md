# useZoomLevel

Reactive WebFrame zoom level.

**Package:** `@vueuse/electron`
**Category:** '@Electron'

## Usage

```ts
import { useZoomLevel } from '@vueuse/electron'

// enable nodeIntegration if you don't provide webFrame explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const level = useZoomLevel()
console.log(level.value) // print current zoom level
level.value = 2 // change current zoom level
```

## Reference

[VueUse Docs](https://vueuse.org/core/useZoomLevel/)

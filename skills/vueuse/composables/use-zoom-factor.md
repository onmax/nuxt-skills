# useZoomFactor

Reactive WebFrame zoom factor.

**Package:** `@vueuse/electron`
**Category:** '@Electron'

## Usage

```ts
import { useZoomFactor } from '@vueuse/electron'

// enable nodeIntegration if you don't provide webFrame explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const factor = useZoomFactor()
console.log(factor.value) // print current zoom factor
factor.value = 2 // change current zoom factor
```

## Reference

[VueUse Docs](https://vueuse.org/core/useZoomFactor/)

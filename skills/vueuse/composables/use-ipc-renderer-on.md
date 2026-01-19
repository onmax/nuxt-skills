# useIpcRendererOn

Use ipcRenderer.on with ease and ipcRenderer.removeListener automatically on unmounted.

**Package:** `@vueuse/electron`
**Category:** '@Electron'

## Usage

```ts
import { useIpcRendererOn } from '@vueuse/electron'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// remove listener automatically on unmounted
useIpcRendererOn('custom-event', (event, ...args) => {
  console.log(args)
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useIpcRendererOn/)

# useIpcRenderer

Provides ipcRenderer and all of its APIs with Vue reactivity.

**Package:** `@vueuse/electron`
**Category:** '@Electron'

## Usage

```ts
import { useIpcRenderer } from '@vueuse/electron'
import { computed } from 'vue'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
const ipcRenderer = useIpcRenderer()

// Ref result will return
const result = ipcRenderer.invoke<string>('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)

// remove listener automatically on unmounted
ipcRenderer.on('custom-event', (event, ...args) => {
  console.log(args)
})
```

## Returns

| Name | Type |
| --- | --- |
| on | `Ref` |
| listener | `Ref` |
| once | `Ref` |
| removeListener | `Ref` |
| removeAllListeners | `Ref` |
| send | `Ref` |
| invoke | `Ref` |
| channel | `Ref` |
| sendSync | `Ref` |
| postMessage | `Ref` |
| sendTo | `Ref` |
| sendToHost | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useIpcRenderer/)

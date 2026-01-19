# useWebWorkerFn

Run expensive functions without blocking the UI, using a simple syntax that makes use of Promise. A port of alewin/useWorker.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useWebWorkerFn } from '@vueuse/core'

const { workerFn } = useWebWorkerFn(() => {
  // some heavy works to do in web worker
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useWebWorkerFn/)

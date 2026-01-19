# useWebWorker

Simple Web Workers registration and communication.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useWebWorker } from '@vueuse/core'

const { data, post, terminate, worker } = useWebWorker('/path/to/worker.js')
```

## Returns

| Name | Type |
| --- | --- |
| data | `Ref` |
| post | `Ref` |
| terminate | `Ref` |
| worker | `shallowRef&lt;Worker&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useWebWorker/)

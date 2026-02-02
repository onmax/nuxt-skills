# useIDBKeyval

Wrapper for .

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

// bind object
const { data: storedObject, isFinished } = useIDBKeyval('my-idb-keyval-store', { hello: 'hi', greeting: 'Hello' })

// update object
storedObject.value.hello = 'hola'

// bind boolean
const flag = useIDBKeyval('my-flag', true) // returns Ref<boolean>

// bind number
const count = useIDBKeyval('my-count', 0) // returns Ref<number>

// awaiting IDB transaction
await count.set(10)
console.log('IDB transaction finished!')

// delete data from idb storage
storedObject.value = null
```

## Returns

| Name       | Type         |
| ---------- | ------------ |
| set        | `Ref`        |
| isFinished | `shallowRef` |
| data       | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useIDBKeyval/)

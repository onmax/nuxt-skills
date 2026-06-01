# useAsyncQueue

Executes each asynchronous task sequentially and passes the current task result to the next task.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useAsyncQueue } from '@vueuse/core'

function p1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000)
    }, 10)
  })
}

function p2(result: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000 + result)
    }, 20)
  })
}

const { activeIndex, result } = useAsyncQueue([p1, p2])

console.log(activeIndex.value) // current pending task index

console.log(result) // the tasks result
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| interrupt | `boolean` | true | Interrupt tasks when current task fails. |
| onError | `() =&gt; void` | - | Trigger it when the tasks fails. |
| onFinished | `() =&gt; void` | - | Trigger it when the tasks ends. |
| signal | `AbortSignal` | - | A AbortSignal that can be used to abort the task. |

## Returns

| Name | Type |
| --- | --- |
| activeIndex | `shallowRef&lt;number&gt;` |
| result | `reactive` |

## Reference

[VueUse Docs](https://vueuse.org/core/useAsyncQueue/)

# useAsyncState

Reactive async state. Will not block your setup function and will trigger changes once the promise is ready. The state is a by default.

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
import { useAsyncState } from '@vueuse/core'
import axios from 'axios'

const { state, isReady, isLoading, error } = useAsyncState(
  axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then(t => t.data),
  { id: null },
)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| delay | `number` | 0 | Delay for the first execution of the promise when "immediate" is true. In milliseconds. |
| immediate | `boolean` | true | Execute the promise right after the function is invoked. |
| onError | `(e: unknown) =&gt; void` | - | Callback when error is caught. |

## Reference

[VueUse Docs](https://vueuse.org/core/useAsyncState/)

# whenever

Shorthand for watching value to be truthy.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { useAsyncState, whenever } from '@vueuse/core'

const { state, isReady } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

whenever(isReady, () => console.log(state))
```

## Reference

[VueUse Docs](https://vueuse.org/core/whenever/)

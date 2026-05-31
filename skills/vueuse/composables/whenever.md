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

## Options

| Option | Type      | Default | Description                                 |
| ------ | --------- | ------- | ------------------------------------------- |
| once   | `boolean` | false   | Only trigger once when the condition is met |

## Reference

[VueUse Docs](https://vueuse.org/core/whenever/)

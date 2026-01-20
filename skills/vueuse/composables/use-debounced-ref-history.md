# useDebouncedRefHistory

Shorthand for with debounced filter.

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
import { useDebouncedRefHistory } from '@vueuse/core'
import { shallowRef } from 'vue'

const counter = shallowRef(0)
const { history, undo, redo } = useDebouncedRefHistory(counter, { deep: true, debounce: 1000 })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useDebouncedRefHistory/)

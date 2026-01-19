# useVirtualList



**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  Array.from(Array.from({ length: 99999 }).keys()),
  {
    // Keep `itemHeight` in sync with the item's row.
    itemHeight: 22,
  },
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useVirtualList/)

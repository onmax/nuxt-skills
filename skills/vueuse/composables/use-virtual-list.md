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

## Options

| Option   | Type     | Default | Description                                     |
| -------- | -------- | ------- | ----------------------------------------------- |
| overscan | `number` | 5       | the extra buffer items outside of the view area |

## Returns

| Name           | Type                                    |
| -------------- | --------------------------------------- |
| calculateRange | `createCalculateRange`                  |
| scrollTo       | `createScrollTo`                        |
| containerStyle | `Ref`                                   |
| wrapperProps   | `computed`                              |
| currentList    | `Ref`                                   |
| containerRef   | `shallowRef&lt;HTMLElement \| null&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useVirtualList/)

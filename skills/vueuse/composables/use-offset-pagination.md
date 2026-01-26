# useOffsetPagination

Reactive offset pagination.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useOffsetPagination } from '@vueuse/core'

function fetchData({ currentPage, currentPageSize }: { currentPage: number, currentPageSize: number }) {
  fetch(currentPage, currentPageSize).then((responseData) => {
    data.value = responseData
  })
}

const {
  currentPage,
  currentPageSize,
  pageCount,
  isFirstPage,
  isLastPage,
  prev,
  next,
} = useOffsetPagination({
  total: database.value.length,
  page: 1,
  pageSize: 10,
  onPageChange: fetchData,
  onPageSizeChange: fetchData,
})
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| total | `MaybeRefOrGetter&lt;number&gt;` | - | Total number of items. |
| pageSize | `MaybeRefOrGetter&lt;number&gt;` | 10 | The number of items to display per page. |
| page | `MaybeRef&lt;number&gt;` | 1 | The current page number. |
| onPageChange | `(returnValue: UnwrapNestedRefs&lt;UseOffsetPaginationReturn&gt;) =&gt; unknown` | - | Callback when the `page` change. |
| onPageSizeChange | `(returnValue: UnwrapNestedRefs&lt;UseOffsetPaginationReturn&gt;) =&gt; unknown` | - | Callback when the `pageSize` change. |
| onPageCountChange | `(returnValue: UnwrapNestedRefs&lt;UseOffsetPaginationReturn&gt;) =&gt; unknown` | - | Callback when the `pageCount` change. |

## Reference

[VueUse Docs](https://vueuse.org/core/useOffsetPagination/)

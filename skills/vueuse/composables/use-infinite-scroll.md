# useInfiniteScroll

Infinite scrolling of the element.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const data = ref([1, 2, 3, 4, 5, 6])

const { reset } = useInfiniteScroll(
  el,
  () => {
    // load more
    data.value.push(...moreData)
  },
  {
    distance: 10,
    canLoadMore: () => {
      // inidicate when there is no more content to load so onLoadMore stops triggering
      // if (noMoreContent) return false
      return true // for demo purposes
    },
  }
)

function resetList() {
  data.value = []
  reset()
}
</script>

<template>
  <div ref="el">
    <div v-for="item in data">
      {{ item }}
    </div>
  </div>
  <button @click="resetList()">
    Reset
  </button>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| distance | `number` | 0 | The minimum distance between the bottom of the element and the bottom of the viewport |
| direction | `'top' \| 'bottom' \| 'left' \| 'right'` | bottom | The direction in which to listen the scroll. |
| interval | `number` | 100 | The interval time between two load more (to avoid too many invokes). |
| canLoadMore | `(el: T) =&gt; boolean` | - | A function that determines whether more content can be loaded for a specific element. |

## Returns

| Name | Type |
| --- | --- |
| isLoading | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useInfiniteScroll/)

# useElementOverflow

Reactive element's overflow state.

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup>
import { useElementOverflow } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isXOverflowed } = useElementOverflow(el)
</script>

<template>
  <div ref="el" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| observeMutation | `boolean \| MutationObserverInit` | false | Use MutationObserver to observe the target and its children. |
| onUpdated | `ResizeObserverCallback \| MutationCallback` | - | Callback when observer triggered. |

## Returns

| Name | Type |
| --- | --- |
| isXOverflowed | `shallowRef` |
| isYOverflowed | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useElementOverflow/)

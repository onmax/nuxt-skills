# useElementSize

Reactive size of an HTML element. ResizeObserver MDN

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { width, height } = useElementSize(el)
</script>

<template>
  <div ref="el">
    Height: {{ height }}
    Width: {{ width }}
  </div>
</template>
```

## Returns

| Name | Type |
| --- | --- |
| width | `shallowRef` |
| height | `shallowRef` |
| stop | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useElementSize/)

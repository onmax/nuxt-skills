# useResizeObserver

Reports changes to the dimensions of an Element's content or the border-box

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const text = ref('')

useResizeObserver(el, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  text.value = `width: ${width}, height: ${height}`
})
</script>

<template>
  <div ref="el">
    {{ text }}
  </div>
</template>
```

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| stop | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useResizeObserver/)

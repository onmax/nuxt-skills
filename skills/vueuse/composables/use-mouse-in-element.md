# useMouseInElement

Reactive mouse position related to an element

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useMouseInElement } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')

const { x, y, isOutside } = useMouseInElement(target)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

## Returns

| Name | Type |
| --- | --- |
| x | `Ref` |
| y | `Ref` |
| sourceType | `Ref` |
| elementX | `shallowRef` |
| elementY | `shallowRef` |
| elementPositionX | `shallowRef` |
| elementPositionY | `shallowRef` |
| elementHeight | `shallowRef` |
| elementWidth | `shallowRef` |
| isOutside | `shallowRef` |
| stop | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useMouseInElement/)

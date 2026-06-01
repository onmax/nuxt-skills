# useElementBounding

Reactive bounding box of an HTML element

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useElementBounding } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)
</script>

<template>
  <div ref="el" />
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| reset | `boolean` | true | Reset values to 0 on component unmounted |
| windowResize | `boolean` | true | Listen to window resize event |
| windowScroll | `boolean` | true | Listen to window scroll event |
| immediate | `boolean` | true | Immediately call update on component mounted |

## Returns

| Name | Type |
| --- | --- |
| height | `shallowRef` |
| bottom | `shallowRef` |
| left | `shallowRef` |
| right | `shallowRef` |
| top | `shallowRef` |
| width | `shallowRef` |
| x | `shallowRef` |
| y | `shallowRef` |
| update | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useElementBounding/)

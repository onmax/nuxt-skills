# useDraggable

Make elements draggable.

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
})
</script>

<template>
  <div ref="el" :style="style" style="position: fixed">
    Drag me! I am at {{ x }}, {{ y }}
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| exact | `MaybeRefOrGetter&lt;boolean&gt;` | false | Only start the dragging when click on the element directly |
| preventDefault | `MaybeRefOrGetter&lt;boolean&gt;` | false | Prevent events defaults |
| stopPropagation | `MaybeRefOrGetter&lt;boolean&gt;` | false | Prevent events propagation |
| capture | `boolean` | true | Whether dispatch events in capturing phase |
| draggingElement | `MaybeRefOrGetter&lt;HTMLElement \| SVGElement \| Window \| Document \| null \| undefined&gt;` | window | Element to attach `pointermove` and `pointerup` events to. |
| containerElement | `MaybeRefOrGetter&lt;HTMLElement \| SVGElement \| null \| undefined&gt;` | undefined | Element for calculating bounds (If not set, it will use the event's target). |
| handle | `MaybeRefOrGetter&lt;HTMLElement \| SVGElement \| null \| undefined&gt;` | target | Handle that triggers the drag event |
| pointerTypes | `PointerType[]` | [ | Pointer types that listen to. |

## Returns

| Name | Type |
| --- | --- |
| position | `deepRef&lt;Position&gt;` |
| isDragging | `Ref` |
| style | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useDraggable/)

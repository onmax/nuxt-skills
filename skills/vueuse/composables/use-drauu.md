# useDrauu

Reactive instance for drauu.

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
<script setup lang="ts">
import { toRefs } from '@vueuse/core'
import { useDrauu } from '@vueuse/integrations/useDrauu'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const { undo, redo, canUndo, canRedo, brush } = useDrauu(target)
const { color, size } = toRefs(brush)
</script>

<template>
  <svg ref="target" />
</template>
```

## Returns

| Name | Type |
| --- | --- |
| drauuInstance | `deepRef&lt;Drauu&gt;` |
| load | `Ref` |
| dump | `Ref` |
| clear | `Ref` |
| cancel | `Ref` |
| undo | `Ref` |
| redo | `Ref` |
| canUndo | `shallowRef` |
| canRedo | `shallowRef` |
| brush | `deepRef&lt;Brush&gt;` |
| onChanged | `Ref` |
| onCommitted | `Ref` |
| onStart | `Ref` |
| onEnd | `Ref` |
| onCanceled | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useDrauu/)

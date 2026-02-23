# usePointerSwipe

Reactive swipe detection based on PointerEvents.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { usePointerSwipe } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isSwiping, direction } = usePointerSwipe(el)
</script>

<template>
  <div ref="el">
    Swipe here
  </div>
</template>
```

## Options

| Option            | Type                                                         | Default | Description                      |
| ----------------- | ------------------------------------------------------------ | ------- | -------------------------------- |
| threshold         | `number`                                                     | 50      | @default 50                      |
| onSwipeStart      | `(e: PointerEvent) =&gt; void`                               | -       | Callback on swipe start.         |
| onSwipe           | `(e: PointerEvent) =&gt; void`                               | -       | Callback on swipe move.          |
| onSwipeEnd        | `(e: PointerEvent, direction: UseSwipeDirection) =&gt; void` | -       | Callback on swipe end.           |
| pointerTypes      | `PointerType[]`                                              | [       | Pointer types to listen to.      |
| disableTextSelect | `boolean`                                                    | false   | Disable text selection on swipe. |

## Returns

| Name      | Type                       |
| --------- | -------------------------- |
| isSwiping | `shallowRef`               |
| direction | `computed`                 |
| posStart  | `reactive&lt;Position&gt;` |
| posEnd    | `reactive&lt;Position&gt;` |
| distanceX | `computed`                 |
| distanceY | `computed`                 |
| stop      | `Ref`                      |

## Reference

[VueUse Docs](https://vueuse.org/core/usePointerSwipe/)

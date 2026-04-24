# useSwipe

Reactive swipe detection based on .

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useSwipe } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isSwiping, direction } = useSwipe(el)
</script>

<template>
  <div ref="el">
    Swipe here
  </div>
</template>
```

## Options

| Option       | Type                                                       | Default | Description                |
| ------------ | ---------------------------------------------------------- | ------- | -------------------------- |
| passive      | `boolean`                                                  | true    | Register events as passive |
| threshold    | `number`                                                   | 50      | @default 50                |
| onSwipeStart | `(e: TouchEvent) =&gt; void`                               | -       | Callback on swipe start    |
| onSwipe      | `(e: TouchEvent) =&gt; void`                               | -       | Callback on swipe moves    |
| onSwipeEnd   | `(e: TouchEvent, direction: UseSwipeDirection) =&gt; void` | -       | Callback on swipe ends     |

## Returns

| Name        | Type                       |
| ----------- | -------------------------- |
| isSwiping   | `shallowRef`               |
| direction   | `computed`                 |
| coordsStart | `reactive&lt;Position&gt;` |
| coordsEnd   | `reactive&lt;Position&gt;` |
| lengthX     | `Ref`                      |
| lengthY     | `Ref`                      |
| stop        | `Ref`                      |

## Reference

[VueUse Docs](https://vueuse.org/core/useSwipe/)

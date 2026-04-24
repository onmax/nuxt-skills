# useScroll

Reactive scroll position and state.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { x, y, isScrolling, arrivedState, directions } = useScroll(el)
</script>

<template>
  <div ref="el" />
</template>
```

## Options

| Option   | Type     | Default | Description                                               |
| -------- | -------- | ------- | --------------------------------------------------------- |
| throttle | `number` | 0       | Throttle time for scroll event, it’s disabled by default. |
| idle     | `number` | 200     | The check time when scrolling ends.                       |
| offset   | `{`      | -       | Offset arrived states by x pixels                         |

## Returns

| Name         | Type         |
| ------------ | ------------ |
| x            | `computed`   |
| y            | `computed`   |
| isScrolling  | `shallowRef` |
| arrivedState | `reactive`   |
| directions   | `reactive`   |

## Reference

[VueUse Docs](https://vueuse.org/core/useScroll/)

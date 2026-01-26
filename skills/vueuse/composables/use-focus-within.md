# useFocusWithin

Reactive utility to track if an element or one of its decendants has focus. It is meant to match the behavior of the CSS pseudo-class. A common use case would be on a form element to see if any of its inputs currently have focus.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useFocusWithin } from '@vueuse/core'
import { ref, watch } from 'vue'

const target = ref()
const { focused } = useFocusWithin(target)

watch(focused, (focused) => {
  if (focused)
    console.log('Target contains the focused element')
  else
    console.log('Target does NOT contain the focused element')
})
</script>

<template>
  <form ref="target">
    <input type="text" placeholder="First Name">
    <input type="text" placeholder="Last Name">
    <input type="text" placeholder="Email">
    <input type="text" placeholder="Password">
  </form>
</template>
```

## Returns

| Name    | Type       |
| ------- | ---------- |
| focused | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useFocusWithin/)

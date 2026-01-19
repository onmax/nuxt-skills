# useTextareaAutosize

Automatically update the height of a textarea depending on the content.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea, input } = useTextareaAutosize()
</script>

<template>
  <textarea
    ref="textarea"
    v-model="input"
    class="resize-none"
    placeholder="What's on your mind?"
  />
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/useTextareaAutosize/)

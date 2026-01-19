# useScrollLock

Lock scrolling of the element.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const isLocked = useScrollLock(el)

isLocked.value = true // lock
isLocked.value = false // unlock
</script>

<template>
  <div ref="el" />
</template>
```

## Reference

[VueUse Docs](https://vueuse.org/core/useScrollLock/)

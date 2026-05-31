# useParallax

Create parallax effect easily. It uses and fallback to if orientation is not supported.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
<script setup lang="ts">
import { useParallax } from '@vueuse/core'

const container = ref(null)
const { tilt, roll, source } = useParallax(container)
</script>

<template>
  <div ref="container" />
</template>
```

## Returns

| Name   | Type       |
| ------ | ---------- |
| roll   | `computed` |
| tilt   | `computed` |
| source | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useParallax/)

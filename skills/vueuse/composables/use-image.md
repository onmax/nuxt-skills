# useImage

Reactive load an image in the browser, you can wait the result to display it or show a fallback.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
<script setup lang="ts">
import { useImage } from '@vueuse/core'

const avatarUrl = 'https://place.dog/300/200'
const { isLoading } = useImage({ src: avatarUrl })
</script>

<template>
  <span v-if="isLoading">Loading</span>
  <img v-else :src="avatarUrl">
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| src | `string` | - |  |
| srcset | `string` | - |  |
| sizes | `string` | - |  |
| alt | `string` | - |  |
| class | `string` | - |  |
| loading | `HTMLImageElement['loading']` | - |  |
| crossorigin | `string` | - |  |
| referrerPolicy | `HTMLImageElement['referrerPolicy']` | - |  |
| width | `HTMLImageElement['width']` | - |  |
| height | `HTMLImageElement['height']` | - |  |
| decoding | `HTMLImageElement['decoding']` | - |  |
| fetchPriority | `HTMLImageElement['fetchPriority']` | - |  |
| ismap | `HTMLImageElement['isMap']` | - |  |
| usemap | `HTMLImageElement['useMap']` | - |  |

## Reference

[VueUse Docs](https://vueuse.org/core/useImage/)

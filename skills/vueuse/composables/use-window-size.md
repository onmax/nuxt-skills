# useWindowSize

Reactive window size

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width, height } = useWindowSize()
</script>

<template>
  <div>
    Width: {{ width }}
    Height: {{ height }}
  </div>
</template>
```

## Options

| Option            | Type                             | Default | Description                                                               |
| ----------------- | -------------------------------- | ------- | ------------------------------------------------------------------------- |
| listenOrientation | `boolean`                        | true    | Listen to window `orientationchange` event                                |
| includeScrollbar  | `boolean`                        | true    | Whether the scrollbar should be included in the width and height          |
| type              | `'inner' \| 'outer' \| 'visual'` | inner   | Use `window.innerWidth` or `window.outerWidth` or `window.visualViewport` |

## Returns

| Name   | Type         |
| ------ | ------------ |
| width  | `shallowRef` |
| height | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useWindowSize/)

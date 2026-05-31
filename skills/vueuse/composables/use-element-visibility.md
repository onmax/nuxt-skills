# useElementVisibility

Tracks the visibility of an element within the viewport.

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const targetIsVisible = useElementVisibility(target)

const target2 = useTemplateRef('target2')
const targetVisibilityController = useElementVisibility(target2, { controls: true })
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>

  <div ref="target2">
    <h1>Hi there</h1>
  </div>
</template>
```

## Options

| Option       | Type                                     | Default | Description                                                                     |
| ------------ | ---------------------------------------- | ------- | ------------------------------------------------------------------------------- |
| initialValue | `boolean`                                | false   | Initial value.                                                                  |
| scrollTarget | `UseIntersectionObserverOptions['root']` | -       | The element that is used as the viewport for checking visibility of the target. |
| once         | `boolean`                                | false   | Stop tracking when element visibility changes for the first time                |
| controls     | `Controls`                               | false   | Expose more controls                                                            |

## Reference

[VueUse Docs](https://vueuse.org/core/useElementVisibility/)

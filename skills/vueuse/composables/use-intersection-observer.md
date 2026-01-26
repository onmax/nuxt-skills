# useIntersectionObserver

Detects that a target element's visibility.

**Package:** `@vueuse/core`
**Category:** Elements

## Usage

```ts
<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const target = useTemplateRef('target')
const targetIsVisible = shallowRef(false)

const { stop } = useIntersectionObserver(
  target,
  ([entry], observerElement) => {
    targetIsVisible.value = entry?.isIntersecting || false
  },
)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| immediate | `boolean` | true | Start the IntersectionObserver immediately on creation |
| root | `MaybeComputedElementRef \| Document` | - | The Element or Document whose bounds are used as the bounding box when testing for intersection. |
| rootMargin | `MaybeRefOrGetter&lt;string&gt;` | - | A string which specifies a set of offsets to add to the root's bounding_box when calculating intersections. |
| threshold | `number \| number[]` | 0 | Either a single number or an array of numbers between 0.0 and 1. |

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| isActive | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useIntersectionObserver/)

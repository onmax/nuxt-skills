# useAnimate

Reactive Web Animations API.

**Package:** `@vueuse/core`
**Category:** Animation

## Usage

```ts
<script setup lang="ts">
import { useAnimate } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const {
  isSupported,
  animate,

  // actions
  play,
  pause,
  reverse,
  finish,
  cancel,

  // states
  pending,
  playState,
  replaceState,
  startTime,
  currentTime,
  timeline,
  playbackRate,
} = useAnimate(el, { transform: 'rotate(360deg)' }, 1000)
</script>

<template>
  <span ref="el" style="display:inline-block">useAnimate</span>
</template>
```

## Options

| Option       | Type                              | Default | Description                                                                            |
| ------------ | --------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| immediate    | `boolean`                         | true    | Will automatically run play when `useAnimate` is used                                  |
| commitStyles | `boolean`                         | false   | Whether to commits the end styling state of an animation to the element being animated |
| persist      | `boolean`                         | false   | Whether to persists the animation                                                      |
| onReady      | `(animate: Animation) =&gt; void` | -       | Executed after animation initialization                                                |
| onError      | `(e: unknown) =&gt; void`         | -       | Callback when error is caught.                                                         |

## Returns

| Name         | Type                                             |
| ------------ | ------------------------------------------------ |
| isSupported  | `useSupported`                                   |
| animate      | `shallowRef&lt;Animation \| undefined&gt;`       |
| pause        | `Ref`                                            |
| reverse      | `Ref`                                            |
| finish       | `Ref`                                            |
| cancel       | `Ref`                                            |
| playState    | `computed`                                       |
| replaceState | `computed`                                       |
| startTime    | `computed&lt;CSSNumberish \| number \| null&gt;` |
| currentTime  | `computed`                                       |
| timeline     | `computed`                                       |
| playbackRate | `computed`                                       |

## Reference

[VueUse Docs](https://vueuse.org/core/useAnimate/)

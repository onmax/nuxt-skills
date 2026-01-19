# useTransition

Transition between values

**Package:** `@vueuse/core`
**Category:** Animation

## Usage

```ts
import { TransitionPresets, useTransition } from '@vueuse/core'
import { shallowRef } from 'vue'

const source = shallowRef(0)

const output = useTransition(source, {
  duration: 1000,
  easing: TransitionPresets.easeInOutCubic,
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useTransition/)

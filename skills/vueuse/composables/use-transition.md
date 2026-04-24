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

## Options

| Option     | Type                      | Default | Description                                     |
| ---------- | ------------------------- | ------- | ----------------------------------------------- |
| delay      | `MaybeRef&lt;number&gt;`  | -       | Milliseconds to wait before starting transition |
| disabled   | `MaybeRef&lt;boolean&gt;` | -       | Disables the transition                         |
| onFinished | `() =&gt; void`           | -       | Callback to execute after transition finishes   |
| onStarted  | `() =&gt; void`           | -       | Callback to execute after transition starts     |

## Reference

[VueUse Docs](https://vueuse.org/core/useTransition/)

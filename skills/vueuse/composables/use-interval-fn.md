# useIntervalFn

Wrapper for with controls

**Package:** `@vueuse/shared`
**Category:** Animation

## Usage

```ts
import { useIntervalFn } from '@vueuse/core'

const { pause, resume, isActive } = useIntervalFn(() => {
  /* your function */
}, 1000)
```

## Options

| Option            | Type      | Default | Description                                             |
| ----------------- | --------- | ------- | ------------------------------------------------------- |
| immediate         | `boolean` | true    | Start the timer immediately                             |
| immediateCallback | `boolean` | false   | Execute the callback immediately after calling `resume` |

## Returns

| Name     | Type         |
| -------- | ------------ |
| isActive | `shallowRef` |
| pause    | `Ref`        |
| resume   | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useIntervalFn/)

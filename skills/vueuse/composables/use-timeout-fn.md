# useTimeoutFn

Wrapper for with controls.

**Package:** `@vueuse/shared`
**Category:** Animation

## Usage

```ts
import { useTimeoutFn } from '@vueuse/core'

const { isPending, start, stop } = useTimeoutFn(() => {
  /* ... */
}, 3000)
```

## Options

| Option            | Type      | Default | Description                                            |
| ----------------- | --------- | ------- | ------------------------------------------------------ |
| immediate         | `boolean` | true    | Start the timer immediately                            |
| immediateCallback | `boolean` | false   | Execute the callback immediately after calling `start` |

## Returns

| Name      | Type         |
| --------- | ------------ |
| isPending | `shallowRef` |
| start     | `Ref`        |
| stop      | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useTimeoutFn/)

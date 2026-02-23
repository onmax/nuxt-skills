# usePointer

Reactive pointer state.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { usePointer } from '@vueuse/core'

const { x, y, pressure, pointerType } = usePointer()
```

## Options

| Option       | Type                                                                     | Default | Description                   |
| ------------ | ------------------------------------------------------------------------ | ------- | ----------------------------- |
| pointerTypes | `PointerType[]`                                                          | [       | Pointer types that listen to. |
| initialValue | `MaybeRef&lt;Partial&lt;UsePointerState&gt;&gt;`                         | -       | Initial values                |
| target       | `MaybeRef&lt;EventTarget \| null \| undefined&gt; \| Document \| Window` | window  | @default window               |

## Returns

| Name     | Type         |
| -------- | ------------ |
| isInside | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/usePointer/)

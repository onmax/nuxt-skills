# useBase64

Reactive base64 transforming. Supports plain text, buffer, files, canvas, objects, maps, sets and images.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useBase64 } from '@vueuse/core'
import { shallowRef } from 'vue'

const text = shallowRef('')

const { base64 } = useBase64(text)
```

## Options

| Option  | Type      | Default | Description               |
| ------- | --------- | ------- | ------------------------- |
| dataUrl | `boolean` | true    | Output as Data URL format |

## Returns

| Name    | Type         |
| ------- | ------------ |
| base64  | `shallowRef` |
| promise | `Ref`        |
| execute | `Ref`        |

## Reference

[VueUse Docs](https://vueuse.org/core/useBase64/)

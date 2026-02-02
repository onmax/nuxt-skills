# useEyeDropper

Reactive EyeDropper API

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useEyeDropper } from '@vueuse/core'

const { isSupported, open, sRGBHex } = useEyeDropper()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| initialValue | `string` | - | Initial sRGBHex. |

## Returns

| Name | Type |
| --- | --- |
| isSupported | `useSupported` |
| sRGBHex | `shallowRef` |
| open | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useEyeDropper/)

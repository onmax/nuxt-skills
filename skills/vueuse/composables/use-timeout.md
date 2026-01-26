# useTimeout

Reactive value that becomes after a given time.

**Package:** `@vueuse/shared`
**Category:** Animation

## Usage

```ts
import { useTimeout } from '@vueuse/core'

const ready = useTimeout(1000)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| controls | `Controls` | false | Expose more controls |
| callback | `Fn` | - | Callback on timeout |

## Returns

| Name | Type |
| --- | --- |
| ready | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useTimeout/)

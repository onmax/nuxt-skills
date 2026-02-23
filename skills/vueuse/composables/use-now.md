# useNow

Reactive current Date instance.

**Package:** `@vueuse/core`
**Category:** Animation

## Usage

```ts
import { useNow } from '@vueuse/core'

const now = useNow()
```

## Options

| Option    | Type                                | Default               | Description                                                   |
| --------- | ----------------------------------- | --------------------- | ------------------------------------------------------------- |
| controls  | `Controls`                          | false                 | Expose more controls                                          |
| immediate | `boolean`                           | true                  | Start the clock immediately                                   |
| interval  | `'requestAnimationFrame' \| number` | requestAnimationFrame | Update interval in milliseconds, or use requestAnimationFrame |

## Returns

| Name | Type      |
| ---- | --------- |
| now  | `deepRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useNow/)

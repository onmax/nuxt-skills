# useTimestamp

Reactive current timestamp

**Package:** `@vueuse/core`
**Category:** Animation

## Usage

```ts
import { useTimestamp } from '@vueuse/core'

const timestamp = useTimestamp({ offset: 0 })
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| controls | `Controls` | false | Expose more controls |
| offset | `number` | 0 | Offset value adding to the value |
| immediate | `boolean` | true | Update the timestamp immediately |
| interval | `'requestAnimationFrame' \| number` | requestAnimationFrame | Update interval, or use requestAnimationFrame |
| callback | `(timestamp: number) =&gt; void` | - | Callback on each update |

## Returns

| Name | Type |
| --- | --- |
| timestamp | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useTimestamp/)

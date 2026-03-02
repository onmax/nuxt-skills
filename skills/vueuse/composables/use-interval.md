# useInterval

Reactive counter that increases on every interval.

**Package:** `@vueuse/shared`
**Category:** Animation

## Usage

```ts
import { useInterval } from '@vueuse/core'

// count will increase every 200ms
const counter = useInterval(200)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| controls | `Controls` | false | Expose more controls |
| immediate | `boolean` | true | Execute the update immediately on calling |
| callback | `(count: number) =&gt; void` | - | Callback on every interval |

## Returns

| Name | Type |
| --- | --- |
| counter | `shallowRef` |
| reset | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useInterval/)

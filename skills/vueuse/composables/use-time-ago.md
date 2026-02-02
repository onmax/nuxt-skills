# useTimeAgo

Reactive time ago. Automatically update the time ago string when the time changes.

**Package:** `@vueuse/core`
**Category:** Time

## Usage

```ts
import { useTimeAgo } from '@vueuse/core'

const timeAgo = useTimeAgo(new Date(2021, 0, 1))
```

## Options

| Option         | Type       | Default | Description                                       |
| -------------- | ---------- | ------- | ------------------------------------------------- |
| controls       | `Controls` | false   | Expose more controls                              |
| updateInterval | `number`   | 30_000  | Intervals to update, set 0 to disable auto update |

## Returns

| Name    | Type       |
| ------- | ---------- |
| timeAgo | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useTimeAgo/)

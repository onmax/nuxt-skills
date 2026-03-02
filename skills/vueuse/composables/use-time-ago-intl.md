# useTimeAgoIntl

Reactive time ago with i18n supported. Automatically update the time ago string when the time changes. Powered by .

**Package:** `@vueuse/core`
**Category:** Time

## Usage

```ts
import { useTimeAgoIntl } from '@vueuse/core'

const timeAgoIntl = useTimeAgoIntl(new Date(2021, 0, 1))
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| controls | `Controls` | false | Expose more controls and the raw `parts` result. |
| updateInterval | `number` | 30_000 | Update interval in milliseconds, set 0 to disable auto update |

## Returns

| Name | Type |
| --- | --- |
| resolvedLocale | `Ref` |
| parts | `computed` |

## Reference

[VueUse Docs](https://vueuse.org/core/useTimeAgoIntl/)

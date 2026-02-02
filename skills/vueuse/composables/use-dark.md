# useDark

Reactive dark mode with auto data persistence.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| valueDark | `string` | dark | Value applying to the target element when isDark=true |
| valueLight | `string` | - | Value applying to the target element when isDark=false |
| onChanged | `(isDark: boolean, defaultHandler: ((mode: BasicColorSchema) =&gt; void), mode: BasicColorSchema) =&gt; void` | undefined | A custom handler for handle the updates. |

## Reference

[VueUse Docs](https://vueuse.org/core/useDark/)

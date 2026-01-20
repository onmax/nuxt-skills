# onKeyStroke

Listen for keyboard keystrokes.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { onKeyStroke } from '@vueuse/core'

onKeyStroke('ArrowDown', (e) => {
  e.preventDefault()
})
```

## Options

| Option | Type                              | Default | Description                                                              |
| ------ | --------------------------------- | ------- | ------------------------------------------------------------------------ |
| dedupe | `MaybeRefOrGetter&lt;boolean&gt;` | false   | Set to `true` to ignore repeated events when the key is being held down. |

## Reference

[VueUse Docs](https://vueuse.org/core/onKeyStroke/)

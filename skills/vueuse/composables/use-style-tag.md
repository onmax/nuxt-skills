# useStyleTag

Inject reactive element in head.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useStyleTag } from '@vueuse/core'

const {
  id,
  css,
  load,
  unload,
  isLoaded,
} = useStyleTag('.foo { margin-top: 32px; }')

// Later you can modify styles
css.value = '.foo { margin-top: 64px; }'
```

## Reference

[VueUse Docs](https://vueuse.org/core/useStyleTag/)

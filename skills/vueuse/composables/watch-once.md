# watchOnce

Shorthand for watching value with . Once the callback fires once, the watcher will be stopped. See Vue's docs for full details.

**Package:** `@vueuse/shared`
**Category:** Watch

## Usage

```ts
import { watchOnce } from '@vueuse/core'

watchOnce(source, () => {
  // triggers only once
  console.log('source changed!')
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/watchOnce/)

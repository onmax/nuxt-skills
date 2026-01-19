# useEventListener

Use EventListener with ease. Register using addEventListener on mounted, and removeEventListener automatically on unmounted.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useEventListener } from '@vueuse/core'

useEventListener(document, 'visibilitychange', (evt) => {
  console.log(evt)
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useEventListener/)

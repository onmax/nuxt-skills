# useScriptTag

Creates a script tag, with support for automatically unloading (deleting) the script tag on unmount.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useScriptTag } from '@vueuse/core'

useScriptTag(
  'https://player.twitch.tv/js/embed/v1.js',
  // on script tag loaded.
  (el: HTMLScriptElement) => {
    // do something
  },
)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useScriptTag/)

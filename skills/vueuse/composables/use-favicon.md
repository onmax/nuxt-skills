# useFavicon

Reactive favicon

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useFavicon } from '@vueuse/core'
// ---cut---
const source = shallowRef('icon.png')
const icon = useFavicon(source)

console.log(icon === source) // true
```

## Reference

[VueUse Docs](https://vueuse.org/core/useFavicon/)

# useSupported

SSR compatibility

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useSupported } from '@vueuse/core'

const isSupported = useSupported(() => navigator && 'getBattery' in navigator)

if (isSupported.value) {
  // do something
  navigator.getBattery
}
```

## Reference

[VueUse Docs](https://vueuse.org/core/useSupported/)

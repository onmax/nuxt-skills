# useMediaQuery

Reactive Media Query. Once you've created a MediaQueryList object, you can check the result of the query or receive notifications when the result changes.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useMediaQuery } from '@vueuse/core'

const isLargeScreen = useMediaQuery('(min-width: 1024px)')
const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
```

## Reference

[VueUse Docs](https://vueuse.org/core/useMediaQuery/)

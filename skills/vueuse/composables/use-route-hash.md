# useRouteHash

Shorthand for a reactive .

**Package:** `@vueuse/router`
**Category:** '@Router'

## Usage

```ts
import { useRouteHash } from '@vueuse/router'

const search = useRouteHash()

console.log(search.value) // route.hash
search.value = 'foobar' // router.replace({ hash: 'foobar' })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useRouteHash/)

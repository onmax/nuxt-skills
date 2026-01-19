# useRouteQuery

Shorthand for a reactive .

**Package:** `@vueuse/router`
**Category:** '@Router'

## Usage

```ts
import { useRouteQuery } from '@vueuse/router'

const search = useRouteQuery('search')

const search = useRouteQuery('search', 'foo') // or with a default value

const page = useRouteQuery('page', '1', { transform: Number }) // or transforming value

console.log(search.value) // route.query.search
search.value = 'foobar' // router.replace({ query: { search: 'foobar' } })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useRouteQuery/)

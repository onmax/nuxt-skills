# useRouteParams

Shorthand for a reactive .

**Package:** `@vueuse/router`
**Category:** '@Router'

## Usage

```ts
import { useRouteParams } from '@vueuse/router'

const userId = useRouteParams('userId')

const userId = useRouteParams('userId', '-1') // or with a default value

const userId = useRouteParams('page', '1', { transform: Number }) // or transforming value

console.log(userId.value) // route.params.userId
userId.value = '100' // router.replace({ params: { userId: '100' } })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useRouteParams/)

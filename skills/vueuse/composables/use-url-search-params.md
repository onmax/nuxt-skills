# useUrlSearchParams

Reactive URLSearchParams

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('history')

console.log(params.foo) // 'bar'

params.foo = 'bar'
params.vueuse = 'awesome'
// url updated to `?foo=bar&vueuse=awesome`
```

## Reference

[VueUse Docs](https://vueuse.org/core/useUrlSearchParams/)

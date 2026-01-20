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

## Options

| Option              | Type      | Default | Description    |
| ------------------- | --------- | ------- | -------------- |
| removeNullishValues | `boolean` | true    | @default true  |
| removeFalsyValues   | `boolean` | false   | @default false |

## Reference

[VueUse Docs](https://vueuse.org/core/useUrlSearchParams/)

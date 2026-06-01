# useBreakpoints

Reactive viewport breakpoints.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const smAndLarger = breakpoints.greaterOrEqual('sm') // sm and larger
const largerThanSm = breakpoints.greater('sm') // only larger than sm
const lgAndSmaller = breakpoints.smallerOrEqual('lg') // lg and smaller
const smallerThanLg = breakpoints.smaller('lg') // only smaller than lg
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| strategy | `'min-width' \| 'max-width'` | min-width | The query strategy to use for the generated shortcut methods like `.lg` |

## Reference

[VueUse Docs](https://vueuse.org/core/useBreakpoints/)

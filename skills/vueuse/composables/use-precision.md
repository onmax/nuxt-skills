# usePrecision

Reactively set the precision of a number.

**Package:** `@vueuse/math`
**Category:** '@Math'

## Usage

```ts
import { usePrecision } from '@vueuse/math'

const value = ref(3.1415)
const result = usePrecision(value, 2) // 3.14

const ceilResult = usePrecision(value, 2, {
  math: 'ceil'
}) // 3.15

const floorResult = usePrecision(value, 3, {
  math: 'floor'
}) // 3.141
```

## Options

| Option | Type                           | Default | Description                |
| ------ | ------------------------------ | ------- | -------------------------- |
| math   | `'floor' \| 'ceil' \| 'round'` | round   | Method to use for rounding |

## Reference

[VueUse Docs](https://vueuse.org/core/usePrecision/)

# useToNumber

Reactively convert a string ref to number.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { useToNumber } from '@vueuse/core'
import { shallowRef } from 'vue'

const str = shallowRef('123')
const number = useToNumber(str)

number.value // 123
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| method | `'parseFloat' \| 'parseInt' \| ((value: string \| number) =&gt; number)` | parseFloat | Method to use to convert the value to a number. |
| radix | `number` | - | The base in mathematical numeral systems passed to `parseInt`. |
| nanToZero | `boolean` | false | Replace NaN with zero |

## Reference

[VueUse Docs](https://vueuse.org/core/useToNumber/)

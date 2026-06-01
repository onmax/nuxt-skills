# useStepper

Provides helpers for building a multi-step wizard interface.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useStepper } from '@vueuse/core'

const {
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper([
  'billing-address',
  'terms',
  'payment',
])

// Access the step through `current`
console.log(current.value) // 'billing-address'
```

## Returns

| Name | Type |
| --- | --- |
| steps | `Ref` |
| stepNames | `computed&lt;any[]&gt;` |
| index | `deepRef` |
| current | `computed` |
| next | `computed` |
| previous | `computed` |
| isFirst | `computed` |
| isLast | `computed` |
| at | `Ref` |
| get | `Ref` |
| goTo | `Ref` |
| goToNext | `Ref` |
| goToPrevious | `Ref` |
| goBackTo | `Ref` |
| isNext | `Ref` |
| isPrevious | `Ref` |
| isCurrent | `Ref` |
| isBefore | `Ref` |
| isAfter | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useStepper/)

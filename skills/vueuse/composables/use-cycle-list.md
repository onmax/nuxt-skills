# useCycleList

Cycle through a list of items.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useCycleList } from '@vueuse/core'

const { state, next, prev, go } = useCycleList([
  'Dog',
  'Cat',
  'Lizard',
  'Shark',
  'Whale',
  'Dolphin',
  'Octopus',
  'Seal',
])

console.log(state.value) // 'Dog'

prev()

console.log(state.value) // 'Seal'

go(3)

console.log(state.value) // 'Shark'
```

## Options

| Option        | Type                                 | Default | Description                                            |
| ------------- | ------------------------------------ | ------- | ------------------------------------------------------ |
| initialValue  | `MaybeRef&lt;T&gt;`                  | -       | The initial value of the state.                        |
| fallbackIndex | `number`                             | -       | The default index when                                 |
| getIndexOf    | `(value: T, list: T[]) =&gt; number` | -       | Custom function to get the index of the current value. |

## Returns

| Name  | Type                     |
| ----- | ------------------------ |
| state | `shallowRef`             |
| index | `computed&lt;number&gt;` |
| next  | `Ref`                    |
| prev  | `Ref`                    |
| go    | `Ref`                    |

## Reference

[VueUse Docs](https://vueuse.org/core/useCycleList/)

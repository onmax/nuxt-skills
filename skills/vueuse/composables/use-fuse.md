# useFuse

Easily implement fuzzy search using a composable with Fuse.js.

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
import { useFuse } from '@vueuse/integrations/useFuse'
import { shallowRef } from 'vue'

const data = [
  'John Smith',
  'John Doe',
  'Jane Doe',
  'Phillip Green',
  'Peter Brown',
]

const input = shallowRef('Jhon D')

const { results } = useFuse(input, data)

/*
 * Results:
 *
 * { "item": "John Doe", "index": 1 }
 * { "item": "John Smith", "index": 0 }
 * { "item": "Jane Doe", "index": 2 }
 *
 */
```

## Returns

| Name | Type |
| --- | --- |
| fuse | `deepRef` |
| results | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useFuse/)

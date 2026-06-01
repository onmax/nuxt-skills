# syncRefs

Keep target refs in sync with a source ref

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { syncRefs } from '@vueuse/core'
import { shallowRef } from 'vue'

const source = shallowRef('hello')
const target = shallowRef('target')

const stop = syncRefs(source, target)

console.log(target.value) // hello

source.value = 'foo'

console.log(target.value) // foo
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| deep | `boolean` | false | Watch deeply |
| immediate | `boolean` | true | Sync values immediately |

## Reference

[VueUse Docs](https://vueuse.org/core/syncRefs/)

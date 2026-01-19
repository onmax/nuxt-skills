# useVModels

Shorthand for props v-model binding. Think it like but changes will also trigger emit.

**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
import { useVModels } from '@vueuse/core'

const props = defineProps({
  foo: string,
  bar: number,
})

const emit = defineEmits(['update:foo', 'update:bar'])

const { foo, bar } = useVModels(props, emit)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useVModels/)

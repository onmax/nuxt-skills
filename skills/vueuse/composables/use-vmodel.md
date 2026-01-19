# useVModel

Shorthand for v-model binding, props + emit -> ref

**Package:** `@vueuse/core`
**Category:** Component

## Usage

```ts
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue'])

const data = useVModel(props, 'modelValue', emit)
```

## Reference

[VueUse Docs](https://vueuse.org/core/useVModel/)

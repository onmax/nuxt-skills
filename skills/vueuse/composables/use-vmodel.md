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

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| passive | `Passive` | false | When passive is set to `true`, it will use `watch` to sync with props and ref. |
| eventName | `string` | undefined | When eventName is set, it's value will be used to overwrite the emit event name. |
| deep | `boolean` | false | Attempting to check for changes of properties in a deeply nested object or array. |
| defaultValue | `T` | undefined | Defining default value for return ref when no value is passed. |
| clone | `boolean \| CloneFn&lt;T&gt;` | false | Clone the props. |
| shouldEmit | `(v: T) =&gt; boolean` | undefined | The hook before triggering the emit event can be used for form validation. |

## Reference

[VueUse Docs](https://vueuse.org/core/useVModel/)

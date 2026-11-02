# Extensions Reference

Register custom field types and visualization types to extend nuxt-protokit beyond its built-ins.

## `defineProtokitExtension`

```ts
import { defineProtokitExtension } from '@websideproject/nuxt-protokit'

const myExtension = defineProtokitExtension({
  namespace: 'myapp',         // required, must be unique — not 'proto', 'protokit', 'nuxt', or 'vue'
  fields?: {
    'field-name': {
      component: MyFieldComponent,   // Vue component or async import
    },
  },
  vizTypes?: {
    'viz-name': {
      component: MyVizComponent,
    },
  },
})
```

The `namespace` + `name` form the full type string: `'myapp:field-name'` or `'myapp:viz-name'`.

---

## Custom Field Type

### 1. Define the component

```vue
<!-- components/MyRatingStars.vue -->
<script setup>
const props = defineProps<{
  modelValue: number
  fieldDef: any     // the FieldDef from schema.fields
  disabled?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: number] }>()
</script>

<template>
  <div class="flex gap-1">
    <button v-for="n in 10" :key="n" @click="emit('update:modelValue', n)"
            :class="n <= props.modelValue ? 'text-yellow-400' : 'text-gray-200'">
      ★
    </button>
  </div>
</template>
```

### 2. Register the extension

```ts
// plugins/protokit-extensions.ts (Nuxt plugin)
import { defineProtokitExtension } from '@websideproject/nuxt-protokit'
import MyRatingStars from '~/components/MyRatingStars.vue'

export const extension = defineProtokitExtension({
  namespace: 'myapp',
  fields: {
    'rating-stars': {
      component: MyRatingStars,
      // Async import also supported:
      // component: () => import('~/components/MyRatingStars.vue'),
    },
  },
})
```

### 3. Register with the module

```ts
// nuxt.config.ts — via hook
export default defineNuxtConfig({
  hooks: {
    'protokit:register-extension': ({ addComponentsDir, addImportsDir }) => {
      // For extensions defined in a separate Nuxt module
    }
  }
})
```

Or provide the extension at the app level via `useProtoExtensionRegistry()`:

```ts
// composables/useExtensions.ts
import { useProtoExtensionRegistry } from '@websideproject/nuxt-protokit'

const { register } = useProtoExtensionRegistry()
register(extension)
```

### 4. Use in schema

```ts
fields: {
  satisfaction: {
    type: 'myapp:rating-stars',   // 'namespace:field-name'
    label: 'Customer Satisfaction',
    default: 0,
    props: { maxStars: 10 },      // passed as component props
  },
}
```

---

## Custom Viz Type

### 1. Define the component

```vue
<!-- components/MyHeatmap.vue -->
<script setup>
const props = defineProps<{
  def: any          // the VizDef from schema.visualizations
  ctx: any          // ComputeContext
}>()
// Access config via props.def.config
// Access data via props.ctx.fields, props.ctx.collections, etc.
</script>
```

### 2. Register

```ts
defineProtokitExtension({
  namespace: 'myapp',
  vizTypes: {
    heatmap: { component: MyHeatmap },
  },
})
```

### 3. Use in schema

```ts
visualizations: [
  {
    type: 'myapp:heatmap',        // 'namespace:viz-name'
    title: 'Activity Heatmap',
    showWhen: ctx => ctx.collections.events.length > 0,
    config: { colorScale: 'green', bucketSize: 'week' },  // any shape
  },
]
```

---

## Reserved Namespaces

These namespaces are reserved and will throw an error in development if used:

- `proto`
- `protokit`
- `nuxt`
- `vue`

Use a unique namespace based on your package or app name.

---

## Async Components

Extensions support async (lazy-loaded) components:

```ts
fields: {
  'rich-editor': {
    component: () => import('~/components/RichEditor.vue'),
  },
}
```

nuxt-protokit wraps these with `defineAsyncComponent` automatically.

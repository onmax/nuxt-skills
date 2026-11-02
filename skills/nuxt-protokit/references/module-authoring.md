# Module Authoring with nuxt-protokit

How to ship nuxt-protokit extensions — custom field types and custom viz types — inside a reusable Nuxt module.

---

## How It Works

nuxt-protokit exposes the `protokit:register-extension` hook. During module setup it calls this hook synchronously, passing `addComponentsDir` and `addImportsDir`. Your module hooks into it to register the directories containing your custom Vue components and composables. They become globally available (auto-imported) in the host app alongside protokit's built-ins.

At runtime, the host app calls `useProtoExtensionRegistry().registerExtension(ext)` (in a plugin) to wire the custom types to their components.

---

## Two Approaches

### Approach A: Module provides components only (simpler)

The module exposes components and composables via the hook. The host app calls `defineProtokitExtension` and `registerExtension` in its own plugin.

**Best for:** distributing components as a package; the host controls the namespace.

### Approach B: Module registers the extension itself (batteries-included)

The module registers components via the hook AND ships a Nuxt plugin that calls `registerExtension` automatically.

**Best for:** fully self-contained feature modules with a fixed namespace.

---

## Directory Structure

```
modules/my-charts/
├── module.ts                      # defineNuxtModule — hooks into protokit:register-extension
└── runtime/
    ├── plugin.ts                  # Nuxt plugin — calls registerExtension at runtime
    ├── components/
    │   ├── MyChartField.vue       # Custom field component
    │   └── MyHeatmapViz.vue       # Custom viz component
    └── composables/
        └── useMyChartHelpers.ts   # Optional composables auto-imported by host
```

---

## `module.ts` — Approach B (batteries-included)

```ts
// module.ts
import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export default defineNuxtModule({
  meta: {
    name: '@myorg/module-charts',
    configKey: 'moduleCharts',
  },

  setup(_options, nuxt: Nuxt) {
    const resolver = createResolver(import.meta.url)

    // 1. Register components + composables via the protokit hook
    nuxt.hook('protokit:register-extension' as any, ({ addComponentsDir, addImportsDir }: any) => {
      addComponentsDir(resolver.resolve('./runtime/components'))
      addImportsDir(resolver.resolve('./runtime/composables'))
    })

    // 2. Add a plugin that registers the extension at runtime
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
```

```ts
// runtime/plugin.ts
import { defineNuxtPlugin } from '#app'
import { defineProtokitExtension, useProtoExtensionRegistry } from '@websideproject/nuxt-protokit'
import MyChartField from './components/MyChartField.vue'
import MyHeatmapViz from './components/MyHeatmapViz.vue'

export default defineNuxtPlugin(() => {
  const ext = defineProtokitExtension({
    namespace: 'charts',   // unique namespace — not 'proto', 'protokit', 'nuxt', 'vue'
    fields: {
      'line-sparkline': { component: MyChartField },
    },
    vizTypes: {
      heatmap: { component: MyHeatmapViz },
    },
  })

  const { registerExtension } = useProtoExtensionRegistry()
  registerExtension(ext)
})
```

---

## TypeScript: Augmenting the Hook

Avoid `as any` casts:

```ts
// types/nuxt.d.ts (in your module package)
declare module '@nuxt/schema' {
  interface NuxtHooks {
    'protokit:register-extension': (ctx: {
      addComponentsDir: (dir: string) => void
      addImportsDir: (dir: string) => void
    }) => void | Promise<void>
  }
}
```

---

## Custom Field Component

Receives `modelValue`/`update:modelValue` for two-way binding, plus any keys from `fieldDef.props`.

```vue
<!-- runtime/components/MyChartField.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: number[]      // matches fieldDef.default type
  fieldDef?: any            // the full FieldDef from schema.fields (optional)
  disabled?: boolean
  // additional keys come from fieldDef.props:
  min?: number
  max?: number
  color?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()
</script>

<template>
  <div class="...">
    <!-- your field UI -->
    <button @click="emit('update:modelValue', [...props.modelValue, 0])">
      Add point
    </button>
  </div>
</template>
```

**Usage in schema:**
```ts
fields: {
  sparklineData: {
    type: 'charts:line-sparkline',   // 'namespace:field-name'
    label: 'Trend',
    default: [],
    props: { min: 0, max: 100, color: '#3B82F6' },
  },
}
```

---

## Custom Viz Component

Receives `config` (from `VizDef.config`) and `ctx` (the `ComputeContext`).

```vue
<!-- runtime/components/MyHeatmapViz.vue -->
<script setup lang="ts">
import type { ComputeContext } from '@websideproject/nuxt-protokit'

const props = defineProps<{
  config: Record<string, any>   // VizDef.config, any shape you define
  ctx: ComputeContext           // { fields, derived, connections, collections }
}>()

// config.data is a function that receives ComputeContext
const cells = computed(() => {
  const raw = typeof props.config.data === 'function'
    ? props.config.data(props.ctx)
    : []
  return raw as Array<{ label: string; value: number }>
})
</script>

<template>
  <div class="grid grid-cols-7 gap-1">
    <div v-for="cell in cells" :key="cell.label"
         :style="{ opacity: cell.value / 100 }"
         class="h-4 bg-blue-500 rounded" />
  </div>
</template>
```

**Usage in schema:**
```ts
visualizations: [
  {
    type: 'charts:heatmap',           // 'namespace:viz-name'
    title: 'Activity Heatmap',
    showWhen: ctx => ctx.collections.events.length > 0,
    config: {
      data: ctx => ctx.collections.events.map(e => ({
        label: e.date,
        value: e.count,
      })),
      colorScheme: 'blue',
    },
  },
]
```

---

## Async Components

For large components, use async imports to keep the initial bundle small:

```ts
defineProtokitExtension({
  namespace: 'charts',
  fields: {
    'rich-chart': {
      component: () => import('./components/RichChart.vue'),
    },
  },
})
// nuxt-protokit wraps these with defineAsyncComponent automatically
```

---

## `protokit:register-extension` Hook Context

```ts
{
  addComponentsDir: (dir: string) => void
  // Registers a components dir with global: true — components are auto-imported
  // everywhere in the host app, no explicit import needed

  addImportsDir: (dir: string) => void
  // Registers a composables dir — exports auto-imported in <script setup>
}
```

Both functions call the underlying `@nuxt/kit` helpers with the correct options. `addComponentsDir` uses `global: true`, meaning components don't need to be prefixed with the namespace in templates (they just use their actual Vue file name).

---

## `useProtoExtensionRegistry` — Extension Discovery

In the host app or custom pages, you can query registered extensions:

```ts
const { getFieldComponent, getVizComponent } = useProtoExtensionRegistry()

const FieldComp = getFieldComponent('charts:line-sparkline')  // Component | undefined
const VizComp   = getVizComponent('charts:heatmap')           // Component | undefined
```

---

## Reserved Namespaces

These will throw an error in development if used:

```
proto    protokit    nuxt    vue
```

Use a unique, package-based namespace like your org name or module name.

---

## Module Checklist

1. Hook into `'protokit:register-extension'` to expose components + composables
2. Add a Nuxt plugin that calls `defineProtokitExtension` + `registerExtension`
3. Custom field components: accept `modelValue`/`update:modelValue` + `props.*` keys
4. Custom viz components: accept `config` and `ctx: ComputeContext`
5. Use async `() => import(...)` for large components
6. Namespace must be unique and not reserved
7. Use `resolver.resolve()` (never relative paths) in module setup

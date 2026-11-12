## Plugins and Runtime Boot

### `plugin-use-composables-before-plugin`: Prefer composables/utilities before creating a plugin
**Apply when:** adding shared logic or helpers used by part of the app.
**Skip when:** the integration needs app-level hooks or app-wide injection.

```ts
// Wrong: app/plugins/format.ts runs on every boot just to inject a helper
export default defineNuxtPlugin(() => ({ provide: { formatPrice } }))
```

```ts
// Right: app/utils/format-price.ts, auto-imported where used
export const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
```

**Why:** every plugin runs in the startup and hydration path, so unnecessary plugins add global boot cost.
**Verify:** each plugin is justified by app-wide behavior (injection, app hooks, framework integration), not convenience.

### `plugin-async-parallel-when-independent`: Run async plugins in parallel when they are independent
**Apply when:** several async plugins have no ordering dependency.
**Skip when:** plugin order is required for correctness.

```ts
// app/plugins/analytics.ts
export default defineNuxtPlugin({
  name: 'analytics',
  parallel: true, // later plugins do not wait for this one
  async setup() { await initAnalytics() },
})
```

```ts
// app/plugins/flags.ts: needs the auth plugin's result
export default defineNuxtPlugin({
  name: 'flags',
  dependsOn: ['auth'],
  async setup() { await loadFlags() },
})
```

**Why:** plugins run serially by default; the object syntax supports `parallel` and dependency-aware sequencing.
**Verify:** independent async plugins are `parallel: true` and still have no race conditions; `dependsOn` lists only real dependencies.

### `plugin-order-controls-only-when-necessary`: Use plugin ordering controls sparingly
**Apply when:** you need deterministic plugin execution order.
**Skip when:** the required order cannot be expressed without broad global ordering hacks; rethink the plugin design instead.

```ts
// Wrong: magic numbers to win a race
export default defineNuxtPlugin({ order: -40, setup() { /* ... */ } })
```

```ts
// Right: name the dependency
export default defineNuxtPlugin({ name: 'i18n-sync', dependsOn: ['i18n'], setup() { /* ... */ } })
```

**Why:** `order` overrides `enforce` and becomes a maintenance risk as the plugin graph grows. Prefer default (filename) order, then `dependsOn`, then `order` for rare edge cases.
**Verify:** `enforce`/`dependsOn`/`order` metadata is minimal and each entry has a stated dependency reason.

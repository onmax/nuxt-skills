## Error Surfaces and Recovery

### `error-check-global-and-local-surfaces`: Check both global and local error surfaces
**Apply when:** handling runtime errors, route failures, or fallback UI.
**Skip when:** the issue is intentionally scoped to one surface.

```vue
<!-- app/error.vue (next to app/app.vue): full-page errors (404s, fatal errors, createError during render or navigation, and any error on an HTML request; JSON requests get Nitro's JSON error) -->
<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <h1>{{ error.status }}</h1>
  <button @click="clearError({ redirect: '/' })">Home</button>
</template>
```

```vue
<!-- app/pages/dashboard.vue: a failing widget should not take down the page -->
<template>
  <NuxtErrorBoundary>
    <RevenueChart />
    <template #error="{ error, clearError }">
      <p>{{ error.message }}</p>
      <button @click="clearError">Retry</button>
    </template>
  </NuxtErrorBoundary>
</template>
```

**Why:** Nuxt error handling is often multi-surface. Fixing only `app/error.vue` or only one `<NuxtErrorBoundary>` when the flow needs both is a recurring failure.
**Verify:** trace where the error originates and whether recovery is route-wide or subtree-local, then trigger it and confirm the intended surface renders it.

### `error-use-nuxt-recovery-utilities`: Use Nuxt recovery helpers instead of ad hoc reset logic
**Apply when:** recovering from an error state or clearing error UI.
**Skip when:** the task explicitly requires a non-standard recovery path.

```ts
// Wrong: local flag + navigation; Nuxt's error state stays set
showFallback.value = false
await navigateTo('/')
```

```ts
// Right: enter the error state through Nuxt...
showError({ status: 503, statusText: 'Service Unavailable' })

// ...and leave it later, e.g. from the retry button in app/error.vue
await clearError({ redirect: '/' })
// inside <NuxtErrorBoundary>, call the slot's clearError() instead
```

**Why:** custom reset logic that bypasses Nuxt's error lifecycle can leave `useError()` set and the app in an inconsistent state.
**Verify:** after recovery the error surface is gone, `useError()` is cleared, and navigation or rendering works as intended.

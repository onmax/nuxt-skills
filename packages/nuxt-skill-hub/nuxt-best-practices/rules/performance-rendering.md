## Performance and Rendering

### `perf-use-nuxtlink-for-internal-nav`: Use `NuxtLink` for internal navigation
**Apply when:** creating or refactoring internal links.
**Skip when:** the target is external or deliberately bypasses the router.

```vue
<!-- Wrong: full page reload, no prefetch -->
<a href="/pricing">Pricing</a>
```

```vue
<!-- Right -->
<NuxtLink to="/pricing">Pricing</NuxtLink>
<NuxtLink to="/reports" prefetch-on="interaction">Reports</NuxtLink>
```

**Why:** `NuxtLink` does client-side navigation with route-aware prefetching (`prefetchOn: 'visibility'` by default, or `'interaction'`).
**Verify:** internal links in pages, layouts, and components use `NuxtLink` and keep their semantics and accessibility.

### `perf-match-route-rules-to-content-volatility`: Use route rules to match rendering strategy to content volatility
**Apply when:** routes have different static, stale-while-revalidate, ISR, or client-only needs.
**Skip when:** the deployment target cannot support the required rule (for example `isr` on a host without it).

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { swr: 3600 },
    '/products/**': { isr: 600 },
    '/dashboard/**': { ssr: false },
  },
})
```

**Why:** route rules directly set cache semantics and server behavior per route; one global mode fits no mixed app.
**Verify:** each route family's rule matches its freshness and SEO needs; check response cache headers or prerendered output.

### `perf-lazy-load-and-hydrate-intentionally`: Use lazy component loading and lazy hydration intentionally
**Apply when:** a component is not needed for first meaningful paint or immediate interaction.
**Skip when:** the component must be interactive on first render.

```vue
<template>
  <HeroBanner />
  <!-- Lazy prefix: code-split, loaded only when rendered -->
  <LazyCommentList v-if="showComments" />
  <!-- Lazy hydration: SSR HTML now, JS hydrates when visible -->
  <LazyRelatedProducts hydrate-on-visible />
</template>
```

**Why:** eager hydration of everything costs main-thread time on navigation; Nuxt's lazy hydration triggers (`hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction`) cut it.
**Verify:** below-the-fold or non-critical UI defers code or hydration without breaking UX.

### `perf-reduce-payload-and-asset-cost`: Reduce payload and asset cost before adding infra complexity
**Apply when:** regressions trace to response size, client JS, images, fonts, or third-party scripts.
**Skip when:** the bottleneck is backend latency unrelated to payload or assets.

Before adding caching layers: trim async-data payloads (`pick`/`transform`), serve images through Nuxt Image (`<NuxtImg>`), fonts through Nuxt Fonts, third-party scripts through Nuxt Scripts (`useScript`), and profile with Nuxt DevTools and `nuxi analyze`.

**Why:** Nuxt Image, Fonts, and Scripts target LCP, CLS, and INP with Nuxt-aware defaults; caching oversized responses keeps them oversized.
**Verify:** a measurable drop in transferred bytes or blocking work on the critical path (payload tab, bundle analysis, network waterfall).

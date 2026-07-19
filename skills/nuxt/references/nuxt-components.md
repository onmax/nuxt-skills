# Built-in components and rendering

Use Nuxt built-ins when the component participates in routing, layouts, hydration, or Nuxt's rendering lifecycle.

## Application structure

- `<NuxtPage>` renders the matched page and is required for file-based pages.
- `<NuxtLayout>` renders a layout from `app/layouts/` around its slot.
- `<NuxtLink>` handles internal router navigation, external links, and Nuxt prefetch behavior.
- `<NuxtLoadingIndicator>` reflects page navigation loading at the application shell.
- `<NuxtErrorBoundary>` contains client rendering errors within one subtree.

Use semantic HTML directly for ordinary structure. Nuxt components are lifecycle primitives, not replacements for native elements.

## Client-only rendering

`<ClientOnly>` removes its default slot from the server build and renders it after the client mounts. Provide a meaningful fallback when the missing content affects layout or comprehension.

```vue
<ClientOnly fallback-tag="p" fallback="Loading chart…">
  <RevenueChart />
</ClientOnly>
```

Prefer importing a browser-only dependency from a `.client.vue` component or `.client` plugin when the entire implementation is client-only. Fix hydration mismatches at their data or markup source rather than wrapping server-capable UI in `ClientOnly`.

## Lazy components and hydration

Prefix an auto-imported component with `Lazy` to split its code:

```vue
<LazyAdminPanel v-if="showAdmin" />
```

Nuxt also supports delayed hydration strategies on lazy auto-imported components, including visibility, idle time, interaction, a media query, a reactive condition, a delay, or never hydrating. Use the strategy supported by the installed Nuxt version and express it directly in the template:

```vue
<LazyProductReviews hydrate-on-visible />
```

Hydration strategy props are compile-time behavior for single-file components. They do not work the same way on a component imported directly from `#components`. Choose a trigger that matches when the UI must become interactive, and verify keyboard as well as pointer interaction.

## Images, time, and teleports

- `<NuxtTime>` formats a date consistently across server and client, reducing locale-driven hydration mismatches.
- `<NuxtImg>` and `<NuxtPicture>` belong to the Nuxt Image module. Use that skill and the installed provider configuration for transformations and optimization.
- `<Teleport>` is a Vue primitive. During SSR, target `#teleports` unless the application deliberately manages another server-rendered target.

## Assets

Put source assets that Vite should transform in `app/assets/` and reference them through imports or CSS. Put files that must retain their exact public path in `public/` and reference them from `/`.

## Completion checks

- Server and client render the same initial markup unless a client-only boundary is deliberate.
- Lazy hydration does not delay controls past the moment users need them.
- Route and layout transitions receive a single element root.
- Image behavior is verified through the configured Nuxt Image provider, not assumed from local development.

# Pages, routing, layouts, and errors

## File-based routing

Files in `app/pages/` become routes when the application renders `<NuxtPage />` directly or through `app/app.vue`.

```text
app/pages/index.vue                 /
app/pages/products/[id].vue        /products/:id
app/pages/docs/[[slug]].vue         /docs/:slug?
app/pages/blog/[...slug].vue        /blog/:slug(.*)*
app/pages/(marketing)/about.vue     /about
```

Route groups organize pages without adding a URL segment. Nested pages need a matching parent page that renders `<NuxtPage />`. Give a page a single root element when page transitions are enabled, because transitions need one DOM root.

Read params and query through `useRoute()`. Navigate declaratively with `<NuxtLink>` and programmatically with `await navigateTo(...)`.

## Page metadata

Use the compile-time `definePageMeta` macro inside a page:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
  validate: route => typeof route.params.id === 'string',
})
</script>
```

Page metadata owns layout selection, route middleware, validation, transition configuration, keys, and other route-level behavior. Use `useSeoMeta` or `useHead` for document metadata instead of putting SEO fields into arbitrary page metadata.

## Layouts and navigation

Layouts live in `app/layouts/` and render page content through `<slot />`. Select one with `definePageMeta({ layout: 'dashboard' })`, or use `<NuxtLayout>` when layout selection itself is dynamic.

`<NuxtLink>` supports internal router navigation and external links. Keep navigation targets as paths or named-route objects; avoid constructing internal URLs with string concatenation when route params express the intent.

## Route middleware boundary

Route middleware controls application navigation. It is different from `server/middleware`, which runs for HTTP requests. Put route middleware in `app/middleware/` and read [middleware-plugins.md](middleware-plugins.md) for return behavior and SSR caveats.

## Error handling

- Throw `createError(...)` when the current operation cannot continue. Server-thrown errors propagate with their status code and safe message.
- Use `showError(...)` for a full-screen Nuxt error outside a thrown control flow.
- Read the current full-screen error with `useError()` and recover with `clearError({ redirect: '/' })`.
- Use `<NuxtErrorBoundary>` when one part of a page should fail without replacing the entire application.
- Customize the full-screen error in the project-root `error.vue`. Keep it self-contained because it renders outside the normal application tree.

Do not expose sensitive server error data to the client. On the server, prefer the error `message` for a client-safe explanation and keep private context in logs.

## Custom routes

Stay with file-based routing until it cannot express the requirement. Use `app/router.options.ts` for router options and the `pages:extend` Nuxt hook to add or alter generated routes. A custom `routes` function replaces the generated route set, so reserve it for cases that truly need full ownership.

## Completion checks

- Direct SSR entry and client navigation reach the same route state.
- Nested pages render through their parent `<NuxtPage>`.
- Middleware and validation return typed navigation outcomes.
- The full-screen error page can render without depending on a failed plugin or layout.

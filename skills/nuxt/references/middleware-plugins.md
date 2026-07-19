# Route middleware and app plugins

## Route middleware

Route middleware runs during application navigation. Put named middleware in `app/middleware/auth.ts`, global middleware in a `.global.ts` file, or inline middleware in `definePageMeta`.

```ts
export default defineNuxtRouteMiddleware(async (to) => {
  const session = useSession()

  if (!session.value && to.path !== '/login')
    return navigateTo('/login')
})
```

Return the result of `navigateTo(...)` or `abortNavigation(...)`; do not call them and then continue. Use `to` and `from` inside middleware because `useRoute()` may represent a different navigation state.

Initial navigation can run route middleware on the server and again during client hydration. Keep it idempotent, or guard browser-only work with the Nuxt runtime context. Avoid redirect loops by checking the destination before redirecting.

Route middleware does not protect an API. Authorization for `server/api` belongs in server middleware, a server utility, or the handler itself.

## App plugins

Nuxt scans top-level files in `app/plugins/`. Use `.client` or `.server` suffixes when a dependency is limited to one runtime.

```ts
export default defineNuxtPlugin({
  name: 'analytics',
  parallel: true,
  setup () {
    const analytics = createAnalyticsClient()

    return {
      provide: { analytics },
    }
  },
})
```

Object-syntax plugin properties are statically analyzed, so keep fields such as `name`, `enforce`, `parallel`, `dependsOn`, and hook names static. Use `dependsOn` only for a real ordering dependency; otherwise independent plugins may initialize in parallel.

Plugins are appropriate for runtime injections, Vue plugins, and Nuxt runtime hooks. Prefer an ordinary composable for application logic that does not require initialization or injection.

Type plugin injections through the value returned from `provide`, and access them with `useNuxtApp()`. Avoid global mutable singletons on the server because they can leak state between requests.

## Runtime hooks

Register app hooks in an object-syntax plugin when they are part of plugin setup:

```ts
export default defineNuxtPlugin({
  name: 'navigation-metrics',
  hooks: {
    'page:finish' () {
      recordPageReady()
    },
  },
})
```

Use `nuxtApp.hook(...)` for dynamic registration. Keep hooks small and remove external listeners when the owning scope is disposed.

## Completion checks

- Middleware cannot redirect to itself and returns every navigation outcome.
- API authorization is enforced on the server, even when route middleware also improves the client experience.
- Server plugins do not hold request-specific state in a process-global value.
- Plugin order is explicit only where another plugin is genuinely required.

# Client-only mode

Use `clientOnly` when Better Auth runs on a separate backend.

## Minimal setup

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/better-auth'],
  auth: {
    clientOnly: true,
  },
})
```

```ini
NUXT_PUBLIC_SITE_URL=https://auth.example.com
```

The site URL is the default auth client base URL. An explicit client config value takes precedence:

```ts
export default defineClientAuth({
  baseURL: 'https://auth.example.com',
})
```

## What changes

- no local `/api/auth/**` handlers
- no local `server/auth.config.ts`
- no server utilities such as `serverAuth()` or `requireUserSession()`
- no SSR session hydration from a local auth server
- `useUserSession()` still works on the client

## External server requirements

- allow cross-origin requests with credentials
- use secure cross-site cookies when needed
- include the frontend origin in `trustedOrigins`

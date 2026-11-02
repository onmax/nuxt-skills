# Better Auth plugins

## Rule of thumb

If a Better Auth plugin has a client companion, register both:

- server plugin in `server/auth.config.ts`
- client plugin in `app/auth.config.ts`

## Example

```ts
import { admin, twoFactor } from 'better-auth/plugins'
import { defineServerAuth } from '@nuxtjs/better-auth/config'

export default defineServerAuth({
  plugins: [admin(), twoFactor()],
})
```

```ts
import { adminClient, twoFactorClient } from 'better-auth/client/plugins'
import { defineClientAuth } from '@nuxtjs/better-auth/config'

export default defineClientAuth({
  plugins: [adminClient(), twoFactorClient()],
})
```

## Common plugin pairs

| Server | Client |
| --- | --- |
| `admin()` | `adminClient()` |
| `twoFactor()` | `twoFactorClient()` |
| `passkey()` | `passkeyClient()` |
| `multiSession()` | `multiSessionClient()` |

Without the matching client plugin, client-side methods and inferred types for that feature are incomplete.

## Calling plugin client methods

Use `useAuthClientAction()` when plugin methods should expose loading/error/success state.

```ts
const revokeSession = useAuthClientAction(client => client.multiSession.revokeSession)
await revokeSession.execute({ sessionId })
```

Use `useAuthClient()` for direct calls when action state is not needed.

```ts
const client = useAuthClient()
await client?.multiSession.listDeviceSessions()
```

Types from plugins are inferred automatically. See [references/types.md](types.md) for type augmentation.

## Plugins supplied by layers

Export each plugin as the default value of a source file and list the source paths in the layer's `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  auth: {
    serverPluginSources: ['./server/auth-plugin'],
    clientPluginSources: ['./app/auth-plugin'],
  },
})
```

Relative paths resolve from the declaring layer. The module includes these plugins in schema generation, runtime auth instances, and inferred types.

Plugin contributions are additive and are not deduplicated. Declare each plugin once, either in the app auth config, a layer source, or a module registration.

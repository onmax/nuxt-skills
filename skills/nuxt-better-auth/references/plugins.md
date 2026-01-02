# Better Auth Plugins

The module supports all Better Auth plugins. Configure in both server and client configs.

## Server Plugin Setup

```ts
// server/auth.config.ts
import { defineServerAuth } from '#auth/server'

export default defineServerAuth(({ runtimeConfig }) => ({
  emailAndPassword: { enabled: true },
  plugins: [
    admin(),
    twoFactor({ issuer: 'MyApp' }),
    passkey(),
    multiSession()
  ]
}))
```

## Client Plugin Setup

```ts
// app/auth.config.ts
import { createAppAuthClient } from '#auth/client'
import { adminClient, twoFactorClient, passkeyClient, multiSessionClient } from 'better-auth/client/plugins'

export default createAppAuthClient({
  plugins: [
    adminClient(),
    twoFactorClient(),
    passkeyClient(),
    multiSessionClient()
  ]
})
```

## Common Plugins

### Admin

Role-based access control:

```ts
// Server
import { admin } from 'better-auth/plugins'
plugins: [admin()]

// Client
import { adminClient } from 'better-auth/client/plugins'
plugins: [adminClient()]
```

Usage:

```ts
// Protect route
await requireUserSession(event, { user: { role: 'admin' } })

// Client: set user role
await client.admin.setRole({ userId: 'xxx', role: 'admin' })
```

### Two-Factor (2FA)

```ts
// Server
import { twoFactor } from 'better-auth/plugins'
plugins: [twoFactor({ issuer: 'MyApp' })]

// Client
import { twoFactorClient } from 'better-auth/client/plugins'
plugins: [twoFactorClient()]
```

Usage:

```ts
// Enable 2FA
const { totpURI } = await client.twoFactor.enable({ password: 'xxx' })
// Show QR code with totpURI

// Verify OTP on login
await client.twoFactor.verifyTotp({ code: '123456' })
```

### Passkey

WebAuthn/FIDO2 authentication:

```ts
// Server
import { passkey } from 'better-auth/plugins'
plugins: [passkey()]

// Client
import { passkeyClient } from 'better-auth/client/plugins'
plugins: [passkeyClient()]
```

Usage:

```ts
// Register passkey
await client.passkey.addPasskey()

// Sign in with passkey
await signIn.passkey()
```

### Multi-Session

Allow multiple concurrent sessions:

```ts
// Server
import { multiSession } from 'better-auth/plugins'
plugins: [multiSession()]

// Client
import { multiSessionClient } from 'better-auth/client/plugins'
plugins: [multiSessionClient()]
```

Usage:

```ts
// List all sessions
const sessions = await client.multiSession.listDeviceSessions()

// Revoke specific session
await client.multiSession.revokeSession({ sessionId: 'xxx' })
```

## Plugin Type Inference

Types from plugins are automatically inferred. See [references/types.md](types.md) for type augmentation.

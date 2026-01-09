# Client-Side Authentication

## useUserSession()

Main composable for auth state and methods.

```ts
const {
  user,           // Ref<AuthUser | null>
  session,        // Ref<AuthSession | null>
  loggedIn,       // ComputedRef<boolean>
  ready,          // ComputedRef<boolean> - session fetch complete
  client,         // Better Auth client (client-side only)
  signIn,         // Proxy to client.signIn
  signUp,         // Proxy to client.signUp
  signOut,        // Sign out and clear session
  fetchSession,   // Manually refresh session
  updateUser      // Optimistic local user update
} = useUserSession()
```

## Sign In

```ts
// Email/password
await signIn.email({
  email: 'user@example.com',
  password: 'password123'
}, {
  onSuccess: () => navigateTo('/dashboard')
})

// OAuth
await signIn.social({ provider: 'github' })
```

## Sign Up

```ts
await signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
}, {
  onSuccess: () => navigateTo('/welcome')
})
```

## Sign Out

```ts
await signOut()
// or with redirect
await signOut({ redirect: '/login' })
```

## Check Auth State

```vue
<script setup>
const { user, loggedIn, ready } = useUserSession()
</script>

<template>
  <div v-if="!ready">Loading...</div>
  <div v-else-if="loggedIn">Welcome, {{ user?.name }}</div>
  <div v-else>Please log in</div>
</template>
```

## Safe Redirects

Always validate redirect URLs from query params to prevent open redirects:

```ts
function getSafeRedirect() {
  const redirect = route.query.redirect as string
  // Must start with / and not // (prevents protocol-relative URLs)
  if (!redirect?.startsWith('/') || redirect.startsWith('//')) {
    return '/'
  }
  return redirect
}

await signIn.email({
  email, password
}, {
  onSuccess: () => navigateTo(getSafeRedirect())
})
```

## Wait for Session

Useful when needing session before rendering:

```ts
await waitForSession() // 5s timeout
if (loggedIn.value) {
  // Session is ready
}
```

## Manual Session Refresh

```ts
// Refetch from server
await fetchSession({ force: true })
```

## Session Management

Additional session management via Better Auth client:

```ts
const { client } = useUserSession()

// List all active sessions for current user
const sessions = await client.listSessions()

// Revoke a specific session
await client.revokeSession({ sessionId: 'xxx' })

// Revoke all sessions except current
await client.revokeOtherSessions()

// Revoke all sessions (logs out everywhere)
await client.revokeSessions()
```

These methods require the user to be authenticated.

## BetterAuthState Component

Renders once session hydration completes (`ready === true`), with loading placeholder support.

```vue
<BetterAuthState>
  <template #default="{ loggedIn, user, session, signOut }">
    <p v-if="loggedIn">Hi {{ user?.name }}</p>
    <button v-else @click="navigateTo('/login')">Sign in</button>
  </template>
  <template #placeholder>
    <p>Loading…</p>
  </template>
</BetterAuthState>
```

**Slots:**

- `default` - Renders when `ready === true`, provides `{ loggedIn, user, session, signOut }`
- `placeholder` - Renders while session hydrates

Useful in clientOnly mode or for graceful SSR loading states.

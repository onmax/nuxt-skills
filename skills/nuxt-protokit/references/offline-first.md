# Offline-First Architecture

## How It Works

Every prototype uses **Y.js CRDT documents** stored in IndexedDB:

- Each `usePrototype(schema)` call opens (or reuses) a Y.js doc keyed by `schema.key`
- Top-level fields are stored in a `Y.Map`; collections are stored in `Y.Array`s
- On mount, data is loaded from IndexedDB — `isReady` becomes `true` when loaded
- Changes sync automatically via **BroadcastChannel** to other tabs in the same origin
- If `serverSync` is enabled (default), changes also sync to `/api/yjs/<key>`

---

## Multi-Tab Sync

Automatic — no configuration needed. Opening the same prototype in multiple tabs keeps them in sync in real time via BroadcastChannel.

---

## Namespace Isolation

The `namespace` option creates **fully isolated** IndexedDB stores and BroadcastChannels. Resulting key: `<namespace>:<docKey>`.

```ts
// All users in a tenant share the same data
usePrototype(schema, { namespace: tenantId })

// Per-user private data within a tenant
usePrototype(schema, { namespace: `${tenantId}:${userId}` })

// Reactive — re-mounts when user switches tenant
const ns = computed(() => currentUser.value?.tenantId)
usePrototype(schema, { namespace: ns })
```

When `namespace` changes, the composable destroys the old doc and mounts a fresh one. **No data bleeds between namespaces.**

---

## Server Sync

Configured in `nuxt.config.ts`:

```ts
protokit: {
  serverSync: true,     // default — syncs to /api/yjs/<key>
  // serverSync: false  // local-only
  // serverSync: { enabled: true, baseUrl: '/api/yjs' }
}
```

Per-prototype override:

```ts
// Force local-only for a specific prototype (public demo, scratch pad)
usePrototype(schema, { disableSync: true })
```

The server endpoint must implement the Y.js sync protocol. The `@websideproject/module-yjs-sync` module provides this for Nuxt.

---

## Encryption

Encrypts all IndexedDB updates with **AES-GCM**. Keys are derived via PBKDF2 from the provided password.

```ts
// Encrypt with a user's passphrase
const proto = usePrototype(schema, {
  encryption: { password: userPassphrase }
})

// Or via useProtoDoc directly
const { doc } = useProtoDoc('my-key', {
  encryption: { password: passphrase }
})
```

**Important notes:**
- Encryption is per-doc. Different docs can use different passwords.
- Server sync works with encrypted docs — encrypted bytes are synced, not plaintext.
- If the password changes, the old IndexedDB data cannot be decrypted. Implement a migration flow to re-encrypt.
- Use `useEncryptedIdb()` for direct encrypted storage access outside of protokit.

---

## Corruption Recovery

IndexedDB data can occasionally become corrupted (browser crashes, storage quota exceeded, partial writes). nuxt-protokit detects this automatically.

### Setup

Add `<ProtoCorruptionModal />` once in your app layout or on the page:

```vue
<!-- layouts/default.vue or pages/my-tool.vue -->
<template>
  <div>
    <slot />
    <ProtoCorruptionModal />
  </div>
</template>
```

When corruption is detected, the modal presents the user with options to:
1. Clear the corrupted doc and start fresh
2. Attempt recovery from the last clean snapshot

### Manual detection

```ts
const { isCorrupted, clearCorruption } = useProtoCorruption()

if (isCorrupted.value) {
  // handle in custom UI
  await clearCorruption()
}
```

---

## Document Size & GC

Y.js documents grow over time as change history accumulates. Tips:
- Avoid storing large binary blobs (images, files) in Y.js. Use separate storage (NuxtHub blob, etc.) and store only URLs.
- Y.js has built-in garbage collection for deleted content. It runs automatically.
- Use `maxItems` in `CollectionSchema` to cap collection size.
- For very large datasets (10k+ items), consider storing aggregates in Y.js and full data in a separate DB.

---

## `isReady` Pattern

Always check `isReady` before relying on state values. `<ProtoTool>` handles this automatically with a loading skeleton. For custom UIs:

```vue
<template>
  <div v-if="!proto.isReady.value">Loading...</div>
  <div v-else>{{ proto.state.revenue.value }}</div>
</template>
```

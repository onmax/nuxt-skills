# Database Integration

## NuxtHub Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', '@onmax/nuxt-better-auth'],
  hub: { database: true },
  auth: {
    secondaryStorage: true,  // Optional: KV for session caching
    schema: {
      usePlural: false,      // user vs users
      casing: 'camelCase'    // camelCase or snake_case
    }
  }
})
```

## Schema Generation

The module auto-generates Drizzle schema from Better Auth tables. Schema available via:

```ts
import { user, session, account, verification } from '#auth/database'
```

## Database Dialect

Supports: `sqlite`, `postgresql`, `mysql`

Schema syntax adapts to dialect:

- SQLite: `integer('id').primaryKey()`
- PostgreSQL/MySQL: `uuid('id').primaryKey()` or `text('id').primaryKey()`

## Schema Options

```ts
auth: {
  schema: {
    usePlural: true,    // tables: users, sessions, accounts
    casing: 'snake_case' // columns: created_at, updated_at
  }
}
```

| Option      | Default       | Description              |
| ----------- | ------------- | ------------------------ |
| `usePlural` | `false`       | Pluralize table names    |
| `casing`    | `'camelCase'` | Column naming convention |

## Extending Schema

Add custom columns via NuxtHub's schema hooks:

```ts
// server/plugins/extend-schema.ts
export default defineNitroPlugin(() => {
  useNitroApp().hooks.hook('hub:db:schema:extend', (schema) => {
    // Add custom tables or extend existing
  })
})
```

## Secondary Storage (KV)

Enable session caching with KV:

```ts
auth: {
  secondaryStorage: true
}
```

Requires `hub.kv: true` in config. Improves session lookup performance.

## Server Config with DB

Database adapter injected via context:

```ts
// server/auth.config.ts
import { defineServerAuth } from '#auth/server'

export default defineServerAuth(({ db }) => ({
  database: db,  // Already configured when hub.database: true
  emailAndPassword: { enabled: true }
}))
```

## Manual Database Setup

Without NuxtHub, configure manually:

```ts
// server/auth.config.ts
import { drizzle } from 'drizzle-orm/...'
import { defineServerAuth } from '#auth/server'

const db = drizzle(...)

export default defineServerAuth(() => ({
  database: drizzleAdapter(db, { provider: 'sqlite' })
}))
```

## Migrations

Better Auth creates tables automatically on first run. For production, generate migrations:

```bash
# Using Better Auth CLI
npx better-auth generate
```

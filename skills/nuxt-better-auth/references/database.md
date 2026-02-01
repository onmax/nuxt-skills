# Database Integration

## NuxtHub Setup

**Requires NuxtHub 0.10.5+** for `hub:db` and `hub:kv` alias support.

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

The module auto-generates Drizzle schema from Better Auth tables using Better Auth's schema generation API. Schema available via:

```ts
import { user, session, account, verification } from '#auth/database'
```

## Creating Custom Tables with Foreign Keys

Create app tables that reference auth tables by importing `schema` from `hub:db`. NuxtHub auto-merges custom schemas with Better Auth tables.

```ts
// server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { schema } from 'hub:db'

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  authorId: text('author_id').notNull()
    .references(() => schema.user.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date()),
})
```

**Available Auth Tables:**

- `schema.user` - User accounts
- `schema.session` - Active sessions
- `schema.account` - OAuth provider accounts
- `schema.verification` - Email verification tokens
- Plugin tables: `schema.passkey`, `schema.twoFactor`, etc.

**ID Type Matching:**

- SQLite/MySQL: Use `text()` or `varchar()`
- PostgreSQL with UUID: Use `uuid()` when `advanced.database.generateId = 'uuid'`

**Migrations:**

```bash
npx nuxt db generate  # Generate migrations
npx nuxt db migrate   # Apply (auto in dev)
```

**Adding columns to auth tables:** Use Better Auth's `additionalFields` instead of custom schemas. See [Better Auth Additional Fields](https://better-auth.com/docs/concepts/database#additional-fields).

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

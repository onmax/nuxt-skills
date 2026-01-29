---
name: nuxthub
description: Use when building NuxtHub v0.10.4 applications - provides database (Drizzle ORM with sqlite/postgresql/mysql), KV storage, blob storage, and cache APIs. Covers configuration, schema definition, migrations, multi-cloud deployment (Cloudflare, Vercel), and the new hub:db, hub:kv, hub:blob virtual module imports.
license: MIT
---

# NuxtHub v0.10.4

Full-stack Nuxt framework with database, KV, blob, and cache. Multi-cloud support (Cloudflare, Vercel, Deno, Netlify).

**For Nuxt server patterns:** use `nuxt` skill (server.md)
**For content with database:** use `nuxt-content` skill

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/wrangler-templates.md](references/wrangler-templates.md) - if manually configuring wrangler.jsonc for Cloudflare deployment
- [ ] [references/providers.md](references/providers.md) - if deploying to Vercel, Netlify, Deno, AWS, or configuring external database/storage providers

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Installation

```bash
npx nuxi module add hub
```

## Configuration

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core'],
  hub: {
    db: 'sqlite', // 'sqlite' | 'postgresql' | 'mysql'
    kv: true,
    blob: true,
    cache: true,
    dir: '.data', // local storage directory
    remote: false // use production bindings in dev (v0.10.4+)
  }
})
```

### Advanced Config

```ts
hub: {
  db: {
    dialect: 'postgresql',
    driver: 'postgres-js', // Optional: auto-detected
    casing: 'snake_case',  // camelCase JS -> snake_case DB
    migrationsDirs: ['server/db/custom-migrations/'],
    applyMigrationsDuringBuild: true // default
  },
  remote: true // Use production Cloudflare bindings in dev (v0.10.4+)
}
```

**remote mode:** When enabled, connects to production D1/KV/R2 during local development instead of local emulation. Useful for testing with production data.

## Database

Type-safe SQL via Drizzle ORM. `db` and `schema` are auto-imported on server-side.

### Schema Definition

Place in `server/db/schema.ts` or `server/db/schema/*.ts`:

```ts
// server/db/schema.ts (SQLite)
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: integer({ mode: 'timestamp' }).notNull()
})
```

PostgreSQL variant:

```ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp().notNull().defaultNow()
})
```

### Database API

```ts
// db and schema are auto-imported on server-side
import { db, schema } from 'hub:db'

// Select
const users = await db.select().from(schema.users)
const user = await db.query.users.findFirst({ where: eq(schema.users.id, 1) })

// Insert
const [newUser] = await db.insert(schema.users).values({ name: 'John', email: 'john@example.com' }).returning()

// Update
await db.update(schema.users).set({ name: 'Jane' }).where(eq(schema.users.id, 1))

// Delete
await db.delete(schema.users).where(eq(schema.users.id, 1))
```

### Migrations

```bash
npx nuxt db generate                  # Generate migrations from schema
npx nuxt db migrate                   # Apply pending migrations
npx nuxt db sql "SELECT * FROM users" # Execute raw SQL
npx nuxt db drop <TABLE>              # Drop a specific table
npx nuxt db drop-all                  # Drop all tables (v0.10.4+)
npx nuxt db squash                    # Squash migrations into one (v0.10.4+)
npx nuxt db mark-as-migrated [NAME]   # Mark as migrated without running
```

Migrations auto-apply during `npx nuxi dev` and `npx nuxi build`. Tracked in `_hub_migrations` table.

### Database Providers

| Dialect    | Local                | Production                                                        |
| ---------- | -------------------- | ----------------------------------------------------------------- |
| sqlite     | `.data/db/sqlite.db` | D1 (Cloudflare), Turso (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) |
| postgresql | PGlite               | postgres-js (`DATABASE_URL`), neon-http (`DATABASE_URL`)          |
| mysql      | -                    | mysql2 (`DATABASE_URL`, `MYSQL_URL`)                              |

## KV Storage

Key-value storage. `kv` is auto-imported on server-side.

```ts
import { kv } from 'hub:kv'

await kv.set('key', { data: 'value' })
await kv.set('key', value, { ttl: 60 }) // TTL in seconds
const value = await kv.get('key')
const exists = await kv.has('key')
await kv.del('key')
const keys = await kv.keys('prefix:')
await kv.clear('prefix:')
```

Constraints: max value 25 MiB, max key 512 bytes.

### KV Providers

| Provider      | Package          | Env Vars                                             |
| ------------- | ---------------- | ---------------------------------------------------- |
| Upstash       | `@upstash/redis` | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Redis         | `ioredis`        | `REDIS_URL`                                          |
| Cloudflare KV | -                | `KV` binding in wrangler.jsonc                       |
| Deno KV       | -                | Auto on Deno Deploy                                  |
| Vercel        | -                | `KV_REST_API_URL`, `KV_REST_API_TOKEN`               |

## Blob Storage

File storage. `blob` is auto-imported on server-side.

### Blob API

```ts
import { blob } from 'hub:blob'

// Upload
const result = await blob.put('path/file.txt', body, {
  contentType: 'text/plain',
  access: 'public', // 'public' | 'private' (v0.10.4+)
  addRandomSuffix: true,
  prefix: 'uploads'
})
// Returns: { pathname, contentType, size, httpEtag, uploadedAt }

// Download
const file = await blob.get('path/file.txt') // Returns Blob or null

// List
const { blobs, cursor, hasMore, folders } = await blob.list({ prefix: 'uploads/', limit: 10, folded: true })

// Serve (with proper headers)
return blob.serve(event, 'path/file.txt')

// Delete
await blob.del('path/file.txt')
await blob.del(['file1.txt', 'file2.txt']) // Multiple

// Metadata only
const meta = await blob.head('path/file.txt')
```

### Upload Helpers

```ts
// Server: Validate + upload handler
export default eventHandler(async (event) => {
  return blob.handleUpload(event, {
    formKey: 'files',
    multiple: true,
    ensure: { maxSize: '10MB', types: ['image/png', 'image/jpeg'] },
    put: { addRandomSuffix: true, prefix: 'images' }
  })
})

// Validate before manual upload
ensureBlob(file, { maxSize: '10MB', types: ['image'] })

// Multipart upload for large files (>10MB)
export default eventHandler(async (event) => {
  return blob.handleMultipartUpload(event) // Route: /api/files/multipart/[action]/[...pathname]
})
```

### Vue Composables

```ts
// Simple upload
const upload = useUpload('/api/upload')
const result = await upload(inputElement)

// Multipart with progress
const mpu = useMultipartUpload('/api/files/multipart')
const { completed, progress, abort } = mpu(file)
```

### Blob Providers

| Provider      | Package        | Config                                                               |
| ------------- | -------------- | -------------------------------------------------------------------- |
| Cloudflare R2 | -              | `BLOB` binding in wrangler.jsonc                                     |
| Vercel Blob   | `@vercel/blob` | `BLOB_READ_WRITE_TOKEN`                                              |
| S3            | `aws4fetch`    | `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_REGION` |

## Cache

Response and function caching.

### Route Handler Caching

```ts
export default cachedEventHandler((event) => {
  return { data: 'cached', date: new Date().toISOString() }
}, {
  maxAge: 60 * 60, // 1 hour
  getKey: event => event.path
})
```

### Function Caching

```ts
export const getStars = defineCachedFunction(
  async (event: H3Event, repo: string) => {
    const data = await $fetch(`https://api.github.com/repos/${repo}`)
    return data.stargazers_count
  },
  { maxAge: 3600, name: 'ghStars', getKey: (event, repo) => repo }
)
```

### Cache Invalidation

```ts
// Remove specific
await useStorage('cache').removeItem('nitro:functions:getStars:repo-name.json')

// Clear by prefix
await useStorage('cache').clear('nitro:handlers')
```

Cache key pattern: `${group}:${name}:${getKey(...args)}.json` (defaults: group='nitro', name='handlers'|'functions'|'routes')

## Deployment

### Cloudflare

NuxtHub auto-generates `wrangler.json` from your hub config - no manual wrangler.jsonc required:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: { databaseId: '<database-id>' }
    },
    kv: {
      driver: 'cloudflare-kv-binding',
      namespaceId: '<kv-namespace-id>'
    },
    cache: {
      driver: 'cloudflare-kv-binding',
      namespaceId: '<cache-namespace-id>'
    },
    blob: {
      driver: 'cloudflare-r2',
      bucketName: '<bucket-name>'
    }
  }
})
```

**Observability (recommended):** Enable logging for production deployments:

```jsonc
// wrangler.jsonc (optional)
{
  "observability": {
    "logs": {
      "enabled": true,
      "head_sampling_rate": 1,
      "invocation_logs": true,
      "persist": true
    }
  }
}
```

Create resources via Cloudflare dashboard or CLI:

```bash
npx wrangler d1 create my-db              # Get database-id
npx wrangler kv namespace create KV       # Get kv-namespace-id
npx wrangler kv namespace create CACHE    # Get cache-namespace-id
npx wrangler r2 bucket create my-bucket   # Get bucket-name
```

Deploy: Create [Cloudflare Workers project](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create), link Git repo. Bindings auto-configured at build time.

**Environments:** Use `CLOUDFLARE_ENV=preview` for preview deployments.

See [references/wrangler-templates.md](references/wrangler-templates.md) for manual wrangler.jsonc patterns and [references/providers.md](references/providers.md) for all provider configurations.

### Other Providers

See [references/providers.md](references/providers.md) for detailed deployment patterns for:

- **Vercel:** Postgres, Turso, Vercel Blob, Vercel KV
- **Netlify:** External databases, S3, Upstash Redis
- **Deno Deploy:** Deno KV
- **AWS/Self-hosted:** S3, RDS, custom configs

### D1 over HTTP

Query D1 from non-Cloudflare hosts:

```ts
hub: {
  db: { dialect: 'sqlite', driver: 'd1-http' }
}
```

Requires: `NUXT_HUB_CLOUDFLARE_ACCOUNT_ID`, `NUXT_HUB_CLOUDFLARE_API_TOKEN`, `NUXT_HUB_CLOUDFLARE_DATABASE_ID`

## Build-time Hooks

```ts
// Extend schema
nuxt.hook('hub:db:schema:extend', async ({ dialect, paths }) => {
  paths.push(await resolvePath(`./schema/custom.${dialect}`))
})

// Add migration directories
nuxt.hook('hub:db:migrations:dirs', (dirs) => {
  dirs.push(resolve('./db-migrations'))
})

// Post-migration queries (idempotent)
nuxt.hook('hub:db:queries:paths', (paths, dialect) => {
  paths.push(resolve(`./seed.${dialect}.sql`))
})
```

## Type Sharing

```ts
// shared/types/db.ts
import type { users } from '~/server/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

## WebSocket / Realtime

Enable experimental WebSocket:

```ts
// nuxt.config.ts
nitro: { experimental: { websocket: true } }
```

```ts
// server/routes/ws/chat.ts
export default defineWebSocketHandler({
  open(peer) {
    peer.subscribe('chat')
    peer.publish('chat', 'User joined')
  },
  message(peer, message) {
    peer.publish('chat', message.text())
  },
  close(peer) {
    peer.unsubscribe('chat')
  }
})
```

## Deprecated (v0.10)

Removed Cloudflare-specific features:

- `hubAI()` -> Use AI SDK with Workers AI Provider
- `hubBrowser()` -> Puppeteer
- `hubVectorize()` -> Vectorize
- NuxtHub Admin -> Sunset Dec 31, 2025
- `npx nuxthub deploy` -> Use wrangler deploy

## Quick Reference

| Feature  | Import                                | Access                             |
| -------- | ------------------------------------- | ---------------------------------- |
| Database | `import { db, schema } from 'hub:db'` | `db.select()`, `db.insert()`, etc. |
| KV       | `import { kv } from 'hub:kv'`         | `kv.get()`, `kv.set()`, etc.       |
| Blob     | `import { blob } from 'hub:blob'`     | `blob.put()`, `blob.get()`, etc.   |

All are auto-imported on server-side.

## Resources

- [Installation](https://hub.nuxt.com/docs/getting-started/installation)
- [Migration from v0.9](https://hub.nuxt.com/docs/getting-started/migration)
- [Database](https://hub.nuxt.com/docs/database)
- [Blob](https://hub.nuxt.com/docs/blob)
- [KV](https://hub.nuxt.com/docs/kv)
- [Cache](https://hub.nuxt.com/docs/cache)
- [Deploy](https://hub.nuxt.com/docs/getting-started/deploy)

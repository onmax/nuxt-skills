---
name: nuxthub
description: Use when building NuxtHub v0.10 applications - provides database (Drizzle ORM with sqlite/postgresql/mysql), KV storage, blob storage, and cache APIs. Covers configuration, schema definition, migrations, multi-cloud deployment (Cloudflare, Vercel), and the new hub:db, hub:kv, hub:blob virtual module imports.
license: MIT
---

# NuxtHub v0.10

Full-stack Nuxt framework with database, KV, blob, and cache. Multi-cloud support (Cloudflare, Vercel, Deno, Netlify).

**For Nuxt server patterns:** use `nuxt` skill (server.md)
**For content with database:** use `nuxt-content` skill

Migrating from v0.9.X? See [Migration Guide](https://hub.nuxt.com/docs/getting-started/migration).

## Installation

```bash
npx nuxi module add @nuxthub/core-nightly
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
    dir: '.data' // local storage directory
  }
})
```

## Database

Type-safe SQL via Drizzle ORM. Auto-imported on server-side.

### Schema Definition

Place in `server/db/schema.ts` or `server/db/schema/*.ts`:

```ts
// server/db/schema.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: integer({ mode: 'timestamp' }).defaultNow()
})
```

PostgreSQL variant:

```ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp().defaultNow()
})
```

### Database API

```ts
import { db, schema } from 'hub:db'
// db and schema are auto-imported on server-side

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
npx nuxt db generate              # Generate migrations from schema
npx nuxt db migrate               # Apply pending migrations
npx nuxt db sql "SELECT * FROM users"  # Execute raw SQL
npx nuxt db drop <TABLE>          # Drop a table
npx nuxt db mark-as-migrated [NAME]   # Mark without running
```

Migrations auto-apply during `npx nuxi dev` and `npx nuxi build`. Tracked in `_hub_migrations` table.

### Type Sharing

```ts
// shared/types/db.ts
import type { users } from '~/server/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### Database Providers

| Dialect    | Local                | Production                                                        |
| ---------- | -------------------- | ----------------------------------------------------------------- |
| sqlite     | `.data/db/sqlite.db` | D1 (Cloudflare), Turso (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) |
| postgresql | PGlite               | postgres-js (`DATABASE_URL`, `POSTGRES_URL`)                      |
| mysql      | -                    | mysql2 (`DATABASE_URL`, `MYSQL_URL`)                              |

## KV Storage

Key-value storage. Auto-imported on server-side.

### KV API

```ts
import { kv } from 'hub:kv'
// kv is auto-imported on server-side

await kv.set('key', { data: 'value' }) // Set value
await kv.set('key', value, { ttl: 60 }) // Set with TTL (seconds)
const value = await kv.get('key') // Get value
const exists = await kv.has('key') // Check existence
await kv.del('key') // Delete
const keys = await kv.keys('prefix:') // List keys by prefix
await kv.clear('prefix:') // Clear by prefix
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

File storage. Auto-imported on server-side.

### Blob API

```ts
import { blob } from 'hub:blob'
// blob is auto-imported on server-side

// Upload
const result = await blob.put('path/file.txt', body, { contentType: 'text/plain' })
// Returns: { pathname, contentType, size, httpEtag, uploadedAt }

// Download
const file = await blob.get('path/file.txt') // Returns Blob or null

// List
const { blobs, cursor, hasMore } = await blob.list({ prefix: 'uploads/', limit: 10 })

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
// Validate before upload
ensureBlob(file, { maxSize: '10MB', types: ['image/png', 'image/jpeg'] })

// All-in-one upload handler
export default defineEventHandler(async (event) => {
  return handleUpload(event, { maxSize: '10MB', types: ['image'] })
})

// Multipart upload for large files
const upload = await handleMultipartUpload(event)
```

### Vue Composables

```ts
// Client-side upload
const { upload } = useUpload('/api/upload')
await upload(file)

// Multipart upload with progress
const { upload, progress } = useMultipartUpload('/api/upload')
```

### Blob Providers

| Provider      | Package          | Config                                                               |
| ------------- | ---------------- | -------------------------------------------------------------------- |
| Cloudflare R2 | -                | `BLOB` binding in wrangler.jsonc                                     |
| Vercel Blob   | `@vercel/blob`   | `BLOB_READ_WRITE_TOKEN`                                              |
| S3            | `aws4fetch`      | `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_REGION` |
| Netlify Blobs | `@netlify/blobs` | `NETLIFY_BLOB_STORE_NAME`                                            |

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

### Route Rules

```ts
// nuxt.config.ts
routeRules: {
  '/blog/**': { cache: { maxAge: 3600 } }
}
```

### Cache Invalidation

```ts
// Remove specific
await useStorage('cache').removeItem('nitro:functions:getStars:repo-name.json')

// Clear by prefix
await useStorage('cache').clear('nitro:handlers')
```

## Deployment

### Cloudflare Workers

Create `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-db", "database_id": "<id>" }],
  "kv_namespaces": [
    { "binding": "KV", "id": "<kv-id>" },
    { "binding": "CACHE", "id": "<cache-id>" }
  ],
  "r2_buckets": [{ "binding": "BLOB", "bucket_name": "my-bucket" }]
}
```

Create resources:

```bash
npx wrangler d1 create my-db
npx wrangler kv namespace create KV
npx wrangler kv namespace create CACHE
npx wrangler r2 bucket create my-bucket
```

Required binding names: `DB`, `KV`, `CACHE`, `BLOB`.

Set `nitro.preset: 'cloudflare_module'` in nuxt.config.ts.

Deploy via Cloudflare Workers Builds:

1. Workers & Pages → Create → Import from Git
2. Build command: `pnpm build`
3. Deploy command: `npx wrangler deploy`

### Vercel

Use Vercel Marketplace for compatible storage:

- Database: Vercel Postgres, Turso
- KV: Vercel KV
- Blob: Vercel Blob

### Environment Variables (Optional)

For advanced features (presigned URLs, cache DevTools):

```bash
NUXT_HUB_CLOUDFLARE_ACCOUNT_ID=<account-id>
NUXT_HUB_CLOUDFLARE_API_TOKEN=<token>
NUXT_HUB_CLOUDFLARE_BUCKET_ID=<bucket-id>
NUXT_HUB_CLOUDFLARE_CACHE_NAMESPACE_ID=<namespace-id>
```

## Database Hooks (Nuxt Modules)

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

## Deprecated Features

Removed in v0.10 (Cloudflare-specific):

- `hubAI()` → Use AI SDK with Workers AI Provider
- `hubBrowser()` → Puppeteer
- `hubVectorize()` → Vectorize
- `hubAutoRAG()` → AutoRAG

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
- [Database](https://hub.nuxt.com/docs/features/database)
- [KV](https://hub.nuxt.com/docs/features/kv)
- [Blob](https://hub.nuxt.com/docs/features/blob)
- [Cache](https://hub.nuxt.com/docs/features/cache)
- [Deploy](https://hub.nuxt.com/docs/getting-started/deploy)
- [Legacy v0.9 docs](https://legacy.hub.nuxt.com)

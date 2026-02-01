# Wrangler Configuration for NuxtHub v0.10.6

**Default (Recommended):** NuxtHub auto-generates `wrangler.json` from your `hub` config in `nuxt.config.ts`. No manual wrangler.jsonc required.

**Note:** Node.js compatibility (`nodejs_compat`) is automatically enabled for Cloudflare Workers in v0.10.5+.

**Manual wrangler.jsonc:** Use when you need features not auto-generated (observability, migrations config, etc.) or prefer explicit file-based configuration.

## Minimal (Database Only)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db", "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }]
}
```

## Full Stack (DB + KV + Blob + Cache)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db", "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" }],
  "kv_namespaces": [
    { "binding": "KV", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
    { "binding": "CACHE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
  ],
  "r2_buckets": [{ "binding": "BLOB", "bucket_name": "my-app-bucket" }]
}
```

## Observability (Recommended for Production)

Enable logging to track performance and debug issues:

```jsonc
{
  "observability": {
    "logs": {
      "enabled": true,          // Enable log collection
      "head_sampling_rate": 1,  // Sample rate 0-1 (1 = 100% of requests)
      "invocation_logs": true,  // Log function invocations
      "persist": true           // Persist logs to storage
    }
  }
}
```

**Required permission:** `workers_observability` (edit) in your Cloudflare API token.

See [Cloudflare Observability docs](https://developers.cloudflare.com/workers/observability/logs/).

## D1 Migrations Configuration

Specify migrations table and directory:

```jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_id": "<id>",
    "migrations_table": "_hub_migrations",
    "migrations_dir": ".output/server/db/migrations/"
  }]
}
```

## Required Binding Names

| Feature      | Binding Name | Type         |
| ------------ | ------------ | ------------ |
| Database     | `DB`         | D1           |
| Key-Value    | `KV`         | KV Namespace |
| Cache        | `CACHE`      | KV Namespace |
| Blob Storage | `BLOB`       | R2 Bucket    |

## Creating Resources via CLI

```bash
# D1 Database
npx wrangler d1 create my-app-db
# Output: database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# KV Namespace for storage
npx wrangler kv namespace create KV
# Output: id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# KV Namespace for cache
npx wrangler kv namespace create CACHE
# Output: id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# R2 Bucket
npx wrangler r2 bucket create my-app-bucket
# Bucket name is used directly, no ID needed
```

## Multi-Environment Setup

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db-prod", "database_id": "prod-db-id" }],
  "env": {
    "staging": {
      "d1_databases": [{ "binding": "DB", "database_name": "my-app-db-staging", "database_id": "staging-db-id" }]
    }
  }
}
```

Deploy with: `CLOUDFLARE_ENV=staging nuxt build && npx wrangler deploy`

## Auto-Generation from nuxt.config (Recommended)

NuxtHub auto-generates `wrangler.json` at build time from your `hub` config:

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

**Advanced:** Use `nitro.cloudflare.wrangler` for explicit control:

```ts
export default defineNuxtConfig({
  nitro: {
    cloudflare: {
      wrangler: {
        compatibility_flags: ['nodejs_compat'],
        d1_databases: [{ binding: 'DB', database_id: '<id>' }],
        kv_namespaces: [
          { binding: 'KV', id: '<kv-id>' },
          { binding: 'CACHE', id: '<cache-id>' }
        ],
        r2_buckets: [{ binding: 'BLOB', bucket_name: '<bucket>' }]
      }
    }
  }
})
```

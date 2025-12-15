# Wrangler.jsonc Templates for NuxtHub v0.10

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

## With Preview Bindings (for wrangler dev)

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [{ "binding": "DB", "database_name": "my-app-db", "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "preview_database_id": "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy" }],
  "kv_namespaces": [
    { "binding": "KV", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "preview_id": "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" },
    { "binding": "CACHE", "id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "preview_id": "yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy" }
  ],
  "r2_buckets": [{ "binding": "BLOB", "bucket_name": "my-app-bucket", "preview_bucket_name": "my-app-bucket-preview" }]
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

Deploy with: `npx wrangler deploy --env staging`

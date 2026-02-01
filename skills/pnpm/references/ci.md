# CI/CD & Migration

## GitHub Actions

### Basic Setup

```yaml
name: CI
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
```

### With Store Caching

```yaml
- uses: pnpm/action-setup@v4
  with:
    version: 9

- name: Get pnpm store directory
  shell: bash
  run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

- uses: actions/cache@v4
  with:
    path: ${{ env.STORE_PATH }}
    key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-store-

- run: pnpm install --frozen-lockfile
```

### Monorepo - Build Changed Only

```yaml
- name: Build changed packages
  run: pnpm --filter "...[origin/main]" build
```

## GitLab CI

```yaml
image: node:20

variables:
  PNPM_HOME: /root/.local/share/pnpm
  PATH: $PNPM_HOME:$PATH

before_script:
  - corepack enable
  - corepack prepare pnpm@latest --activate

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .pnpm-store

install:
  script:
    - pnpm config set store-dir .pnpm-store
    - pnpm install --frozen-lockfile
```

## Docker

### Multi-Stage Build

```dockerfile
FROM node:20-slim AS builder
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-slim AS runner
RUN corepack enable
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod
CMD ["node", "dist/index.js"]
```

## Key CI Flags

```bash
--frozen-lockfile    # Always use in CI
--prefer-offline     # Use cached packages
--ignore-scripts     # Faster (careful: some deps need scripts)
```

## Corepack

```json
// package.json - Specify exact pnpm version
{
  "packageManager": "pnpm@10.28.2"
}
```

```yaml
# CI
- run: corepack enable
- run: pnpm install --frozen-lockfile
```

**Note:** pnpm 11+ ships with its own Node.js version and doesn't rely on system installation.

## Migration from npm

```bash
rm -rf node_modules package-lock.json
pnpm install
```

## Migration from Yarn

```bash
rm -rf node_modules yarn.lock
rm -rf .yarn .yarnrc.yml  # Yarn Berry
pnpm install
```

## Import Lockfile

```bash
pnpm import  # Creates pnpm-lock.yaml from existing lockfile
```

## Handling Phantom Dependencies

pnpm is strict - imports must be in package.json:

```bash
# Error: lodash not found (it's a transitive dep)
# Solution: add it explicitly
pnpm add lodash
```

## Symlink Issues

Some tools don't work with symlinks:

```ini
# .npmrc - Use npm-like flat structure
node-linker=hoisted
```

Or hoist specific packages:

```ini
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*babel*
```

## Monorepo Migration

1. Create `pnpm-workspace.yaml`:

   ```yaml
   packages:
     - 'packages/*'
   ```

2. Update internal deps to workspace protocol:

   ```json
   { "@myorg/utils": "workspace:^" }
   ```

3. Install:
   ```bash
   rm -rf node_modules packages/*/node_modules
   pnpm install
   ```

## Performance Tips

```ini
# .npmrc
prefer-offline=true
side-effects-cache=true
workspace-concurrency=4

onlyBuiltDependencies[]=esbuild
onlyBuiltDependencies[]=@swc/core
```

```bash
# Build changed only
pnpm --filter "...[origin/main]" build

# Parallel workspace
pnpm -r --parallel run test

# Clean store (v10.27+ includes global virtual store)
pnpm store prune
```

## Security Best Practices

```bash
# CI - prevent script execution
pnpm install --frozen-lockfile --ignore-scripts

# Use exact lockfile (prevents supply chain attacks)
pnpm install --frozen-lockfile

# Audit dependencies
pnpm audit
```

## Scripts Migration

```json
{
  "scripts": {
    // npm workspaces
    "build:all": "npm run build --workspaces",
    // pnpm
    "build:all": "pnpm -r run build",

    // npm specific workspace
    "dev:app": "npm run dev -w packages/app",
    // pnpm
    "dev:app": "pnpm --filter @myorg/app run dev"
  }
}
```

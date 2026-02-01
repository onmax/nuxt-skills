# Workspaces & Configuration

## pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*/packages/*'
  - '!**/test/**'  # Exclude

# Catalogs for shared versions
catalog:
  react: ^18.2.0
  typescript: ~5.3.0
  vite: ^5.0.0

catalogs:
  react17:
    react: ^17.0.2
    react-dom: ^17.0.2
  react18:
    react: ^18.2.0
    react-dom: ^18.2.0

# Overrides
overrides:
  lodash: ^4.17.21
  'foo@^1.0.0>bar': ^2.0.0

# Settings (alternative to .npmrc)
settings:
  auto-install-peers: true
  strict-peer-dependencies: false
  link-workspace-packages: true
```

## Workspace Protocol

Reference local packages:

```json
{
  "dependencies": {
    "@myorg/utils": "workspace:*",
    "@myorg/core": "workspace:^",
    "@myorg/types": "workspace:~"
  }
}
```

| Protocol           | Behavior    | Published As |
| ------------------ | ----------- | ------------ |
| `workspace:*`      | Any version | `1.2.3`      |
| `workspace:^`      | Compatible  | `^1.2.3`     |
| `workspace:~`      | Patch       | `~1.2.3`     |
| `workspace:^1.0.0` | Range       | `^1.0.0`     |

## Catalogs

Centralized version management - define dependency versions once, reference everywhere.

```yaml
# pnpm-workspace.yaml
catalog:
  lodash: ^4.17.21
  zod: ^3.22.0
```

```json
// package.json
{
  "dependencies": {
    "lodash": "catalog:",
    "zod": "catalog:"
  }
}
```

Named catalogs:

```json
{
  "dependencies": {
    "react": "catalog:react18"
  }
}
```

### Catalog Settings

```ini
# .npmrc
catalog-mode=manual     # Default - don't auto-add to catalog
catalog-mode=strict     # Fail if dep not in catalog
catalog-mode=prefer     # Use catalog version if exists, otherwise regular

cleanup-unused-catalogs=true  # Remove unused entries on install (v10.15+)
```

On publish, `catalog:` becomes actual version.

### Benefits

- **Unique versions** - Prevent version conflicts across workspace
- **Easy upgrades** - Update one place instead of many package.json files
- **Fewer merge conflicts** - Changes localized to workspace file

## .npmrc Settings

```ini
# Peer deps
auto-install-peers=true
strict-peer-dependencies=false

# Hoisting
public-hoist-pattern[]=*types*
public-hoist-pattern[]=*eslint*
shamefully-hoist=false

# Store
store-dir=~/.pnpm-store
virtual-store-dir=node_modules/.pnpm

# Lockfile
lockfile=true
prefer-frozen-lockfile=true

# Performance
side-effects-cache=true

# Registry
registry=https://registry.npmjs.org/
@myorg:registry=https://npm.myorg.com/

# Workspace
link-workspace-packages=true
prefer-workspace-packages=true
shared-workspace-lockfile=true
save-workspace-protocol=rolling
inject-workspace-packages=false  # Hard-link instead of symlink

# Node.js (use devEngines.runtime in pnpm 11+)
use-node-version=20.10.0
node-version-file=.nvmrc
```

## package.json pnpm Field

```json
{
  "pnpm": {
    "overrides": {
      "lodash": "^4.17.21"
    },
    "peerDependencyRules": {
      "ignoreMissing": ["@babel/*"],
      "allowedVersions": { "react": "17 || 18" },
      "allowAny": ["@types/*"]
    },
    "neverBuiltDependencies": ["fsevents"],
    "onlyBuiltDependencies": ["esbuild"],
    "patchedDependencies": {
      "express@4.18.2": "patches/express@4.18.2.patch"
    },
    "syncInjectedDepsAfterScripts": ["build"]  // v10.5+ - sync hardlinked deps after scripts
  }
}
```

## Configuration Hierarchy

1. `/etc/npmrc` - Global
2. `~/.npmrc` - User
3. `<project>/.npmrc` - Project
4. `npm_config_<key>=<value>` - Environment
5. `pnpm-workspace.yaml` settings

## Project Structure

```
my-monorepo/
├── pnpm-workspace.yaml
├── package.json
├── pnpm-lock.yaml
├── .npmrc
├── packages/
│   ├── core/
│   │   └── package.json
│   ├── utils/
│   │   └── package.json
│   └── types/
│       └── package.json
└── apps/
    ├── web/
    │   └── package.json
    └── api/
        └── package.json
```

## Workspace Scripts

```bash
# Install specific package dep
pnpm --filter @myorg/app add lodash

# Add workspace dep
pnpm --filter @myorg/app add @myorg/utils

# Run in topological order
pnpm -r run build

# Run in parallel
pnpm -r --parallel run test

# Execute in all packages
pnpm -r exec rm -rf dist
```

## Publishing

```bash
pnpm publish -r                    # Publish all changed
pnpm publish -r --no-git-checks    # CI mode
```

`workspace:*` → actual version on publish.

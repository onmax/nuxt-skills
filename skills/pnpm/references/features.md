# Features

## Overrides

Force specific versions of dependencies:

```yaml
# pnpm-workspace.yaml (recommended)
overrides:
  lodash: ^4.17.21
  'foo@^1.0.0': ^1.2.3           # Specific parent version
  'express>cookie': ^0.6.0        # Nested dep
  'underscore': 'npm:lodash@^4'   # Replace package
  'unwanted-pkg': '-'             # Remove entirely
```

Or in package.json:

```json
{
  "pnpm": {
    "overrides": {
      "lodash": "^4.17.21"
    }
  }
}
```

## Patches

Modify third-party packages:

```bash
# 1. Start patch
pnpm patch express@4.18.2
# Output: /tmp/abc123...

# 2. Edit files in temp dir
cd /tmp/abc123...
# Make changes

# 3. Commit patch
pnpm patch-commit /tmp/abc123...
```

Creates `patches/express@4.18.2.patch` and updates package.json:

```json
{
  "pnpm": {
    "patchedDependencies": {
      "express@4.18.2": "patches/express@4.18.2.patch"
    }
  }
}
```

```bash
pnpm patch-remove express@4.18.2  # Remove patch
```

## Aliases

Install packages under different names:

```json
{
  "dependencies": {
    "lodash3": "npm:lodash@3",
    "lodash4": "npm:lodash@4"
  }
}
```

```ts
import lodash3 from 'lodash3'
import lodash4 from 'lodash4'
```

Replace packages:

```json
{
  "dependencies": {
    "request": "npm:@cypress/request@^3.0.0"
  }
}
```

## Hooks (.pnpmfile.cjs)

```js
// .pnpmfile.cjs
function readPackage(pkg, context) {
  // Add missing peer dep
  if (pkg.name === 'broken-package') {
    pkg.peerDependencies = {
      ...pkg.peerDependencies,
      react: '*',
    }
  }

  // Override version
  if (pkg.dependencies?.lodash) {
    pkg.dependencies.lodash = '^4.17.21'
  }

  // Remove unwanted dep
  delete pkg.optionalDependencies?.fsevents

  return pkg
}

function afterAllResolved(lockfile, context) {
  context.log(`Resolved ${Object.keys(lockfile.packages || {}).length} packages`)
  return lockfile
}

function beforePacking(pkg, context) {
  // Customize package.json before publishing (v10.28+)
  pkg.main = './dist/index.js'
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
    afterAllResolved,
    beforePacking,  // v10.28+
  },
}
```

## Peer Dependencies

```ini
# .npmrc
auto-install-peers=true        # Default in pnpm v8+
strict-peer-dependencies=false # Don't fail on issues
```

Suppress warnings:

```json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["@babel/*", "eslint"],
      "allowedVersions": {
        "react": "17 || 18",
        "@types/react": "*"
      },
      "allowAny": ["@types/*"]
    }
  }
}
```

## Store

Content-addressable storage - packages stored once globally, hard-linked to projects.

```
~/.pnpm-store/              # Global store
└── v3/files/<hash>/

project/node_modules/
├── .pnpm/                  # Virtual store (hard links)
│   ├── lodash@4.17.21/
│   └── express@4.18.2/
├── lodash -> .pnpm/lodash@4.17.21/...
└── express -> .pnpm/express@4.18.2/...
```

### Node Linker Modes

```ini
# Default - strict, no phantom deps
node-linker=isolated

# npm-like flat structure
node-linker=hoisted

# Yarn PnP mode
node-linker=pnp
```

### Store Commands

```bash
pnpm store path
pnpm store prune
pnpm store status
```

### Troubleshooting

```ini
# For Docker/network drives
package-import-method=copy
```

## Side Effects Cache

Cache native module builds:

```ini
side-effects-cache=true
```

## Security

### Build Controls

```ini
# Only build specific deps
onlyBuiltDependencies[]=esbuild
onlyBuiltDependencies[]=sharp

# Skip all scripts
ignore-scripts=true

# Strict build deps (default in pnpm 11+)
strict-dep-builds=true
```

```json
{
  "pnpm": {
    "neverBuiltDependencies": ["fsevents", "cpu-features"]
  }
}
```

### Supply Chain Protection

pnpm 10.x+ includes security hardening:

- **Path traversal protection** - Validates symlinks in `file:` and `git:` dependencies
- **Tarball validation** - Prevents malicious extraction on Windows
- **Bin linking protection** - Validates `directories.bin` field

```bash
# Prevent postinstall scripts from running (reduces attack surface)
pnpm install --ignore-scripts

# Use lockfile strictly (ensures reproducible builds)
pnpm install --frozen-lockfile
```

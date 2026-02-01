# CLI Commands

## Installation

```bash
pnpm install              # Install all deps
pnpm i                    # Alias

pnpm install --frozen-lockfile  # CI mode - fail if lockfile outdated
pnpm install --prefer-offline   # Use cache when available
pnpm install --offline          # Use store only (no network)
pnpm install --prod             # Production only
pnpm install --no-optional      # Skip optional deps
pnpm install --ignore-scripts   # Skip lifecycle scripts

# Platform overrides (v10.14+)
pnpm install --cpu=arm64        # Override CPU architecture
pnpm install --os=darwin        # Override OS
pnpm install --libc=musl        # Override libc for native modules
```

## Adding Dependencies

```bash
pnpm add <pkg>            # Production dep
pnpm add -D <pkg>         # Dev dep
pnpm add -O <pkg>         # Optional dep
pnpm add -g <pkg>         # Global

pnpm add <pkg>@<version>  # Specific version
pnpm add <pkg>@next       # Tag
pnpm add <pkg>@^1.0.0     # Range
```

## Removing Dependencies

```bash
pnpm remove <pkg>
pnpm rm <pkg>
pnpm uninstall <pkg>
pnpm un <pkg>
```

## Updating Dependencies

```bash
pnpm update               # Update all
pnpm up <pkg>             # Update specific

pnpm up --latest          # Ignore semver
pnpm up -L                # Alias

pnpm up --interactive     # Interactive mode
pnpm up -i                # Alias
```

## Running Scripts

```bash
pnpm run <script>         # Run script
pnpm <script>             # Shorthand

pnpm run build -- --watch # Pass args
pnpm run --if-present build  # No error if missing
```

## Executing Binaries

```bash
pnpm exec <cmd>           # Run local binary
pnpm exec eslint .        # Example

pnpm dlx <pkg>            # Like npx, no install
pnpm dlx create-vite my-app
```

## Workspace Commands

```bash
pnpm -r run <script>      # Run in all packages
pnpm --recursive run <script>

pnpm -r --parallel run build    # Parallel
pnpm -r --stream run dev        # Stream output
pnpm -r --workspace-concurrency=1 run build  # Sequential
```

## Filtering

```bash
# By package name
pnpm --filter <name> <cmd>
pnpm -F <name> <cmd>
pnpm --filter "@scope/pkg" build

# By directory
pnpm --filter "./packages/core" test

# Glob patterns
pnpm --filter "@myorg/*" lint
pnpm --filter "!@myorg/internal-*" publish

# Dependencies of package
pnpm --filter "...@scope/app" build

# Dependents of package
pnpm --filter "@scope/core..." test

# Changed since git ref
pnpm --filter "...[origin/main]" build
pnpm --filter "[HEAD~5]" lint
```

## Link Packages

```bash
pnpm link --global        # Make global
pnpm link -g

pnpm link --global <pkg>  # Use linked package
```

## Patching

```bash
pnpm patch <pkg>@<version>     # Create temp dir for editing
pnpm patch-commit <path>       # Save patch
pnpm patch-remove <pkg>        # Remove patch
```

## Store Management

```bash
pnpm store path           # Show location
pnpm store prune          # Remove unused
pnpm store status         # Check integrity
pnpm store add <pkg>      # Add without installing
```

## Information Commands

```bash
pnpm list                 # List installed
pnpm ls --depth=0         # Top-level only
pnpm ls --json            # JSON output

pnpm why <pkg>            # Why installed
pnpm outdated             # Show outdated
pnpm audit                # Security check
```

## Other Commands

```bash
pnpm import               # Import from npm/yarn lockfile
pnpm rebuild              # Rebuild native modules
pnpm pack                 # Create tarball
pnpm publish              # Publish to registry
pnpm publish -r --no-git-checks  # CI publish
```

## Environment

```bash
# Using Corepack (recommended)
corepack enable
corepack prepare pnpm@latest --activate

# package.json - Specify pnpm version
{
  "packageManager": "pnpm@10.28.2"
}
```

## Version Notes

- **pnpm 10.x** - Current stable (recommended)
- **pnpm 11.x** - Alpha release with breaking changes (pure ESM, new config format)
  - Node.js v18/v19 support dropped
  - `.npmrc` project configs → `packageConfigs` in `pnpm-workspace.yaml`
  - New build permission system

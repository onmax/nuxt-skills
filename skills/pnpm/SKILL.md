---
name: pnpm
description: Fast, disk space efficient package manager for Node.js with strict dependency resolution and monorepo support
license: MIT
---

# pnpm

Content-addressable store, strict deps, workspace protocol, catalogs.

## When to Use

- Installing/managing npm packages
- Monorepo workspace setup
- Overriding transitive dependencies
- Patching third-party packages
- CI/CD configuration for pnpm projects

## Quick Start

```bash
pnpm install                      # Install deps
pnpm add <pkg>                    # Add dep
pnpm add -D <pkg>                 # Dev dep
pnpm -r run build                 # Run in all packages
pnpm --filter @myorg/app build    # Run in specific package
```

## Workspace Setup

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'

catalog:
  react: ^18.2.0
  typescript: ~5.3.0
```

```json
// package.json
{
  "dependencies": {
    "@myorg/utils": "workspace:^",
    "react": "catalog:"
  }
}
```

## Reference Files

| Task                             | File                                      |
| -------------------------------- | ----------------------------------------- |
| Commands, scripts, filtering     | [cli.md](references/cli.md)               |
| Workspaces, catalogs, config     | [workspaces.md](references/workspaces.md) |
| Overrides, patches, hooks, store | [features.md](references/features.md)     |
| CI/CD, Docker, migration         | [ci.md](references/ci.md)                 |

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/cli.md](references/cli.md) - if using pnpm commands, scripts, or filtering
- [ ] [references/workspaces.md](references/workspaces.md) - if setting up monorepo, catalogs, or workspace config
- [ ] [references/features.md](references/features.md) - if using overrides, patches, hooks, or managing store
- [ ] [references/ci.md](references/ci.md) - if configuring CI/CD, Docker, or migrating from npm/yarn

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Cross-Skill References

- **TypeScript libs** → Use `ts-library` skill for library patterns
- **Build tooling** → Use `tsdown` or `vite` skills

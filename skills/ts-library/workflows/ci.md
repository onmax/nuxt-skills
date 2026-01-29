# CI Workflows

## Basic CI

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm test
```

## Matrix Testing

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest]
        node: [20, 22, 24]
        include:
          - os: macos-latest
            node: 24
          - os: windows-latest
            node: 24
      fail-fast: false
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm
      - run: pnpm install
      - run: pnpm test
```

## Skip Docs-Only Changes

```yaml
jobs:
  changed:
    runs-on: ubuntu-latest
    outputs:
      should_skip: ${{ steps.check.outputs.only_changed == 'true' }}
    steps:
      - uses: tj-actions/changed-files@v47
        id: check
        with:
          files: |
            docs/**
            **.md

  test:
    needs: changed
    if: needs.changed.outputs.should_skip != 'true'
    # ... rest of job
```

## Auto-fix Commits

```yaml
- run: pnpm lint:fix
- uses: stefanzweifel/git-auto-commit-action@v5
  if: github.event_name == 'push'
  with:
    commit_message: 'chore: lint fix'
```

## Release on Tag (Token-based)

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: pnpm install
      - run: pnpm build
      - run: pnpm publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Release on Tag (OIDC - Recommended)

No NPM_TOKEN needed. Uses GitHub OIDC for tokenless auth with provenance.

```yaml
name: Release
permissions:
  id-token: write
  contents: write
  actions: read
on:
  push:
    tags: ['v*']

jobs:
  wait-for-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: lewagon/wait-on-check-action@v1.3.4
        with:
          ref: ${{ github.sha }}
          check-name: ci
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          wait-interval: 10

  release:
    needs: wait-for-ci
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24  # Required: npm 11.5.1+
          cache: pnpm
          registry-url: https://registry.npmjs.org
      - run: pnpm install
      - run: pnpm build
      - run: pnpm dlx changelogithub
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: pnpm publish --access public --no-git-checks --provenance
```

### OIDC Setup Steps

1. Open `https://www.npmjs.com/package/<PACKAGE_NAME>/access`
2. Scroll to "Publishing access" section
3. Click "Add GitHub Actions" under Trusted Publishers
4. Fill: Owner, Repository, Workflow file (`release.yml`), Environment (empty)
5. Click "Add"

### OIDC Requirements

1. **Node.js 24+** (npm 11.5.1+ required - Node 22 has npm 10.x which fails)
2. **Permissions**: `id-token: write`
3. **Publish flag**: `--provenance`
4. **package.json**: must have `repository` field
5. **npm 2FA**: "Require 2FA or granular access token" (allows OIDC)

### Troubleshooting

| Error                                 | Cause                | Fix                                       |
| ------------------------------------- | -------------------- | ----------------------------------------- |
| "Access token expired" E404           | npm too old          | Use Node.js 24                            |
| ENEEDAUTH                             | Missing registry-url | Add `registry-url` to setup-node          |
| "repository.url is empty" E422        | Missing field        | Add `repository` to package.json          |
| "not configured as trusted publisher" | Config mismatch      | Check owner, repo, workflow match exactly |

## Monorepo Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        package: [core, utils, cli]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm --filter ${{ matrix.package }} test
```

## Concurrency Control

Cancel outdated runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.number || github.sha }}
  cancel-in-progress: true
```

## pkg-pr-new for PRs

```yaml
# .github/workflows/pkg-pr-new.yml
name: Publish PR
on: pull_request

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm build
      - run: pnpm dlx pkg-pr-new publish --compact --pnpm
```

## Package Validation in CI

```yaml
- run: pnpm build
- run: pnpm dlx publint
- run: pnpm dlx @arethetypeswrong/cli --pack .
```

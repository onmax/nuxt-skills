# CI Workflow Templates

Copy-paste templates for GitHub Actions.

## Contents

- [ci.yml](#ciyml) - Lint, typecheck, test
- [pkg.yml](#pkgyml) - Preview packages via pkg-pr-new
- [release.yml](#releaseyml) - npm publish + GitHub release
- [npm Trusted Publishing Setup](#npm-trusted-publishing-setup)

---

## ci.yml

Runs lint, typecheck, and tests on every push/PR.

```yaml
name: ci

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install
      - run: pnpm dev:prepare
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
```

## pkg.yml

Publishes preview packages for every PR via pkg-pr-new.

```yaml
name: pkg.new

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  pkg:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install
      - run: pnpm dev:prepare
      - run: pnpm prepack
      - run: pnpm dlx pkg-pr-new publish
```

## release.yml

Triggered by tag push. Publishes to npm via OIDC (no token needed) + creates GitHub release.

```yaml
name: release

permissions:
  id-token: write
  contents: write

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install
      - run: pnpm dev:prepare
      - run: pnpm prepack

      - name: GitHub Release
        run: pnpm dlx changelogithub
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

      - name: Publish to npm
        run: npm publish --provenance --access public
```

## npm Trusted Publishing Setup

No `NPM_TOKEN` needed. Uses OIDC authentication.

1. Go to npmjs.com → your package → Settings
2. Find "Trusted Publisher" section
3. Click "GitHub Actions"
4. Add repository and workflow file (`release.yml`)

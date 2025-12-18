# CI Workflow Templates

Copy-paste templates for GitHub Actions. Requires `NPM_TOKEN` secret for release.

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

Triggered by tag push. Publishes to npm with provenance + creates GitHub release.

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
          node-version: 22
          cache: pnpm
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install
      - run: pnpm prepack

      - name: GitHub Release
        run: pnpm dlx changelogithub
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}

      - name: Publish to npm
        run: npm publish --provenance --access public
        env:
          NODE_AUTH_TOKEN: ${{secrets.NPM_TOKEN}}
```

## NPM_TOKEN Setup

1. npm → Access Tokens → Generate New Token → Granular Access
2. Select package, set Publish permission
3. GitHub repo → Settings → Secrets → Actions → `NPM_TOKEN`

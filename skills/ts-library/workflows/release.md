# Release Workflow

## Tools

| Tool        | Purpose                           |
| ----------- | --------------------------------- |
| bumpp       | Interactive version bumping       |
| changelogen | Changelog generation from commits |
| pkg-pr-new  | PR preview packages               |

## bumpp (Version Bumping)

```bash
pnpm add -D bumpp
```

```json
{
  "scripts": {
    "release": "bumpp"
  }
}
```

Interactive prompt for patch/minor/major. Options:

```json
{
  "scripts": {
    "release": "bumpp --commit --tag --push"
  }
}
```

For monorepos:

```bash
bumpp -r    # Recursive
bumpp packages/*/package.json  # Specific packages
```

## changelogen (Changelog)

```bash
pnpm add -D changelogen
```

```json
{
  "scripts": {
    "changelog": "changelogen --release"
  }
}
```

Combined workflow:

```json
{
  "scripts": {
    "release": "changelogen --release && bumpp"
  }
}
```

## Full Release Flow

```json
{
  "scripts": {
    "release": "pnpm lint && pnpm test && changelogen --release && bumpp --commit --tag --push"
  }
}
```

CI publishes to npm on tag push.

## pkg-pr-new (PR Previews)

For publishable packages. Creates install links on PRs.

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

For monorepos:

```bash
pnpm dlx pkg-pr-new publish --compact --pnpm './packages/*'
```

PR comment shows:

```
pnpm add https://pkg.pr.new/your-org/your-package@123
```

## Conventional Commits

For changelogen to work:

```
feat: add dark mode support
fix: resolve memory leak in parser
docs: update README
chore: update dependencies
```

## npm Publishing

### Token-based (legacy)

```yaml
- run: pnpm publish --access public --no-git-checks
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### OIDC (Recommended)

No token needed. See ci-workflows.md for full setup.

```yaml
- run: pnpm publish --access public --no-git-checks --provenance
```

## Monorepo Publishing

With pnpm:

```bash
pnpm -r publish --access public
```

With bumpp:

```bash
bumpp -r && pnpm -r publish
```

## Pre-release Versions

```bash
bumpp --preid beta   # 1.0.0 -> 1.0.1-beta.0
bumpp --preid alpha  # 1.0.0 -> 1.0.1-alpha.0
```

## Package.json Requirements

```json
{
  "name": "@scope/package",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/org/repo.git"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

`repository` required for npm provenance.

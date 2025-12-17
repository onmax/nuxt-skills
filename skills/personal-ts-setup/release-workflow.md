# Release Workflow

bumpp for versioning, changelogen for changelogs, pkg-pr-new for PR previews.

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

Interactive prompt: patch/minor/major. Options:

```json
{
  "scripts": {
    "release": "bumpp --commit --tag --push"
  }
}
```

For monorepos: `bumpp -r` (recursive).

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

Combined release:

```json
{
  "scripts": {
    "release": "changelogen --release && bumpp"
  }
}
```

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
      - run: pnpx pkg-pr-new publish
```

PR comment shows:

```
pnpm add https://pkg.pr.new/your-org/your-package@123
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

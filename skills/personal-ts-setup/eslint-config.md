# ESLint Configuration

@antfu/eslint-config with pre-commit hooks.

## Install

```bash
pnpm add -D eslint @antfu/eslint-config
```

## Config

```ts
// eslint.config.ts
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  vue: true,
  pnpm: true,
  ignores: ['dist', 'node_modules', '.nuxt', '.output']
})
```

For libraries, add `type: 'lib'`:

```ts
export default antfu({
  type: 'lib',
  formatters: true,
  pnpm: true,
})
```

## Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Pre-commit Hooks

```bash
pnpm add -D simple-git-hooks lint-staged
```

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  },
  "scripts": {
    "prepare": "simple-git-hooks"
  }
}
```

Run `pnpm prepare` after adding.

## VS Code Settings

```json
{
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.formatOnSave": false
}
```

## Nuxt Projects

Chain with Nuxt's generated config:

```ts
// eslint.config.mjs
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    unocss: true,
    pnpm: true,
    vue: true,
  }),
)
```

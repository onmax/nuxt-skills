# @antfu/eslint-config

Flat ESLint config that handles both linting and formatting - replaces Prettier.

## Setup

```bash
pnpm add -D eslint @antfu/eslint-config
```

```js
// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu()
```

```json
{ "scripts": { "lint": "eslint ." } }
```

## Configuration Options

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',        // 'lib' for libraries, 'app' for applications
  ignores: ['**/fixtures', '**/dist'],
  stylistic: { indent: 2, quotes: 'single' },
  typescript: true,   // Auto-detected
  vue: true,          // Auto-detected
})
```

## Framework Support

| Framework | Option         | Required Package                                        |
| --------- | -------------- | ------------------------------------------------------- |
| Vue       | `vue: true`    | (auto-detected)                                         |
| React     | `react: true`  | `@eslint-react/eslint-plugin eslint-plugin-react-hooks` |
| Next.js   | `nextjs: true` | `@next/eslint-plugin-next`                              |
| Svelte    | `svelte: true` | `eslint-plugin-svelte`                                  |
| Astro     | `astro: true`  | `eslint-plugin-astro`                                   |
| Solid     | `solid: true`  | `eslint-plugin-solid`                                   |
| UnoCSS    | `unocss: true` | `@unocss/eslint-plugin`                                 |

## Formatters (CSS, HTML, Markdown)

For files ESLint doesn't handle natively:

```js
export default antfu({
  formatters: {
    css: true,      // Prettier for CSS/LESS/SCSS
    html: true,     // Prettier for HTML
    markdown: 'prettier' // or 'dprint'
  }
})
// Requires: pnpm add -D eslint-plugin-format
```

## Rule Overrides

### Global

```js
export default antfu(
  { /* config options */ },
  { rules: { 'style/semi': ['error', 'never'] } }
)
```

### Per-integration

```js
export default antfu({
  vue: { overrides: { 'vue/operator-linebreak': ['error', 'before'] } },
  typescript: { overrides: { 'ts/consistent-type-definitions': ['error', 'interface'] } },
})
```

## Plugin Prefix Renaming

| New Prefix | Original               |
| ---------- | ---------------------- |
| `ts/*`     | `@typescript-eslint/*` |
| `style/*`  | `@stylistic/*`         |
| `import/*` | `import-lite/*`        |
| `node/*`   | `n/*`                  |
| `test/*`   | `vitest/*`             |

```ts
// eslint-disable-next-line ts/consistent-type-definitions
```

## Type-Aware Rules

```js
export default antfu({
  typescript: { tsconfigPath: 'tsconfig.json' },
})
```

## VS Code Settings

```jsonc
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit", "source.organizeImports": "never" },
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off", "fixable": true },
    { "rule": "format/*", "severity": "off", "fixable": true },
    { "rule": "*-indent", "severity": "off", "fixable": true },
    { "rule": "*-spacing", "severity": "off", "fixable": true }
  ],
  "eslint.validate": ["javascript", "typescript", "vue", "html", "markdown", "json", "yaml"]
}
```

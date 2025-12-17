# Project Scaffolding

## Nuxt App

```bash
npx nuxi@latest init my-app
cd my-app
pnpm install
```

Post-scaffold: add pnpm catalogs, eslint config, pre-commit hooks.

## Vite App

```bash
npm create vite@latest my-app -- --template vue-ts
cd my-app
rm package-lock.json
pnpm install
```

## TS Library (Single Package)

```bash
cp -r ~/templates/antfu/starter-ts my-lib
cd my-lib
rm -rf .git && git init
pnpm install
```

Uses tsdown for build, bumpp for release.

## TS Library (Monorepo)

```bash
cp -r ~/templates/antfu/starter-monorepo my-monorepo
cd my-monorepo
rm -rf .git && git init
pnpm install
```

Uses unbuild, pnpm workspaces with catalogs.

## Nuxt Module

```bash
npx nuxi module init my-module
cd my-module
pnpm install
```

Post-scaffold: add pnpm catalogs, changelogen, pkg-pr-new workflow.

## Build Tools

| Project Type   | Tool    | Why                          |
| -------------- | ------- | ---------------------------- |
| TS library     | unbuild | Dual ESM/CJS, auto-externals |
| Simple package | tsdown  | Fast, minimal config         |
| Nuxt module    | unbuild | Built into nuxi template     |

# Project setup, upgrades, and testing

## Inspect before changing

Read `package.json`, the lockfile, `nuxt.config.*`, and any extended layers. Use the installed Nuxt version as the capability boundary; avoid copying examples that require a newer release without upgrading deliberately.

A conventional Nuxt 4 application keeps client application code under `app/` and server code at the project root:

```text
app/
  app.vue
  assets/
  components/
  composables/
  layouts/
  middleware/
  pages/
  plugins/
server/
  api/
  middleware/
  plugins/
  routes/
  utils/
shared/
public/
nuxt.config.ts
```

`~` and `@` resolve from the application source directory. `~~` and `@@` resolve from the project root. Keep server-only code in `server/`, universal primitives in `shared/`, built assets in `app/assets/`, and files served unchanged in `public/`.

## Prepare and validate

Use the repository's package manager and existing scripts. The underlying Nuxt checks are:

```bash
npx nuxt prepare
npx nuxt typecheck
npx nuxt build
```

`prepare` regenerates `.nuxt` types after config, module, alias, or directory changes. `build` verifies the production server build. Use `nuxt generate` only when the target is a prerendered static output.

Nuxt deploys through Nitro presets. Prefer the platform integration or `NITRO_PRESET` over custom build adapters, and exercise the produced output when runtime behavior matters.

## Upgrade deliberately

```bash
npx nuxt upgrade
```

Read the release and migration notes across the actual version range, regenerate types, and test both SSR navigation and client navigation. Treat `future.compatibilityVersion` as an explicit migration experiment, not a default setting. Set `compatibilityDate` intentionally so Nitro behavior does not drift unnoticed.

## Testing

Use `@nuxt/test-utils` when a test needs the Nuxt runtime. Keep pure functions in an ordinary Node unit project because it is faster and avoids global Nuxt state.

```ts
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
```

Use `mountSuspended` or `renderSuspended` for components that depend on Nuxt injections, async setup, routing, or auto-imports. Use `setup`, `$fetch`, and browser helpers from `@nuxt/test-utils/e2e` for full application behavior. Do not mix Nuxt-runtime and end-to-end helpers in the same test environment.

## Completion checks

- Generated types are current and `nuxt typecheck` passes.
- The chosen output mode matches the deployment target.
- SSR and client navigation both preserve the expected data and state.
- Tests use the smallest environment that provides the required Nuxt behavior.

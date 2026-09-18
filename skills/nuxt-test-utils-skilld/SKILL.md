---
name: nuxt-test-utils-skilld
description: "ALWAYS use when writing code importing \"@nuxt/test-utils\". Consult for debugging, best practices, or modifying @nuxt/test-utils, nuxt/test-utils, nuxt test-utils, nuxt test utils, test-utils, test utils."
metadata:
  version: 4.0.0
  generated_by: cached
  generated_at: 2026-03-22
---

# nuxt/test-utils `@nuxt/test-utils`

**Version:** 4.0.0
**Deps:** @clack/prompts@1.0.0, @nuxt/devtools-kit@^2.7.0, @nuxt/kit@^3.21.0, c12@^3.3.3, consola@^3.4.2, defu@^6.1.4, destr@^2.0.5, estree-walker@^3.0.3, exsolve@^1.0.8, fake-indexeddb@^6.2.5, get-port-please@^3.2.0, h3@^1.15.5, h3-next@npm:h3@2.0.1-rc.11, local-pkg@^1.1.2, magic-string@^0.30.21, node-fetch-native@^1.6.7, node-mock-http@^1.0.4, nypm@^0.6.4, ofetch@^1.5.1, pathe@^2.0.3, perfect-debounce@^2.1.0, radix3@^1.1.2, scule@^1.3.0, std-env@^3.10.0, tinyexec@^1.0.2, ufo@^1.6.3, unplugin@^3.0.0, vitest-environment-nuxt@^1.0.1, vue@^3.5.27
**Tags:** alpha: 3.9.0-alpha.3, latest: 4.0.0

**References:** [package.json](./.skilld/pkg/package.json) — exports, entry points • [README](./.skilld/pkg/README.md) — setup, basic usage • [Docs](./.skilld/docs/_INDEX.md) — API reference, guides • [GitHub Issues](./.skilld/issues/_INDEX.md) — bugs, workarounds, edge cases • [GitHub Discussions](./.skilld/discussions/_INDEX.md) — Q&A, patterns, recipes • [Releases](./.skilld/releases/_INDEX.md) — changelog, breaking changes, new APIs

## Search

Use `skilld search` instead of grepping `.skilld/` directories — hybrid semantic + keyword search across all indexed docs, issues, and releases. If `skilld` is unavailable, use `npx -y skilld search`.

```bash
skilld search "query" -p @nuxt/test-utils
skilld search "issues:error handling" -p @nuxt/test-utils
skilld search "releases:deprecated" -p @nuxt/test-utils
```

Filters: `docs:`, `issues:`, `releases:` prefix narrows by source type.

<!-- skilld:api-changes -->
## API Changes

This section documents version-specific API changes — prioritize recent major/minor releases.

- BREAKING: Composables at top-level of `describe` block — v4 moved Nuxt initialization from `setupFiles` to `beforeAll` hook, causing `useRouter()`, `useRoute()`, `useNuxtApp()` and other composables to fail with `[nuxt] instance unavailable` when called outside of `beforeAll`/`beforeEach`/test block. Wrap at-describe-level usage in `beforeAll()` [source](./.skilld/releases/v4.0.0.md#later-environment-setup)

- BREAKING: `vi.mock` stricter exports — v4 (via vitest v4) throws error when accessing exports not returned by factory function, instead of silently returning `undefined`. Use `importOriginal` helper to preserve all exports [source](./.skilld/releases/v4.0.0.md#stricter-mock-exports)

- BREAKING: vitest peer dependency — v4 requires `vitest ^4.0.2` (from `^3.2.0`). Tightened dependency ranges for `happy-dom >=20.0.11`, `jsdom >=27.4.0`, `@jest/globals >=30.0.0`, `@cucumber/cucumber >=11.0.0`, `@testing-library/vue ^8.0.1` [source](./.skilld/releases/v4.0.0.md#peer-dependencies)

- NEW: `mockNuxtImport` original parameter — v4.0 passes original implementation to factory function, enabling natural partial mocking: `mockNuxtImport('useRoute', original => vi.fn(original))` [source](./.skilld/releases/v4.0.0.md#highlights)

- NEW: `registerEndpoint` query parameter support — v4.0 fixed long-standing issue where `registerEndpoint` did not work correctly with query parameters in URLs (#1560) [source](./.skilld/releases/v4.0.0.md#registerendpoint-improvements)

- NEW: `registerEndpoint` `once` option — v3.21 added `once` option to `registerEndpoint` for single-use endpoint registration [source](./.skilld/releases/v3.21.0.md:L18)

- NEW: `renderSuspended` rerender behavior — v3.21 added support for rerender behavior in `renderSuspended` helper (#1466) [source](./.skilld/releases/v3.21.0.md:L17)

- NEW: CSS modules in mount/render helpers — v3.21 added support for CSS modules in `mount` and `render` helpers (#1464) [source](./.skilld/releases/v3.21.0.md:L19)

- NEW: `cleanup` `scoped` option — v3.20 added `scoped` option to `cleanup` components for targeted cleanup (#1389) [source](./.skilld/releases/v3.20.0.md:L19)

- NEW: `registerEndpoint` with native fetch — v3.20 enabled `registerEndpoint` to work with native `fetch` and `$fetch.create` (#1415, #1403) [source](./.skilld/releases/v3.20.0.md:L18)

- NEW: `wrapper.vm` automatic ref unwrapping — v3.20 added automatic ref unwrapping for `wrapper.vm` property, simplifying access to unwrapped reactive values (#1405) [source](./.skilld/releases/v3.20.0.md:L17)

- NEW: `mockNuxtImport` mocked target arguments — v3.21 added support for mocked target arguments in `mockNuxtImport` (#1492) [source](./.skilld/releases/v3.21.0.md:L21)

- NEW: Mocking before Nuxt startup — v4.0 moved Nuxt initialization to `beforeAll` hook, allowing `vi.mock` and `mockNuxtImport` to take effect before Nuxt starts, fixing unreliable mocking of composables used in middleware and plugins (#1516, #750, #836, #1496) [source](./.skilld/releases/v4.0.0.md#better-mocking-support)

- NEW: setupBun timeouts — v4.0 added support for setup and teardown timeouts configuration in `setupBun` (#1578) [source](./.skilld/releases/v4.0.0.md:L137)

**Also changed:** Route sync emulation skipped when `NuxtPage` exists (v3.22) · Initial route change can be skipped via option (v3.22) · h3 v2 support (v3.23) · mount + render helpers unified logic (v3.22) · App context passed across mount + render helpers (v3.21)
<!-- /skilld:api-changes -->

<!-- skilld:best-practices -->
## Best Practices

- Move Nuxt composable calls to `beforeAll` or `beforeEach` hooks, not describe block scope — Nuxt initialization moved to `beforeAll` in v4.0.0, causing describe-level composable calls to fail with "instance unavailable" error [source](./.skilld/releases/v4.0.0.md#later-environment-setup)

- Use `mockNuxtImport` with the original implementation parameter for natural partial mocking — v4.0.0 passes the original factory to enable spreading and modifying without infinite loops [source](./.skilld/releases/v4.0.0.md#better-mocking-support)

```ts
mockNuxtImport('useRoute', original =>
  vi.fn(original))
```

- Extract `import.meta.server` and `import.meta.client` to a helper module before mocking — direct assignment to `import.meta` doesn't work; wrap in a re-export and mock that instead [source](./.skilld/discussions/discussion-884.md)

- Use `.env.test` file for test-specific environment variables instead of config — Vitest loads `.env.test` automatically for test runs while preserving actual app config [source](./.skilld/discussions/discussion-838.md)

- Use `vi.hoisted()` for mock factories to optimize module graph — avoids eager imports of large dependency trees that `mockNuxtImport` requires [source](./.skilld/discussions/discussion-857.md)

```ts
const mocks = vi.hoisted(() => ({
  navigateTo: vi.fn(),
  useRouter: vi.fn(),
}))
vi.mock('#app/composables/router', () => mocks)
```

- Place server/API tests in the `nuxt` environment, not `node` — server code needs Nuxt magic (auto-imports, composables); `node` environment is only for pure utilities [source](./.skilld/discussions/discussion-1407.md)

- Mock Pinia stores by wrapping the store import with `createTestingPinia` — avoid Symbol conflicts when using `@pinia/nuxt` module by providing testing instance to store function [source](./.skilld/issues/issue-523.md)

- Use `scoped` option in cleanup for isolated component state — v3.20.0 added `cleanup({ scoped: true })` to prevent test isolation issues with component instances [source](./.skilld/releases/v3.20.0.md#enhancements)

- Enable automatic ref unwrapping with `wrapper.vm` — v3.20.0 unwraps refs automatically, eliminating `.value` calls for cleaner test assertions [source](./.skilld/releases/v3.20.0.md#enhancements)

- Use `registerEndpoint` in setup files for persistent mock routes — v4.0.0 ensures endpoints persist across module resets and supports query parameters [source](./.skilld/releases/v4.0.0.md#registerendpoint-improvements)
<!-- /skilld:best-practices -->

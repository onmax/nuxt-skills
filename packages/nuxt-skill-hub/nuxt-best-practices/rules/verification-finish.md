## Verification and Finish

### `verify-check-the-intended-surface`: Verify the intended framework surface, not only the visible result
**Apply when:** before concluding any Nuxt change.
**Skip when:** the prompt explicitly asks for a framework-agnostic implementation.

Do not stop once the UI looks right or the one failing line changed. Re-read the final primitive, composable, or component choice.

**Why:** framework tasks often fail because the behavior is visibly fixed but implemented through the wrong abstraction.
**Verify:** the solution uses the Nuxt, Nuxt Content, or Nuxt UI surface the task expects.

### `verify-second-surface-before-finish`: Check for a second required surface before finishing
**Apply when:** tasks involve errors, layout plus page behavior, or server/client boundaries.
**Skip when:** the task is intentionally isolated to one surface.

Common pairs:
- `app/error.vue` (global) and `<NuxtErrorBoundary>` (local)
- layout file and the page's `definePageMeta`
- `server/api/*` route and its client caller
- `definePageMeta` and `useHead`/`useSeoMeta`

**Why:** Nuxt patterns often span more than one file or render surface, especially around errors and privileged data flow.
**Verify:** both surfaces are updated, or the second is explicitly ruled out.

### `verify-version-sensitive-api-shapes`: Re-check version-sensitive API shapes before finalizing
**Apply when:** using components or module APIs that have plausible older alternatives.
**Skip when:** the project intentionally wraps the upstream API with a different contract.

When a prop, slot name, or composable signature feels close but uncertain, re-check the installed skill or linked docs rather than memory.

**Why:** version drift shows up as almost-right component or module usage that passes casual review but is wrong for the installed version.
**Verify:** names, slots, and state models (`v-model:*`, item and column shapes) match the installed version's docs.

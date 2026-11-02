---
name: yapyak
description: "yapyak, an i18n compiler with a small runtime: t() with the source string as the key, ICU plurals and selects, rich text, format.* for numbers, dates and lists, locale switching and persistence, yapyak.config.ts, translators, the yapyak CLI, and YAPnnnn diagnostics. Use when adding or editing user-facing text in a project that depends on yapyak, when setting up @yapyak/vite, @yapyak/react, @yapyak/vue, @yapyak/svelte, @yapyak/astro, @yapyak/nuxt, @yapyak/react-router, @yapyak/sveltekit or @yapyak/tanstack-start, or when a YAP diagnostic fires."
license: MIT
metadata:
  source: https://github.com/yapyak/yapyak/tree/main/skills/yapyak
---

yapyak compiles `t('Save changes')` into the module that renders it. The source string is the key. On save, the yapyak plugin extracts every `t()` call, writes an empty stub to each locale file, and fills the stub through a translator when one is configured.

Read the reference for the project's framework before writing setup or component code:

| Framework | Reference |
| --- | --- |
| React with Vite | [references/react.md](references/react.md) |
| React Router | [references/react-router.md](references/react-router.md) |
| TanStack Start | [references/tanstack-start.md](references/tanstack-start.md) |
| Vue with Vite | [references/vue.md](references/vue.md) |
| Nuxt | [references/nuxt.md](references/nuxt.md) |
| Svelte with Vite | [references/svelte.md](references/svelte.md) |
| SvelteKit | [references/sveltekit.md](references/sveltekit.md) |
| Astro | [references/astro.md](references/astro.md) |

Every `YAPnnnn` diagnostic, its cause, and its fix: [references/diagnostics.md](references/diagnostics.md)

## Install

Requirements: Node.js 22.22+, Vite 8+. Frameworks: React 19+, Vue 3.4+, Svelte 5+, Astro 7+, Nuxt 4.1+, React Router 7.9+, SvelteKit 3+, TanStack Start 1.168+.

| Framework | Install | Build config | Processor |
| --- | --- | --- | --- |
| React | `npm install yapyak @yapyak/vite @yapyak/react` | `plugins: [react(), yapyak()]` | `react()` from `@yapyak/react/processor` |
| React Router | add `@yapyak/react-router` | `plugins: [reactRouter(), yapyak()]` | `react()` |
| TanStack Start | add `@yapyak/tanstack-start` | `plugins: [tanstackStart(), react(), yapyak()]` | `react()` |
| Vue | `npm install yapyak @yapyak/vite @yapyak/vue` | `plugins: [vue(), yapyak()]` | `vue()` from `@yapyak/vue/processor` |
| Nuxt | `npx nuxi module add yapyak` | `modules: ['@yapyak/nuxt']` | `nuxt()` from `@yapyak/nuxt/processor` |
| Svelte | `npm install yapyak @yapyak/vite @yapyak/svelte` | `plugins: [svelte(), yapyak()]` | `svelte()` from `@yapyak/svelte/processor` |
| SvelteKit | add `@yapyak/sveltekit` | `plugins: [sveltekit(), yapyak()]` | `svelte()` |
| Astro | `npm install yapyak @yapyak/astro` | `integrations: [yapyak()]` from `@yapyak/astro/integration` | `astro()` from `@yapyak/astro/processor` |

Steps, in order:

1. Install the packages. Add a translator package when the project translates with a model: `@yapyak/anthropic`, `@yapyak/openai`, `@yapyak/gemini`, `@yapyak/ollama`, or `@yapyak/claude-code`.
2. Register the plugin in the build config, after the framework plugin. `yapyak` is a named export of `@yapyak/vite`.
3. Create `yapyak.config.ts` at the project root with the processor for the framework:

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { react } from '@yapyak/react/processor';

export default defineConfig({
  processors: [react()]
});
```

4. Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`. Nuxt adds the types on its own.
5. Add the first target locale: `npx yapyak add sv`. This creates `locales/sv.json` and regenerates the `Locale` type.
6. Add `.yapyak/` to `.gitignore`. It holds the orphan cache; the locale files are the committed source of truth.

Register one processor per framework in the project. The built-in parser reads `.ts`, `.tsx`, `.js`, `.jsx`, `.mts`, `.mjs`, `.cts`, and `.cjs` without one.

## Writing text

Wrap every user-facing string in `t()` from `yapyak`. Write the sentence in the source language exactly as the reader sees it; it is the key.

```ts
// ✓ The sentence is the key
t('Save changes');

// ✗ A synthetic key has no source string to translate
t('common.buttons.save');
```

Call `t()` inside the component or function that renders the text. A module-scope call evaluates once and never follows the active locale (`YAP0055`).

```ts
// ✓ Reads the active locale on every render
function SaveButton() {
  return t('Save changes');
}

// ✗ Evaluates once when the module loads
const label = t('Save changes');
```

Write the source as a static string literal and the params as an inline object literal. The compiler reads neither from a variable.

```ts
// ✓ Static source, inline params
t('Hi {name}', { name });

// ✗ Template literal (YAP0002)
t(`Hi ${name}`);

// ✗ Variable source
t(label);

// ✗ Params in a variable (YAP0006)
t('Hi {name}', params);
```

Never concatenate around `t()` → put the moving part in a placeholder.

```ts
// ✓ One message, one placeholder
t('{count} items in your cart', { count });

// ✗ Word order differs per language
t('You have') + ' ' + count + ' ' + t('items');
```

Call `t()` in attribute positions too: `aria-label={t('Pause')}`, `:title="t('Settings')"`, `placeholder={t('Search')}`. The attribute name is part of the call-site context the translator receives.

### Placeholders

Write `{name}` in the source and pass the value under the same name. TypeScript derives the required keys from the source string.

| Form | Example | Value type |
| --- | --- | --- |
| Plain | `t('Hi {name}', { name })` | `string \| number`, rendered as its string form |
| Number | `t('Total {n, number, integer}', { n })` | `number`; styles `decimal`, `integer`, `percent`, `currency <ISO 4217>` |
| Date | `t('Updated {when, date, long}', { when })` | `Date` or millisecond timestamp; styles `short`, `medium`, `long`, `full` |
| Time | `t('Doors open at {when, time, short}', { when })` | `Date` or millisecond timestamp; styles `short`, `medium`, `long`, `full` |
| Plural | `t('{count, plural, one {# item} other {# items}}', { count })` | `number` |
| Ordinal | `t('{place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}', { place })` | `number` |
| Select | `t('{role, select, admin {Admin panel} other {Reader view}}', { role })` | `string`; a non-string is coerced with `String()` |

Name a placeholder with letters, digits, and underscores, starting with a letter or underscore (`YAP0052`). Non-ASCII letters are allowed.

Rules for `plural`, `selectordinal`, and `select`:

- Write an `other` branch (`YAP0008`).
- Write `#` inside a plural branch for the formatted count.
- Write `=0`, `=1` for an exact value; exact matches are tried before categories.
- Name plural branches with the CLDR keywords `zero`, `one`, `two`, `few`, `many`, `other` (`YAP0046`).
- Write only the branches the source language uses, `one` and `other` for English; the translator adds the branches each target locale needs.
- Nest freely: a branch is a full message and holds placeholders, plurals, and selects.
- Split a message that has become unreadable into two `t()` calls and let the component pick.
- Type a `select` value as a union literal so every legal value has a branch.

Format a list with `format.list()` outside the message and pass the result in as a placeholder. Format relative time with `format.relativeTime()` outside the message.

### Homonyms

Split two calls with the same source and different meanings with `t.as(context, source)`:

```ts
t.as('action', 'Open');

t.as('status', 'Open');
```

- Write the context as a short literal label (`action`, `status`, `noun`, `verb`), never a variable (`YAP0017`).
- Use `t.as()` for every occurrence of that source in the source file. Mixing `t('Open')` and `t.as('action', 'Open')` in one file is an error (`YAP0018`).
- Use plain `t()` when the source has one meaning. A lone context is an error (`YAP0019`).

### Forced locale

- Write `t.in(locale, source)` for the translation in a forced locale regardless of the active one. The locale argument is typed against `Locale`.
- Chain `t.in('sv').as('action', 'Open')` or `t.as('action').in('sv', 'Open')` when both apply.
- Complete the chain in one expression. A chain stored in a variable is an error (`YAP0020`).

### Rich text

Write tags inside the source and bind each tag to a handler in `<RichText>` from the framework's adapter package.

```ts
t('Read our <link>privacy policy</link> for details.');

t('Line one<br/>line two');
```

| Tag | Form | Handler |
| --- | --- | --- |
| Pair | `<link>…</link>` | Receives the wrapped children |
| Void | `<br/>` | Receives nothing |

- Start a tag name with a letter and continue with letters or digits.
- Name a tag by meaning (`link`, `strong`, `price`), never by HTML element; the element belongs in the handler.
- Bind a handler for every tag in the source.
- Never write attributes on a tag → put the `href` in the handler.
- Walk the structure with `parseRichText(value)` from `yapyak`, which returns `RichTextNode[]`, when `<RichText>` does not fit.

Take the handler shape from the framework's reference file.

## Formatting outside messages

Format values outside a message with `format` from `yapyak`. Every call reads the active locale.

| Method | Backed by | Note |
| --- | --- | --- |
| `format.number(value, options)` | `Intl.NumberFormat` | `style: 'currency'` requires `currency`; `style: 'unit'` requires `unit` |
| `format.dateTime(value, options)` | `Intl.DateTimeFormat` | `dateStyle` and `timeStyle` presets, or field options |
| `format.list(items, options)` | `Intl.ListFormat` | Run each item through `t()` first |
| `format.relativeTime(value, unit, options)` | `Intl.RelativeTimeFormat` | Negative is past; `numeric: 'auto'` gives `yesterday` |
| `format.displayName(code, type, options)` | `Intl.DisplayNames` | `type` is `language`, `region`, `script`, `currency`, `calendar`, or `dateTimeField` |
| `format.in(locale)` | | Returns a `format` scoped to a forced locale |

- Use `format.*` for a value outside a message and an ICU sub-format for a value inside one.
- Type a currency code as `Currency` from `yapyak`; narrow user input with `isCurrency(value)`.
- Label a locale switcher with `format.in(value).displayName(value, 'language')`, never with a `t()` call per language.
- An unsupported currency, unit, time zone, or display-name code renders a fallback instead of throwing and reports `YAP0035`, `YAP0036`, `YAP0037`, or `YAP0056`.

## The active locale

A locale is the BCP 47 tag of a file in `localesDir`: `sv` for `locales/sv.json`, `en-GB` for `locales/en-GB.json`. Write tags as `lowercase-Titlecase-UPPERCASE` (`zh-Hant-TW`). The `Locale` type is the union of the files on disk and refreshes on `yapyak add`.

The active locale resolves in this order, first value wins: a persisted choice, a detected locale when `detectUserLocale` is on, then `defaultLocale`.

| Export from `yapyak` | Use |
| --- | --- |
| `getLocale()` | The active locale, outside components |
| `setLocale(locale)` | Switch and persist; ignored with a warning for an unknown value (`YAP0028`) |
| `locales` | Every added locale, for a switcher |
| `defaultLocale` | The locale when no persisted or detected locale matches |
| `isLocale(value)` | Type guard for a canonical string |
| `parseLocale(value)` | Normalizes casing, returns `Locale` or `undefined` |
| `getLocaleFallbackChain(locale)` | `['zh-Hant-TW', 'zh-Hant', 'zh']`; `defaultLocale` is not appended |
| `getTextDirection(locale)` | `'rtl'` or `'ltr'` for `<html dir>` |

Read and switch the locale inside a component through the framework binding; never call `getLocale()` or `setLocale()` there.

| Framework | Binding |
| --- | --- |
| React | `const [locale, setLocale] = useLocale()`; `useTextDirection()` |
| Vue, Nuxt | `locale` ref (`locale.value`, or `locale` in a template); `textDirection` ref |
| Svelte, SvelteKit | `locale.current`; `textDirection.current` |
| Astro | `getLocale()` in frontmatter; the middleware binds it per request |

Narrow a string from a URL, a form, or a cookie with `isLocale()` or `parseLocale()` before `setLocale()`.

## `yapyak.config.ts`

Every field is optional. Export the result of `defineConfig` from `yapyak/config`.

| Field | Default | Sets |
| --- | --- | --- |
| `sourceLocale` | `defaultLocale` | The language the source strings are written in. Set it only when it differs from `defaultLocale` |
| `defaultLocale` | `'en'` | The locale when no persisted or detected locale matches |
| `localesDir` | `'locales'` | The directory of locale files, relative to the project root |
| `include` | `['.']` | Directories, globs, or `RegExp` to scan; replaces the default |
| `exclude` | tests, `*.d.ts`, `node_modules`, `dist`, `build`, `coverage`, `yapyak.config.*` | Files to skip; replaces the default. Extend with `[...DEFAULT_EXCLUDE, '**/*.vendor.ts']` |
| `processors` | `[]` | One per framework |
| `translator` | none | The translator that fills stubs |
| `autoTranslateThreshold` | `20` | New strings in one save above which the save loop writes stubs but skips the translator. `0` turns auto-translation off |
| `preserveTranslationsOnSourceEdit` | `true` without a translator, `false` with one | Keep the translation when a source string is edited in place |
| `persistence` | `'none'` | Where the active locale is stored between page loads |
| `detectUserLocale` | `false` | Match `Accept-Language` on the server and `navigator.languages` in the browser on a first visit |
| `syncHtmlAttributes` | `false` | Keep `<html lang>` and `<html dir>` in step with the active locale on every change |

| Processor | Option | Use |
| --- | --- | --- |
| `react({ rsc: true })` | `rsc` | React Server Components: only `'use client'` files subscribe to the locale |
| `nuxt({ explicitImports: true })` | `explicitImports` | Another global `t` exists in the project |
| `vue()`, `svelte()`, `astro()` | none | |

### Persistence

| Value | Options | Fits |
| --- | --- | --- |
| `'none'` | | Kiosk, development build, locale carried by another system. A reload returns to `defaultLocale` |
| `'cookie'` | `{ type: 'cookie', name: 'locale', secure: false }` | SSR apps. The adapter reads the cookie per request; `setLocale()` on the server buffers a `Set-Cookie` |
| `'local-storage'` | `{ type: 'local-storage', key: 'locale' }` | Client-only apps. Under SSR the first render uses `defaultLocale` and flips after hydration |
| `'url'` | `{ type: 'url', match: /[?&]lang=(?<locale>[^&]+)/ }` | Locale in the path (`/sv/settings`, the default reads the first segment) or in a query string |

- Under `'url'`, switch by navigating. `setLocale()` is a no-op and reports `YAP0026`.
- Set `secure: true` on the cookie in production only; on plain HTTP the browser refuses the write.

### Fixed-locale builds

- Set `fixedLocale` in the build config, never in `yapyak.config.ts`. Every `t()` compiles to the literal of that locale and the runtime disappears from the bundle.
- Drive a CI matrix from an environment variable. With the variable unset, the build is a normal multi-locale build.
- Pass an added locale; the build throws otherwise.

| Framework | Where |
| --- | --- |
| Vite (React, Vue, Svelte, React Router, SvelteKit, TanStack Start) | `yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })` in `vite.config.ts` |
| Astro | `yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })` in `astro.config.ts` |
| Nuxt | `yapyak: { fixedLocale: process.env.YAPYAK_LOCALE }` in `nuxt.config.ts` |

## Locale files

One JSON file per target locale in `localesDir`. The source language has no file. Entries nest under the source file's path, then the source string:

```json
{
  "src/components/save-button.tsx": {
    "Save changes": "Spara ändringar"
  }
}
```

A homonym nests its contexts under the source:

```json
{
  "src/components/dialog.tsx": {
    "Open": {
      "action": "Öppna",
      "status": "Öppen"
    }
  }
}
```

- An empty string is an empty stub. The runtime renders the source string for it.
- Hand-edit a value to correct or replace a translation. The running app updates through HMR.
- Keep every placeholder, tag, and ICU structure of the source in the translation (`YAP0010`, `YAP0011`, `YAP0012`, `YAP0038`, `YAP0045`, `YAP0050`, `YAP0051`). Placeholder names stay fixed; their position in the sentence is free.
- Never edit a key → change the source string in the component; the compiler rewrites the key.
- Never add an entry by hand → write the `t()` call; the save loop or `yapyak translate` creates the stub.
- Renames and moves of source files restore translations from the orphan cache in `.yapyak/orphans.json` on the next save. Deleting `.yapyak/` loses nothing committed.
- Orphans stay in the locale file until `yapyak clean --write` removes them.

Fill empty stubs by hand only when the project has no translator or the user asks for it.

## Translators

A translator fills empty stubs on save and in `yapyak translate`. Requests go from the developer's machine to the provider. Set one in `yapyak.config.ts`:

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { anthropic } from '@yapyak/anthropic';

export default defineConfig({
  translator: anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    glossary: { cart: { sv: 'kundvagn' } },
    voice: 'Concise and friendly'
  })
});
```

| Package | Factory | Key | Defaults that differ |
| --- | --- | --- | --- |
| `@yapyak/anthropic` | `anthropic({ apiKey })` | `ANTHROPIC_API_KEY` | |
| `@yapyak/openai` | `openai({ apiKey })` | `OPENAI_API_KEY` | Extras `seed`, `organization`, `user`; other OpenAI-compatible endpoints through `endpoint` and `headers` |
| `@yapyak/gemini` | `gemini({ apiKey })` | `GEMINI_API_KEY` | `batchSize: 15` |
| `@yapyak/ollama` | `ollama()` | none | `endpoint: 'http://localhost:11434/api/generate'`, `model: 'llama3.1'`, `timeout: 120_000`, `maxRetries: 1`, `batchSize: 8` |
| `@yapyak/claude-code` | `claudeCode()` | the signed-in `claude` CLI | `concurrency: 2`, `timeout: 120_000`; no HTTP options; `model` falls back to the CLI's |

| Shared option | Default | Sets |
| --- | --- | --- |
| `model` | per provider | Model identifier |
| `voice` | none | One or two sentences of tone guidance |
| `glossary` | `{}` | `Record<source term, Record<locale, translation>>`; pinned brand names, domain terms, and words the model gets wrong |
| `context` | `'minimal'` | `'none'` sends the source string only; `'rich'` adds the surrounding code |
| `examples` | `5`, `0` under `context: 'none'` | Existing translations sent per request as style reference |
| `temperature` | `0.2` | Sampling temperature |
| `maxTokens` | per provider | Output token cap |
| `timeout` | `30_000` | Per-request timeout in milliseconds |
| `maxRetries` | `2` | Retries on 408, 429, 5xx, and network failures |
| `batchSize` | `25` | Source strings per request |
| `concurrency` | `5` | Parallel requests |
| `headers` | `{}` | Extra HTTP headers |
| `endpoint` | per provider | API URL |

- The `t.as()` context is sent at every `context` level.
- A voice or glossary change affects new translations only. Run `yapyak translate --force` or `yapyak retranslate "<source>"` to propagate it.
- Pick the translator by environment when CI has no signed-in CLI: `process.env.CI ? anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : claudeCode()`.

A custom translator is `createTranslator({ id, translate })` from `yapyak/translator`:

- `translate({ items, signal, sourceLocale, targetLocales })` returns one object per item, in item order, keyed by every target locale.
- Forward `signal` to the request.
- Throw `TranslatorAuthError`, `TranslatorRateLimitError`, `TranslatorTimeoutError`, `TranslatorNetworkError`, `TranslatorSafetyError`, `TranslatorInvalidResponseError`, or `TranslatorTruncatedError` from `yapyak/translator`.
- Retry inside the callback. yapyak runs it once.

## CLI

Run through the package manager: `npx yapyak <command>`, `pnpm yapyak <command>`, `bunx yapyak <command>`. Every command except `info` walks the source files first, so a `t()` call added without the dev server running is still found.

| Command | Does | Exit code |
| --- | --- | --- |
| `yapyak add <locale> [<locale>...]` | Creates the locale file, fills it through the translator, regenerates the `Locale` type. Several tags in one run share requests | non-zero on an unrecognized tag |
| `yapyak translate [<locale>] [--force]` | Fills empty stubs. `--force` re-translates every entry and overwrites hand-edits | `1` without a translator |
| `yapyak retranslate "<source>" [--locale <code>] [--as <ctx>] [--file <path>]` | Re-translates one source string; the flags compose | `0` when nothing matches |
| `yapyak status [--json]` | Coverage per locale | `1` when a translation is missing |
| `yapyak check` | Missing translations, compile-time diagnostics, ICU mismatches | `1` on any finding |
| `yapyak clean [--write]` | Lists orphans; `--write` deletes them | |
| `yapyak export [<locale>...] [--out <path>] [--split]` | Snapshot keyed by locale, then path, then source | non-zero on an unknown tag |
| `yapyak info` | Versions for a bug report | `0` |

Boolean flags accept `=`: `--write=false`. `NO_COLOR` and `CI` strip color.

CI order: `yapyak translate` with the provider key in the environment, then `yapyak check`, then the build. `check` never calls the translator.

## Working in a project

1. Write the `t()` call in the component. With the dev server running, the save writes the stub and the translator fills it. Without it, the CLI finds the call.
2. Run `npx yapyak check` before finishing. Fix every reported `YAPnnnn` with [references/diagnostics.md](references/diagnostics.md).
3. Run `npx yapyak translate` when `check` reports missing translations and the project has a translator. Fill the stubs by hand when it has none.
4. Commit the locale files with the code. They are the source of truth; `.yapyak/` is a cache.
5. Run `npx yapyak clean` after removing components, and `--write` once the list is right.

Diagnostics an agent most often triggers:

| Code | Cause | Fix |
| --- | --- | --- |
| `YAP0002` | Template literal source | `t('Hi {name}', { name })` |
| `YAP0004`, `YAP0005`, `YAP0049` | Params do not match the placeholders | Match the keys to the `{names}` in the source |
| `YAP0006` | Params in a variable | Inline object literal |
| `YAP0008` | No `other` branch | Add `other {...}` |
| `YAP0018` | `t()` and `t.as()` for one source in one file | `t.as()` on every occurrence |
| `YAP0020` | Chain stored in a variable | Complete `t.in()` or `t.as()` inline |
| `YAP0046` | Branch name is not a CLDR keyword | `zero`, `one`, `two`, `few`, `many`, `other`, or `=N` |
| `YAP0055` | `t()` at module scope | Move the call into the function that renders it |
| `YAP0022` | `getLocale()` on the server without an adapter | Register the SSR adapter from the framework reference |

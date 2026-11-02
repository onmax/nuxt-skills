# Nuxt

Nuxt 4.1+. Components, the binding, the switcher, and rich text are the Vue ones: [vue.md](vue.md). The module installs `yapyak`, `@yapyak/vite`, and `@yapyak/vue` as its own dependencies.

### Packages

```bash
npx nuxi module add yapyak
```

Add a translator package separately: `npm install @yapyak/anthropic`.

### Build config

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@yapyak/nuxt']
});
```

The install command writes this entry. The module registers the yapyak plugin, a server plugin, and the Nitro plugin.

### `yapyak.config.ts`

The install command writes a starter at the project root when none exists:

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { nuxt } from '@yapyak/nuxt/processor';

export default defineConfig({
  persistence: 'cookie',
  processors: [nuxt()],
  syncHtmlAttributes: true
});
```

`nuxt()` returns the Vue processor and the script processor, with `t` bound as an auto-import. `nuxt({ explicitImports: true })` turns the ambient `t` off when another module auto-imports a `t`; the module throws at startup on such a collision otherwise.

### Types

Add nothing: the module includes `.yapyak/types.d.ts` and maps the `yapyak` and `@yapyak/vue` type paths in the generated tsconfig.

### Where `t()` works

Any `.ts` or `.js` file, plus `<script>` blocks and `<template>` expressions in `.vue` files. `t` and the `RichText` component are auto-imported. Every other export is an explicit import from `yapyak` or `@yapyak/vue`.

### Component

```vue
<template>
  <button>{{ t('Save changes') }}</button>
</template>
```

### Locale

```vue
<script setup lang="ts">
import { locale } from '@yapyak/vue';
import { format, locales } from 'yapyak';
</script>

<template>
  <button v-for="value in locales" :key="value" :disabled="value === locale" @click="locale = value">
    {{ format.in(value).displayName(value, 'language') }}
  </button>
</template>
```

A server-side switch is a server route that calls `setLocale()` inside the request, so the cookie is written on the response:

```ts [server/routes/locale.post.ts]
import { isLocale, setLocale } from 'yapyak';

export default defineEventHandler(async (event) => {
  const { locale } = await readBody<{ locale?: string }>(event);
  if (typeof locale === 'string' && isLocale(locale)) {
    setLocale(locale);
  }
  return null;
});
```

### Text direction

With `syncHtmlAttributes: true`, `<html lang>` and `<html dir>` follow the active locale in server-rendered HTML and on client-side changes. `textDirection` from `@yapyak/vue` is available for other elements.

### Rich text

Write it as in [vue.md](vue.md) without the import: `RichText` is registered as a global component.

### SSR

Register nothing: the module wraps the Nitro handler in `withResponse` and flushes buffered headers in a `beforeResponse` hook.

### Fixed-locale build

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@yapyak/nuxt'],
  yapyak: {
    fixedLocale: process.env.YAPYAK_LOCALE
  }
});
```

### Quirks

- `locale`, `textDirection`, `setLocale`, `getLocale`, `locales`, and `format` are explicit imports. Only `t` and `RichText` are ambient.
- Keep `yapyak.config.ts` at the project root, next to `nuxt.config.ts`, never under `app/`.
- A file id in the locale files is the path from the project root, so `app/app.vue` is the key for the root component.

# Astro

Astro 7+. Astro renders on the server and ships no yapyak runtime to the browser.

### Packages

```bash
npm install yapyak @yapyak/astro
```

`@yapyak/astro` wraps the yapyak plugin; `@yapyak/vite` is not installed separately.

### Build config

```ts [astro.config.ts]
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { yapyak } from '@yapyak/astro/integration';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [yapyak()],
  output: 'server'
});
```

`yapyak()` from `@yapyak/astro/integration` registers the yapyak plugin and the request middleware. Server rendering with an adapter binds a locale per request. A static build renders `defaultLocale`; build one bundle per locale with `fixedLocale`.

### `yapyak.config.ts`

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { astro } from '@yapyak/astro/processor';

export default defineConfig({
  persistence: 'cookie',
  processors: [astro()]
});
```

Set `persistence: 'url'` for a locale path segment. Set `syncHtmlAttributes: true` only when an island switches the locale client-side; the layout sets the attributes otherwise.

### Types

Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`.

### Where `t()` works

Any `.ts` or `.js` file, plus the frontmatter and template expressions of `.astro` files. For an island written in React, Vue, or Svelte, register that framework's processor too and use its binding.

### Component

```astro
---
import { t } from 'yapyak';
---

<button>{t('Save changes')}</button>
```

### Locale

`getLocale()` in frontmatter returns the request-bound locale. A locale change is a navigation: the middleware reads the cookie or the URL on the next request.

With `persistence: 'cookie'`, a form posts to an API route that calls `setLocale()`:

```astro
---
import { getLocale, locales, t } from 'yapyak';

const current = getLocale();
---

<form method="POST" action="/api/locale">
  {locales.map((value) => (
    <button type="submit" name="locale" value={value} disabled={value === current}>
      {value}
    </button>
  ))}
</form>
```

```ts [src/pages/api/locale.ts]
import type { APIRoute } from 'astro';
import { isLocale, setLocale } from 'yapyak';

export const POST: APIRoute = async ({ redirect, request }) => {
  const formData = await request.formData();
  const locale = String(formData.get('locale'));
  if (isLocale(locale)) {
    setLocale(locale);
  }
  return redirect('/', 303);
};
```

With `persistence: 'url'`, put pages under `src/pages/[locale]/`; a link switches, and the root redirects to `defaultLocale`:

```astro [src/pages/[locale]/index.astro]
---
import { isLocale } from 'yapyak';

const { locale } = Astro.params;
if (locale === undefined || !isLocale(locale)) {
  return Astro.redirect('/');
}
---
```

```ts [src/pages/index.ts]
import type { APIRoute } from 'astro';
import { defaultLocale } from 'yapyak';

export const GET: APIRoute = ({ redirect }) => redirect(`/${defaultLocale}`);
```

### Text direction

```astro [src/layouts/Layout.astro]
---
import { getLocale, getTextDirection } from 'yapyak';
---

<html lang={getLocale()} dir={getTextDirection(getLocale())}>
  <head><slot name="head" /></head>
  <body><slot /></body>
</html>
```

Every navigation re-renders the layout, so both attributes stay correct.

### Locale switcher

```astro
---
import { format, getLocale, locales } from 'yapyak';

const current = getLocale();
---

<div>
  {locales.map((value) => (
    <a href={`/${value}`} aria-current={value === current ? 'page' : undefined}>
      {format.in(value).displayName(value, 'language')}
    </a>
  ))}
</div>
```

Under `persistence: 'cookie'`, render the POST form instead.

### Rich text

```astro
---
import { RichText } from '@yapyak/astro';
import { t } from 'yapyak';
---

<p>
  <RichText value={t('Read our <link>privacy policy</link> for details.')}>
    <a slot="link" href="/privacy"><RichText.Children /></a>
  </RichText>
</p>
```

```astro
<RichText value={t('Line one<br/>line two')}>
  <br slot="br" />
</RichText>
```

A tag is a named slot. Place `<RichText.Children />` where a pair tag's inner content renders; a void tag's slot has no marker.

### SSR

Register nothing: `yapyak()` adds the middleware with `order: 'pre'`.

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- Slots are untyped. A missing slot renders the tag as literal text, and a slot for a tag the source lacks is ignored. Check every tag against the source by hand.
- A locale change reloads the page. There is no client-side switch outside an island.
- HMR for `.astro` files reloads the page instead of swapping the module.

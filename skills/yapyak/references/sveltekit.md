# SvelteKit

SvelteKit 3+ with Svelte 5. Components, the binding, the switcher, and rich text are the Svelte ones: [svelte.md](svelte.md).

### Packages

```bash
npm install yapyak @yapyak/vite @yapyak/svelte @yapyak/sveltekit
```

### Build config

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { yapyak } from '@yapyak/vite';

export default defineConfig({
  plugins: [sveltekit(), yapyak()]
});
```

### `yapyak.config.ts`

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { svelte } from '@yapyak/svelte/processor';

export default defineConfig({
  persistence: 'cookie',
  processors: [svelte()],
  syncHtmlAttributes: true
});
```

Use `'cookie'` or `'url'`; local storage flashes `defaultLocale` on every server render.

### Types

Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`.

### Component

Write components as in [svelte.md](svelte.md). `locale.current` reads the request-bound locale on the server once the handle below is registered.

### Locale switcher

Write the client-side switcher as in [svelte.md](svelte.md). Server-side, a remote form calls `setLocale()` inside the request:

```ts [src/routes/locale.remote.ts]
import { redirect } from '@sveltejs/kit';
import { isLocale, setLocale } from 'yapyak';
import { form } from '$app/server';

export const localeForm = form('unchecked', async (data) => {
  const value = String(data.locale);
  if (isLocale(value)) {
    setLocale(value);
  }
  redirect(303, '/');
});
```

### SSR

Export the handle:

```ts [src/hooks.server.ts]
export { handle } from '@yapyak/sveltekit';
```

Replace `<html lang>` and `<html dir>` in `src/app.html` with yapyak's placeholders:

```html [src/app.html]
<!doctype html>
<html lang="%yapyak.lang%" dir="%yapyak.dir%">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body>
    <div>%sveltekit.body%</div>
  </body>
</html>
```

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- With other handles in `hooks.server.ts`, compose them with SvelteKit's `sequence()` and keep yapyak's `handle` first, so every later handle reads the request-bound locale.
- The handle wraps `withResponse(event.request, () => resolve(event, ...))` and fills `%yapyak.lang%` and `%yapyak.dir%` during `resolve`.

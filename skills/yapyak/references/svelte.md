# Svelte

Svelte 5+ with Vite. SvelteKit adds an SSR adapter on top of this file: [sveltekit.md](sveltekit.md).

### Packages

```bash
npm install yapyak @yapyak/vite @yapyak/svelte
```

### Build config

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { yapyak } from '@yapyak/vite';

export default defineConfig({
  plugins: [svelte(), yapyak()]
});
```

### `yapyak.config.ts`

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { svelte } from '@yapyak/svelte/processor';

export default defineConfig({
  processors: [svelte()],
  syncHtmlAttributes: true
});
```

### Types

Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`.

### Where `t()` works

Any `.ts` or `.js` file, plus `<script>` blocks and markup expressions in `.svelte` files.

### Component

```svelte
<script lang="ts">
  import { t } from 'yapyak';
</script>

<button>{t('Save changes')}</button>
```

Subscribe to no store: a component that calls `t()` reads the locale `$state` rune and re-runs on a locale change.

### Locale

```svelte
<script lang="ts">
  import { locale } from '@yapyak/svelte';
  import { t } from 'yapyak';
</script>

<button onclick={() => (locale.current = locale.current === 'en' ? 'sv' : 'en')}>
  {t('Switch language')}
</button>
```

`locale.current` is the active locale. Reading it tracks; assigning switches.

### Text direction

`textDirection.current` from `@yapyak/svelte` is `'ltr'` or `'rtl'`.

```svelte
<p dir={textDirection.current}>{t('Save changes')}</p>
```

### Locale switcher

```svelte
<script lang="ts">
  import { locale } from '@yapyak/svelte';
  import { format, locales } from 'yapyak';
</script>

<select bind:value={locale.current}>
  {#each locales as value (value)}
    <option {value}>{format.in(value).displayName(value, 'language')}</option>
  {/each}
</select>
```

### Rich text

```svelte
<script lang="ts">
  import { RichText } from '@yapyak/svelte';
  import { t } from 'yapyak';
</script>

<p>
  <RichText value={t('Read our <link>privacy policy</link> for details.')}>
    {#snippet link(children)}
      <a href="/privacy">{@render children()}</a>
    {/snippet}
  </RichText>
</p>
```

```svelte
<RichText value={t('Line one<br/>line two')}>
  {#snippet br()}<br />{/snippet}
</RichText>
```

A tag is a snippet prop. A pair-tag snippet receives a `children` snippet; render it with `{@render children()}`. A void-tag snippet takes no arguments. A missing snippet and a snippet for a tag the source lacks are both type errors.

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- Svelte 5 runes only. `locale` is not a Svelte store; never write `$locale`.
- Event attributes are the Svelte 5 form, `onclick={...}`, not `on:click`.

# React

React 19+ with Vite. SSR adapters on top of this file: [react-router.md](react-router.md), [tanstack-start.md](tanstack-start.md).

### Packages

```bash
npm install yapyak @yapyak/vite @yapyak/react
```

### Build config

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { yapyak } from '@yapyak/vite';

export default defineConfig({
  plugins: [react(), yapyak()]
});
```

With React Compiler, `react({ compiler: true })`. The yapyak plugin runs before React Compiler in either plugin order.

### `yapyak.config.ts`

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { react } from '@yapyak/react/processor';

export default defineConfig({
  processors: [react()],
  syncHtmlAttributes: true
});
```

`syncHtmlAttributes: true` keeps `<html lang>` and `<html dir>` in step in a client-rendered app. Set `react({ rsc: true })` for React Server Components: only `'use client'` files subscribe to the locale, and server components read the request-bound locale.

### Types

Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`.

### Where `t()` works

Any `.ts`, `.tsx`, `.js`, or `.jsx` file: component bodies, JSX expressions, and JSX attributes.

### Component

```tsx
import { t } from 'yapyak';

export function SaveButton() {
  return <button>{t('Save changes')}</button>;
}
```

Mount no provider and call no hook: the compiler injects the locale subscription into every component and custom hook that holds JSX, calls a hook, or reads `t()` or `format`. Names follow React's convention: components capitalized, hooks prefixed `use`.

### Locale

```tsx
import { useLocale } from '@yapyak/react';
import { t } from 'yapyak';

export function LanguageButton() {
  const [locale, setLocale] = useLocale();

  return (
    <button onClick={() => setLocale(locale === 'en' ? 'sv' : 'en')}>
      {t('Switch language')}
    </button>
  );
}
```

`useLocale()` returns `[Locale, (value: Locale) => void]`, the `useState` shape. It subscribes the component through `useSyncExternalStore`.

### Text direction

```tsx
import { useLocale, useTextDirection } from '@yapyak/react';

function Root() {
  const [locale] = useLocale();
  const textDirection = useTextDirection();
  return <html lang={locale} dir={textDirection} />;
}
```

### Locale switcher

```tsx
import { useLocale } from '@yapyak/react';
import { format, locales, parseLocale } from 'yapyak';

export function LocaleSwitcher() {
  const [locale, setLocale] = useLocale();

  return (
    <select
      value={locale}
      onChange={(event) => {
        const next = parseLocale(event.target.value);
        if (next) {
          setLocale(next);
        }
      }}
    >
      {locales.map((value) => (
        <option key={value} value={value}>
          {format.in(value).displayName(value, 'language')}
        </option>
      ))}
    </select>
  );
}
```

### Rich text

```tsx
import { RichText } from '@yapyak/react';
import { t } from 'yapyak';

export function Footer() {
  return (
    <p>
      <RichText
        value={t('Read our <link>privacy policy</link> for details.')}
        link={(children) => <a href="/privacy">{children}</a>}
      />
    </p>
  );
}
```

```tsx
<RichText value={t('Line one<br/>line two')} br={() => <br />} />
```

A pair tag is a prop `(children: ReactNode) => ReactNode`; a void tag is a prop `() => ReactNode`. The prop set is inferred from the source string: a missing handler and a handler for a tag the source lacks are both type errors.

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- A component called as a plain function in its own module, `Row(props)` or `items.map(Row)`, gets no subscription of its own. It runs inside the caller, which re-renders.
- List `useLocale()[0]` in the dependencies of a `useMemo` or `useCallback` that reads `t()` or `format`.
- Under React Compiler, skip that dependency: the yapyak plugin replaces the compiler's memo cache, and every cached value recomputes once per locale change.
- Under React Compiler, put `yapyak()` before any other plugin that replaces `react/compiler-runtime`. Compiled code in `node_modules` keeps React's runtime.
- A helper in another module needs nothing: the component that renders it re-renders.

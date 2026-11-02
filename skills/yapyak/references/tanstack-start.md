# TanStack Start

TanStack Start 1.168+. Components, the binding, the switcher, and rich text are the React ones: [react.md](react.md).

### Packages

```bash
npm install yapyak @yapyak/vite @yapyak/react @yapyak/tanstack-start
```

### Build config

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { yapyak } from '@yapyak/vite';

export default defineConfig({
  plugins: [tanstackStart(), react(), yapyak()]
});
```

### `yapyak.config.ts`

```ts [yapyak.config.ts]
import { defineConfig } from 'yapyak/config';
import { react } from '@yapyak/react/processor';

export default defineConfig({
  persistence: 'cookie',
  processors: [react()]
});
```

Use `'cookie'` or `'url'`; local storage flashes `defaultLocale` on every server render.

### Types

Add `.yapyak/types.d.ts` and `yapyak.config.ts` to `include` in `tsconfig.json`.

### Component

Write components as in [react.md](react.md). `useLocale()` and `useTextDirection()` read the request-bound locale on the server once the middleware below is registered.

### SSR

Register the middleware in the start entry:

```ts [src/start.ts]
import { createStart } from '@tanstack/react-start';
import { middleware } from '@yapyak/tanstack-start';

export const startInstance = createStart(() => ({
  requestMiddleware: [middleware]
}));
```

Render `<html lang>` and `<html dir>` in the root route's shell component:

```tsx [src/routes/__root.tsx]
import type { ReactNode } from 'react';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { useLocale, useTextDirection } from '@yapyak/react';

export const Route = createRootRoute({
  shellComponent: RootDocument
});

function RootDocument({ children }: { children: ReactNode }) {
  const [locale] = useLocale();
  const textDirection = useTextDirection();
  return (
    <html lang={locale} dir={textDirection}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- Keep `middleware` in `requestMiddleware`, alongside other request middleware such as `createCsrfMiddleware()`. The adapter extracts the `Response` from the middleware result to flush a buffered `Set-Cookie`.

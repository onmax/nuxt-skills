# React Router

React Router 7.9+ in framework mode with SSR. Components, the binding, the switcher, and rich text are the React ones: [react.md](react.md).

### Packages

```bash
npm install yapyak @yapyak/vite @yapyak/react @yapyak/react-router
```

### Build config

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { yapyak } from '@yapyak/vite';

export default defineConfig({
  plugins: [reactRouter(), yapyak()]
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

Export the middleware from the root route and render `<html lang>` and `<html dir>` from the hooks:

```tsx [app/root.tsx]
import type { ReactNode } from 'react';
import type { Route } from './+types/root';
import { useLocale, useTextDirection } from '@yapyak/react';
import { middleware as yapyakMiddleware } from '@yapyak/react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

export const middleware: Route.MiddlewareFunction[] = [yapyakMiddleware];

export function Layout({ children }: { children: ReactNode }) {
  const [locale] = useLocale();
  const textDirection = useTextDirection();
  return (
    <html lang={locale} dir={textDirection}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
```

`react-router.config.ts` has `ssr: true`. On React Router 7.9 through 7.x, middleware is opt-in: add `future: { v8_middleware: true }` there. On v8 it is on by default.

### Fixed-locale build

```ts
yapyak({ fixedLocale: process.env.YAPYAK_LOCALE })
```

### Quirks

- The middleware wraps `withResponse(request, () => next())`. A `setLocale()` call in a loader or action buffers a `Set-Cookie` that the middleware flushes onto the response.
- A response rendered without the middleware, such as a URL that matches no route, reports `YAP0022` and uses `defaultLocale`.

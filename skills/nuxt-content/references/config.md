# Configuration and deployment

## Database adapters

Nuxt Content builds a database dump and restores it into the configured adapter at runtime. SQLite is the default.

```ts
export default defineNuxtConfig({
  content: {
    database: {
      type: 'sqlite',
      filename: '.data/content/contents.sqlite',
    },
  },
})
```

Supported adapters include:

- `sqlite` with a file path or `:memory:`; select `experimental.sqliteConnector` when the runtime needs `better-sqlite3`, `sqlite3`, Bun SQLite, or Node's native SQLite.
- `d1` with a Cloudflare binding name.
- `postgresql` with `pg` installed and a connection URL.
- `libsql` with `@libsql/client`, URL, and optional auth token.
- `pglite` with `@electric-sql/pglite`; keep it to development-oriented deployments unless the chosen host provides durable storage.

```ts
export default defineNuxtConfig({
  content: {
    database: {
      type: 'd1',
      bindingName: 'CONTENT_DB',
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
})
```

Database indexes belong in `defineCollection({ indexes: [...] })`, because each collection owns its table and query patterns.

## Build and renderer options

```ts
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 2 },
        remarkPlugins: {
          'remark-gfm': {},
        },
        rehypePlugins: {
          'rehype-external-links': {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
          },
        },
        highlight: {
          themes: { default: 'github-light', dark: 'github-dark' },
          langs: ['ts', 'vue', 'bash'],
        },
      },
      csv: { json: true, delimiter: ',' },
    },
    renderer: {
      alias: { a: 'DocsLink' },
      anchorLinks: { h2: true, h3: true },
    },
    watch: { enabled: true },
  },
})
```

The watcher is a development feature. Transformers are registered under `content.build.transformers`; load [Advanced](advanced.md) when processing behavior extends beyond remark/rehype plugins.

## Deployment boundary

- Static generation packages queried content into the generated application.
- Server and serverless targets restore the generated dump on first query; an in-memory SQLite database is recreated on cold start.
- Cloudflare Workers use D1 when content must share a durable runtime database.
- NuxtHub can supply the database configuration through `@nuxthub/core`; apply the `nuxthub` skill for provider and binding details.
- Vercel, Netlify, AWS, Docker, and other targets have provider-specific presets; verify the selected adapter against the deployment filesystem and runtime.

Keep database URLs and tokens in private runtime configuration or build environment variables. Remote collection credentials are build-time inputs; database credentials are runtime inputs when the adapter connects after deployment.

## Checks

- The deployment runtime supports the chosen driver and its peer dependency.
- Production can restore or reach the database after a cold start.
- Shiki languages and Markdown plugins are limited to the actual content set.
- A clean build and a production-mode query both succeed.

Official references: [configuration](https://content.nuxt.com/docs/getting-started/configuration), [deployment](https://content.nuxt.com/docs/deploy/server), [NuxtHub](https://content.nuxt.com/docs/deploy/nuxthub).

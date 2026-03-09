# Live Editing

## When to Use

Working with the visual content editor, media management, MDC component editing, or AI content features.

## Visual Editor

TipTap-based WYSIWYG editor that generates MDC syntax. Two editing modes:

- **Visual editor** — Notion-like block editing with drag-and-drop
- **Code editor** — Direct markdown/MDC editing

### MDC Component Support

Insert Vue components in content, edit props visually, drag-and-drop blocks. Components in `components/content/` are available in the editor.

Filter visible components:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  studio: {
    meta: {
      components: {
        include: ['Content*', 'Landing*'],
        exclude: ['InternalComponent'],
        groups: [
          { label: 'Content', include: ['content*'] },
          { label: 'Landing', include: ['landing*'] },
        ],
      },
    },
  },
})
```

### Schema-Driven Forms

Frontmatter and YAML/JSON files get auto-generated form UIs based on collection schemas. Use `.describe()` for editor labels:

```ts
// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string().describe('Post title'),
        description: z.string().describe('SEO description'),
        image: z.string().describe('Cover image URL'),
        date: z.date().describe('Publication date'),
        tags: z.array(z.string()).describe('Post tags'),
      }),
    }),
  },
})
```

## Draft System

Changes are stored as drafts in IndexedDB (browser-local, not shared across devices). Three-tier flow:

1. **Production layer** — SQLite WASM in browser, mirrors deployed content
2. **Draft layer** — IndexedDB via unstorage, stores unpublished edits
3. **Git repository** — Final destination when publishing

On load, drafts merge with the SQLite database to render a preview of your changes.

## Preview

In development, file changes sync in real-time with local filesystem via WebSocket HMR.

In production, the draft layer overlays production content so editors see their changes before publishing.

## Media Management

Access via the **Media** tab. Browse folders, upload files, drag-and-drop.

### Default Storage (`/public`)

Zero config. Files committed to Git on publish. Best for small projects. A service worker intercepts media requests to display draft versions.

### External Storage (NuxtHub Blob)

For larger projects — files stored in cloud, not committed to Git:

```bash
npx nuxi module add hub
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-studio'],
  hub: { blob: true },
  studio: {
    media: { external: true },
  },
})
```

Provider env vars:

```bash
# Vercel Blob
BLOB_READ_WRITE_TOKEN=your-token

# S3-compatible
S3_ACCESS_KEY_ID=key
S3_SECRET_ACCESS_KEY=secret
S3_BUCKET=bucket-name
S3_ENDPOINT=endpoint-url
```

Or Cloudflare R2:

```ts
hub: { blob: { driver: 'cloudflare-r2', bucketName: 'your-bucket' } }
```

### Media Config Options

| Option         | Type     | Default                              |
| -------------- | -------- | ------------------------------------ |
| `external`     | boolean  | `false`                              |
| `maxFileSize`  | number   | `10` (MB)                            |
| `allowedTypes` | string[] | `['image/*', 'video/*', 'audio/*']`  |
| `prefix`       | string   | `'studio'`                           |

Supported: PNG, JPG, SVG, WebP, AVIF, GIF, MP4, MOV, WebM, MP3, WAV, AAC.

### Editor Integration

- Slash command `/` → search "Image" for quick insertion
- Alt text support for SEO/a11y
- Custom width/height attributes

## AI Content Assistance

Powered by Vercel AI Gateway. Provides context-aware content completion, transformation, and style guidance based on project context, cursor position, and active components.

Plug-and-play — no additional configuration needed beyond Vercel AI Gateway access.

## Resources

- Content editing: https://nuxt.studio/content-editing
- Media: https://nuxt.studio/medias
- Introduction: https://nuxt.studio/introduction

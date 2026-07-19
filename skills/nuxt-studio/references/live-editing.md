# Live editing

## Editor surfaces

Studio provides three views over the same source files:

- The visual editor converts Markdown and MDC to an editable TipTap document.
- The code editor exposes Markdown, MDC, YAML, and JSON directly.
- Schema forms edit frontmatter and data files from the Nuxt Content collection schema.

Content components remain Vue components in `components/content/`. Studio derives editable props from their component metadata and from `property(...).editor(...)` schema metadata; the source schema remains the contract.

## Draft and preview model

Studio layers browser-local drafts over the deployed Nuxt Content database:

1. The deployed Content dump initializes SQLite WASM in the browser.
2. Drafts in IndexedDB overlay created, modified, and deleted files.
3. Publishing commits those drafts to the configured Git branch.
4. The deployment rebuild makes the Git state the new production baseline.

Drafts belong to one browser profile, so another editor or device will not see them until publication. Conflict checks compare drafts against the latest Git state before commit.

In development, edits write to the local filesystem and Nuxt's watcher refreshes the preview. Publishing remains a production flow.

## Media

By default, the media library owns files in the project's `public/` directory. Uploads, renames, and deletions participate in the same draft and Git publish cycle as content files.

Use media editor metadata for fields that should select a public asset:

```ts
cover: property(z.string()).editor({ input: 'media' })
```

For larger media libraries, enable NuxtHub blob storage so files go to Vercel Blob, S3-compatible storage, or Cloudflare R2 instead of Git. List `@nuxthub/core` before `nuxt-studio`.

```ts
export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-studio'],
  hub: { blob: true },
  studio: {
    media: {
      external: true,
      maxFileSize: 10 * 1024 * 1024,
      allowedTypes: ['image/*', 'video/*'],
      prefix: 'studio',
    },
  },
})
```

External uploads are durable immediately and are not part of the Git draft. Configure the storage driver's credentials and `NUXT_PUBLIC_STUDIO_MEDIA_PUBLIC_URL` when the provider needs an explicit public origin.

## AI assistance

Set `NUXT_STUDIO_AI_API_KEY` to enable completions and text transforms through Vercel AI Gateway. `studio.ai.context` can describe the project's title, subject, style, and tone; `studio.ai.experimental.collectionContext` adds per-collection guidance under `.studio/`. Treat generated text as an editor draft and publish it through the same Git boundary.

## Checks

- Visual edits serialize back to valid Markdown/MDC and preserve component slots.
- Form fields round-trip through the collection validator.
- A refresh in the same browser restores drafts; a second profile sees only published content.
- Media URLs resolve in preview and after the deployment rebuild.
- External media limits and MIME rules reject invalid uploads on the server.

Official references: [content editors](https://nuxt.studio/content), [media](https://nuxt.studio/medias), [AI](https://nuxt.studio/ai), [advanced synchronization](https://nuxt.studio/advanced).

# Rendering

## ContentRenderer

Query a page document, handle the missing state at the route boundary, then pass the document to `ContentRenderer`.

```vue
<script setup lang="ts">
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}
</script>

<template>
  <ContentRenderer :value="page" />
</template>
```

Nuxt Content v3 renders documents through `ContentRenderer`; document-driven routing still belongs in an explicit Nuxt page such as `app/pages/[...slug].vue`.

## MDC components

Components under `components/content/` are available in Markdown and MDC.

```md
:icon{name="lucide:star"}

::callout{type="warning"}
Review this before publishing.
::

::card
#title
Typed collections

#default
The body is rendered through the default slot.
::
```

Use native slots in content components. The `mdc-unwrap` attribute removes Markdown wrapper elements when a component needs the raw slot shape.

```vue
<template>
  <aside class="callout">
    <slot mdc-unwrap="p" />
  </aside>
</template>
```

Content components are registered for MDC rendering. Register them separately when they also need dynamic use outside Markdown.

## Prose components

Override semantic Markdown output with `ProseP`, `ProseA`, `ProseH1`–`ProseH6`, `ProseCode`, `ProsePre`, `ProseImg`, `ProseTable`, and the matching list/blockquote components. Inline code maps to `ProseCode`; fenced code maps to `ProsePre`.

Keep accessible HTML semantics and forward the attributes supplied by MDC. Let a design-system skill own styling decisions when Nuxt UI or another component library is installed.

## Markdown processing and highlighting

Configure Markdown under `content.build.markdown` and renderer aliases under `content.renderer`.

```ts
export default defineNuxtConfig({
  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 2 },
        highlight: {
          themes: {
            default: 'github-light',
            dark: 'github-dark',
          },
          langs: ['ts', 'vue', 'bash'],
        },
      },
    },
    renderer: {
      alias: { a: 'DocsLink' },
      anchorLinks: { h2: true, h3: true },
    },
  },
})
```

Load only the Shiki languages used by the content set. When custom remark or rehype plugins are involved, verify the rendered AST and the final SSR HTML.

Official references: [Markdown and MDC](https://content.nuxt.com/docs/files/markdown), [ContentRenderer](https://content.nuxt.com/docs/components/content-renderer), [prose components](https://content.nuxt.com/docs/components/prose).

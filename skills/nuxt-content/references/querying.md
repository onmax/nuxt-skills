# Querying

## Page and list queries

Wrap initial render queries in `useAsyncData` or `useFetch` so Nuxt can transfer the result in its payload.

```ts
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})

const { data: posts } = await useAsyncData('published-posts', () => {
  return queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date')
    .limit(12)
    .all()
})
```

The builder supports `where`, `andWhere`, `orWhere`, `order`, `select`, `skip`, `limit`, `all`, `first`, and `count`. Use grouped conditions when SQL precedence matters.

```ts
const posts = await queryCollection('blog')
  .where('published', '=', true)
  .andWhere(group => group
    .where('date', '>', '2026-01-01')
    .where('category', '=', 'news'))
  .all()
```

## Nitro queries

Pass the event as the first argument on the server so the query uses the request's Content context.

```ts
export default defineEventHandler(async (event) => {
  const { slug } = getRouterParams(event)
  return queryCollection(event, 'docs').path(`/${slug}`).first()
})
```

Extend `../.nuxt/tsconfig.server.json` from `server/tsconfig.json` when server-side collection types are missing.

## Navigation and surroundings

```ts
const navigation = await queryCollectionNavigation('docs', [
  'title',
  'description',
  'icon',
])

const [previous, next] = await queryCollectionItemSurroundings(
  'docs',
  route.path,
  { fields: ['title', 'description'] },
)
```

Navigation reads page paths plus `.navigation.yml` metadata. Surroundings returns a two-item tuple, with `null` at either boundary.

## Search

`queryCollectionSearchSections` turns headings and their text into a search index suitable for Nuxt UI, MiniSearch, Fuse, or another client-side search engine.

```ts
const { data: sections } = await useAsyncData('docs-search', () => {
  return queryCollectionSearchSections('docs', {
    ignoredTags: ['style', 'script'],
    extraFields: ['description'],
  })
})
```

Use `useSearchCollection` when the app needs reactive, built-in search over a collection rather than managing an external index. Load the search data once per stable collection and avoid rebuilding an index on every keystroke.

## Checks

- A stable `useAsyncData` key identifies each payload-backed query.
- Client and server calls use their correct signatures.
- `select()` retains every field the renderer consumes.
- Pagination applies a deterministic `order()` before `skip()` and `limit()`.
- Search and navigation source globs include the files that generate their metadata.

Official references: [queryCollection](https://content.nuxt.com/docs/utils/query-collection), [navigation](https://content.nuxt.com/docs/utils/query-collection-navigation), [surroundings](https://content.nuxt.com/docs/utils/query-collection-item-surroundings), [search sections](https://content.nuxt.com/docs/utils/query-collection-search-sections).

# useFetch

Reactive Fetch API provides the ability to abort requests, intercept requests before they are fired, automatically refetch requests when the url changes, and create your own with predefined options.

**Package:** `@vueuse/core`
**Category:** Network

## Usage

```ts
import { useFetch } from '@vueuse/core'

const { isFetching, error, data } = useFetch(url)
```

## Options

| Option            | Type                                                                                                                                    | Default | Description                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| fetch             | `typeof window.fetch`                                                                                                                   | -       | Fetch function                                                                                            |
| immediate         | `boolean`                                                                                                                               | true    | Will automatically run fetch when `useFetch` is used                                                      |
| refetch           | `MaybeRefOrGetter&lt;boolean&gt;`                                                                                                       | false   | Will automatically refetch when:                                                                          |
| initialData       | `any`                                                                                                                                   | null    | Initial data before the request finished                                                                  |
| timeout           | `number`                                                                                                                                | 0       | Timeout for abort request after number of millisecond                                                     |
| updateDataOnError | `boolean`                                                                                                                               | false   | Allow update the `data` ref when fetch error whenever provided, or mutated in the `onFetchError` callback |
| beforeFetch       | `(ctx: BeforeFetchContext) =&gt; Promise&lt;Partial&lt;BeforeFetchContext&gt; \| void&gt; \| Partial&lt;BeforeFetchContext&gt; \| void` | -       | Will run immediately before the fetch request is dispatched                                               |
| afterFetch        | `(ctx: AfterFetchContext) =&gt; Promise&lt;Partial&lt;AfterFetchContext&gt;&gt; \| Partial&lt;AfterFetchContext&gt;`                    | -       | Will run immediately after the fetch request is returned.                                                 |
| onFetchError      | `(ctx: OnFetchErrorContext) =&gt; Promise&lt;Partial&lt;OnFetchErrorContext&gt;&gt; \| Partial&lt;OnFetchErrorContext&gt;`              | -       | Will run immediately after the fetch request is returned.                                                 |

## Reference

[VueUse Docs](https://vueuse.org/core/useFetch/)

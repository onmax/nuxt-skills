# useAxios

Wrapper for .

**Package:** `@vueuse/integrations`
**Category:** '@Integrations'

## Usage

```ts
import { useAxios } from '@vueuse/integrations/useAxios'

const { data, isFinished } = useAxios('/api/posts')
```

## Options

| Option         | Type                      | Default | Description                                                  |
| -------------- | ------------------------- | ------- | ------------------------------------------------------------ |
| immediate      | `boolean`                 | -       | Will automatically run axios request when `useAxios` is used |
| shallow        | `boolean`                 | true    | Use shallowRef.                                              |
| abortPrevious  | `boolean`                 | true    | Abort previous request when a new request is made.           |
| onError        | `(e: unknown) =&gt; void` | -       | Callback when error is caught.                               |
| onSuccess      | `(data: T) =&gt; void`    | -       | Callback when success is caught.                             |
| resetOnExecute | `boolean`                 | -       | Sets the state to initialState before executing the promise. |
| onFinish       | `() =&gt; void`           | -       | Callback when request is finished.                           |

## Reference

[VueUse Docs](https://vueuse.org/core/useAxios/)

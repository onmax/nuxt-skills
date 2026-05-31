# useTextDirection

Reactive dir of the element's text.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useTextDirection } from '@vueuse/core'

const dir = useTextDirection() // Ref<'ltr' | 'rtl' | 'auto'>
```

## Options

| Option       | Type                    | Default | Description                                                              |
| ------------ | ----------------------- | ------- | ------------------------------------------------------------------------ |
| selector     | `string`                | html    | CSS Selector for the target element applying to                          |
| observe      | `boolean`               | false   | Observe `document.querySelector(selector)` changes using MutationObserve |
| initialValue | `UseTextDirectionValue` | ltr     | Initial value                                                            |

## Reference

[VueUse Docs](https://vueuse.org/core/useTextDirection/)

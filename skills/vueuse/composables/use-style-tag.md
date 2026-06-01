# useStyleTag

Inject reactive element in head.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useStyleTag } from '@vueuse/core'

const {
  id,
  css,
  load,
  unload,
  isLoaded,
} = useStyleTag('.foo { margin-top: 32px; }')

// Later you can modify styles
css.value = '.foo { margin-top: 64px; }'
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| media | `string` | - | Media query for styles to apply |
| immediate | `boolean` | true | Load the style immediately |
| manual | `boolean` | false | Manual controls the timing of loading and unloading |
| id | `string` | auto-incremented | DOM id of the style tag |
| nonce | `string` | undefined | Nonce value for CSP (Content Security Policy) |

## Returns

| Name | Type |
| --- | --- |
| id | `Ref` |
| css | `Ref` |
| unload | `Ref` |
| load | `Ref` |
| isLoaded | `shallowRef` |

## Reference

[VueUse Docs](https://vueuse.org/core/useStyleTag/)

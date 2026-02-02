# useScriptTag

Creates a script tag, with support for automatically unloading (deleting) the script tag on unmount.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useScriptTag } from '@vueuse/core'

useScriptTag(
  'https://player.twitch.tv/js/embed/v1.js',
  // on script tag loaded.
  (el: HTMLScriptElement) => {
    // do something
  },
)
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| immediate | `boolean` | true | Load the script immediately |
| async | `boolean` | true | Add `async` attribute to the script tag |
| type | `string` | text/javascript | Script type |
| manual | `boolean` | false | Manual controls the timing of loading and unloading |
| attrs | `Record&lt;string, string&gt;` | - | Add custom attribute to the script tag |
| nonce | `string` | undefined | Nonce value for CSP (Content Security Policy) |

## Returns

| Name | Type |
| --- | --- |
| scriptTag | `shallowRef&lt;HTMLScriptElement \| null&gt;` |
| load | `Ref` |
| unload | `Ref` |

## Reference

[VueUse Docs](https://vueuse.org/core/useScriptTag/)

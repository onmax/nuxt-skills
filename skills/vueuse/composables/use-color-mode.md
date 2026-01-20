# useColorMode

Reactive color mode (dark / light / customs) with auto data persistence.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useColorMode } from '@vueuse/core'

const mode = useColorMode() // Ref<'dark' | 'light'>
```

## Options

| Option            | Type                                                                                               | Default             | Description                                               |
| ----------------- | -------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------- |
| selector          | `string \| MaybeElementRef`                                                                        | html                | CSS Selector for the target element applying to           |
| attribute         | `string`                                                                                           | class               | HTML attribute applying the target element                |
| initialValue      | `MaybeRefOrGetter&lt;T \| BasicColorSchema&gt;`                                                    | auto                | The initial color mode                                    |
| modes             | `Partial&lt;Record&lt;T \| BasicColorSchema, string&gt;&gt;`                                       | -                   | Prefix when adding value to the attribute                 |
| onChanged         | `(mode: T \| BasicColorMode, defaultHandler: ((mode: T \| BasicColorMode) =&gt; void)) =&gt; void` | undefined           | A custom handler for handle the updates.                  |
| storageRef        | `Ref&lt;T \| BasicColorSchema&gt;`                                                                 | -                   | Custom storage ref                                        |
| storageKey        | `string \| null`                                                                                   | vueuse-color-scheme | Key to persist the data into localStorage/sessionStorage. |
| storage           | `StorageLike`                                                                                      | localStorage        | Storage object, can be localStorage or sessionStorage     |
| emitAuto          | `boolean`                                                                                          | undefined           | Emit `auto` mode from state                               |
| disableTransition | `boolean`                                                                                          | true                | Disable transition on switch                              |

## Reference

[VueUse Docs](https://vueuse.org/core/useColorMode/)

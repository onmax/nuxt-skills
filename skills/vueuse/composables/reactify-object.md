# reactifyObject

Apply to an object

**Package:** `@vueuse/shared`
**Category:** Reactivity

## Usage

```ts
import { reactifyObject } from '@vueuse/core'

const reactifiedConsole = reactifyObject(console)

const a = ref('42')

reactifiedConsole.log(a) // no longer need `.value`
```

## Options

| Option               | Type      | Default | Description                                    |
| -------------------- | --------- | ------- | ---------------------------------------------- |
| includeOwnProperties | `boolean` | true    | Includes names from Object.getOwnPropertyNames |

## Reference

[VueUse Docs](https://vueuse.org/core/reactifyObject/)

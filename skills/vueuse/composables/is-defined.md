# isDefined

Non-nullish checking type guard for Ref.

**Package:** `@vueuse/shared`
**Category:** Utilities

## Usage

```ts
import { isDefined } from '@vueuse/core'

const example = ref(Math.random() ? 'example' : undefined) // Ref<string | undefined>

if (isDefined(example))
  example // Ref<string>
```

## Reference

[VueUse Docs](https://vueuse.org/core/isDefined/)

# provideLocal

Extended with ability to call to obtain the value in the same component.

**Package:** `@vueuse/shared`
**Category:** State

## Usage

```ts
<script setup>
import { injectLocal, provideLocal } from '@vueuse/core'

provideLocal('MyInjectionKey', 1)
const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
</script>
```

## Reference

[VueUse Docs](https://vueuse.org/core/provideLocal/)

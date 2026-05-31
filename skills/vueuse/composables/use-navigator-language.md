# useNavigatorLanguage

Reactive navigator.language.

**Package:** `@vueuse/core`
**Category:** Sensors

## Usage

```ts
import { useNavigatorLanguage } from '@vueuse/core'

const { language } = useNavigatorLanguage()

watch(language, () => {
  // Listen to the value changing
})
```

## Returns

| Name        | Type                                    |
| ----------- | --------------------------------------- |
| isSupported | `useSupported`                          |
| language    | `shallowRef&lt;string \| undefined&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useNavigatorLanguage/)

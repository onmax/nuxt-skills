# useStorage

Create a reactive ref that can be used to access & modify LocalStorage or SessionStorage.

**Package:** `@vueuse/core`
**Category:** State

## Usage

```ts
import { useStorage } from '@vueuse/core'

// bind object
const state = useStorage('my-store', { hello: 'hi', greeting: 'Hello' })

// bind boolean
const flag = useStorage('my-flag', true) // returns Ref<boolean>

// bind number
const count = useStorage('my-count', 0) // returns Ref<number>

// bind string with SessionStorage
const id = useStorage('my-id', 'some-string-id', sessionStorage) // returns Ref<string>

// delete data from storage
state.value = null
```

## Options

| Option                 | Type                                                  | Default | Description                                                      |
| ---------------------- | ----------------------------------------------------- | ------- | ---------------------------------------------------------------- |
| deep                   | `boolean`                                             | true    | Watch for deep changes                                           |
| listenToStorageChanges | `boolean`                                             | true    | Listen to storage changes, useful for multiple tabs application  |
| writeDefaults          | `boolean`                                             | true    | Write the default value to the storage when it does not exist    |
| mergeDefaults          | `boolean \| ((storageValue: T, defaults: T) =&gt; T)` | false   | Merge the default value with the value read from the storage.    |
| serializer             | `Serializer&lt;T&gt;`                                 | -       | Custom data serialization                                        |
| onError                | `(error: unknown) =&gt; void`                         | -       | On error callback                                                |
| shallow                | `boolean`                                             | false   | Use shallow ref as reference                                     |
| initOnMounted          | `boolean`                                             | false   | Wait for the component to be mounted before reading the storage. |

## Reference

[VueUse Docs](https://vueuse.org/core/useStorage/)

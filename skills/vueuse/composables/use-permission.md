# usePermission

Reactive Permissions API. The Permissions API provides the tools to allow developers to implement a better user experience as far as permissions are concerned.

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { usePermission } from '@vueuse/core'

const microphoneAccess = usePermission('microphone')
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| controls | `Controls` | false | Expose more controls |

## Returns

| Name | Type |
| --- | --- |
| state | `shallowRef&lt;PermissionState \| undefined&gt;` |
| isSupported | `useSupported` |
| query | `createSingletonPromise` |

## Reference

[VueUse Docs](https://vueuse.org/core/usePermission/)

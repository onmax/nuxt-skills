# useWebNotification

Reactive Notification

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useWebNotification } from '@vueuse/core'

const {
  isSupported,
  notification,
  permissionGranted,
  show,
  close,
  onClick,
  onShow,
  onError,
  onClose,
} = useWebNotification({
  title: 'Hello, VueUse world!',
  dir: 'auto',
  lang: 'en',
  renotify: true,
  tag: 'test',
})

if (isSupported.value && permissionGranted.value)
  show()
```

## Options

| Option             | Type      | Default | Description                                            |
| ------------------ | --------- | ------- | ------------------------------------------------------ |
| requestPermissions | `boolean` | true    | Request for permissions onMounted if it's not granted. |

## Returns

| Name              | Type           |
| ----------------- | -------------- |
| isSupported       | `useSupported` |
| notification      | `Ref`          |
| ensurePermissions | `Ref`          |
| permissionGranted | `shallowRef`   |
| show              | `Ref`          |
| close             | `Ref`          |
| onClick           | `Ref`          |
| onShow            | `Ref`          |
| onError           | `Ref`          |
| onClose           | `Ref`          |

## Reference

[VueUse Docs](https://vueuse.org/core/useWebNotification/)

# useFileSystemAccess

Create and read and write local files with FileSystemAccessAPI

**Package:** `@vueuse/core`
**Category:** Browser

## Usage

```ts
import { useFileSystemAccess } from '@vueuse/core'

const {
  isSupported,
  data,
  file,
  fileName,
  fileMIME,
  fileSize,
  fileLastModified,
  create,
  open,
  save,
  saveAs,
  updateData
} = useFileSystemAccess()
```

## Returns

| Name             | Type                                              |
| ---------------- | ------------------------------------------------- |
| isSupported      | `useSupported`                                    |
| data             | `shallowRef&lt;string \| ArrayBuffer \| Blob&gt;` |
| file             | `shallowRef&lt;File&gt;`                          |
| fileName         | `computed`                                        |
| fileMIME         | `computed`                                        |
| fileSize         | `computed`                                        |
| fileLastModified | `computed`                                        |
| open             | `Ref`                                             |
| create           | `Ref`                                             |
| save             | `Ref`                                             |
| saveAs           | `Ref`                                             |
| updateData       | `Ref`                                             |

## Reference

[VueUse Docs](https://vueuse.org/core/useFileSystemAccess/)

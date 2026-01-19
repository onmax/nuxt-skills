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

## Reference

[VueUse Docs](https://vueuse.org/core/useFileSystemAccess/)

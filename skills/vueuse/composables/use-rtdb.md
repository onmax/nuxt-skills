# useRTDB

Reactive Firebase Realtime Database binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

**Package:** `@vueuse/firebase`
**Category:** '@Firebase'

## Usage

```ts
import { useRTDB } from '@vueuse/firebase/useRTDB'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const app = initializeApp({ /* config */ })
const db = getDatabase(app)

// in setup()
const todos = useRTDB(db.ref('todos'))
```

## Reference

[VueUse Docs](https://vueuse.org/core/useRTDB/)

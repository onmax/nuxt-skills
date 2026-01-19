# useFirestore

Reactive Firestore binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

**Package:** `@vueuse/firebase`
**Category:** '@Firebase'

## Usage

```ts
import { useFirestore } from '@vueuse/firebase/useFirestore'
import { collection } from 'firebase/firestore'
// ---cut---
const todos = useFirestore(collection(db, 'todos'), undefined, { autoDispose: false })
```

## Reference

[VueUse Docs](https://vueuse.org/core/useFirestore/)

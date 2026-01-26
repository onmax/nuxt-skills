# useFirestore

Reactive Firestore binding. Making it straightforward to **always keep your local data in sync** with remotes databases.

**Package:** `@vueuse/firebase`
**Category:** '@Firebase'

## Usage

```ts
const todos = useFirestore(collection(db, 'todos'), [], {
  errorHandler: (err) => {
    console.error('Firestore error:', err)
    // Handle error (e.g., show notification)
  },
})
```

## Reference

[VueUse Docs](https://vueuse.org/core/useFirestore/)

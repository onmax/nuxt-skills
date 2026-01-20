# useMemoize

Cache results of functions depending on arguments and keep it reactive. It can also be used for asynchronous functions and will reuse existing promises to avoid fetching the same data at the same time.

**Package:** `@vueuse/core`
**Category:** Utilities

## Usage

```ts
import { useMemoize } from '@vueuse/core'

const getUser = useMemoize(
  async (userId: number): Promise<UserData> =>
    axios.get(`users/${userId}`).then(({ data }) => data),
)

const user1 = await getUser(1) // Request users/1
const user2 = await getUser(2) // Request users/2
// ...
const user1 = await getUser(1) // Retrieve from cache

// ...
const user1 = await getUser.load(1) // Request users/1

// ...
getUser.delete(1) // Delete cache from user 1
getUser.clear() // Clear full cache
```

## Reference

[VueUse Docs](https://vueuse.org/core/useMemoize/)

# useAuth

Reactive Firebase Auth binding. It provides a reactive and so you can easily react to changes in the users' authentication status.

**Package:** `@vueuse/firebase`
**Category:** '@Firebase'

## Usage

```ts
<script setup lang="ts">
import { useAuth } from '@vueuse/firebase/useAuth'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const app = initializeApp({ /* config */ })
const auth = getAuth(app)
const { isAuthenticated, user } = useAuth(auth)

const signIn = () => signInWithPopup(auth, new GoogleAuthProvider())
</script>

<template>
  <pre v-if="isAuthenticated">{{ user }}</pre>
  <div v-else>
    <button @click="signIn">
      Sign In with Google
    </button>
  </div>
</template>
```

## Returns

| Name            | Type                          |
| --------------- | ----------------------------- |
| isAuthenticated | `computed`                    |
| user            | `deepRef&lt;User \| null&gt;` |

## Reference

[VueUse Docs](https://vueuse.org/core/useAuth/)

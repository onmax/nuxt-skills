# Nuxt Server Patterns

## When to Use

Working with `server/` directory - API routes, server middleware, server utilities.

## Server Directory Structure

```
server/
├── api/                    # API endpoints
│   ├── users.get.ts        # GET /api/users
│   ├── users.post.ts       # POST /api/users
│   └── users/
│       └── [id].get.ts     # GET /api/users/:id
├── routes/                 # Non-API routes
│   └── healthz.get.ts      # GET /healthz
├── middleware/             # Server middleware
│   └── log.ts
└── utils/                  # Server utilities (auto-imported)
    └── db.ts
```

## API Routes

File naming determines HTTP method and route:

- `users.get.ts` → GET /api/users
- `users.post.ts` → POST /api/users
- `users/[userId].get.ts` → GET /api/users/:userId
- `users/[userId].delete.ts` → DELETE /api/users/:userId

**REQUIRED: Use descriptive param names:** `[userId].get.ts` NOT `[id].get.ts`

## Red Flags - Stop and Check Skill

If you're thinking any of these, STOP and re-read this skill:

- "I'll use event.context.params like before"
- "Generic [id] is fine for params"
- "Don't need .get.ts suffix"
- "I remember how Nuxt 3 API routes worked"

All of these mean: You're using outdated patterns. Use Nuxt 4 patterns instead.

### Basic API Route

```ts
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const users = await fetchUsers()
  return users
})
```

### Route with Params

```ts
// server/api/users/[userId].get.ts
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID is required'
    })
  }

  const user = await fetchUserById(userId)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found'
    })
  }

  return user
})
```

### Route with Query Params

```ts
// server/api/users.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10

  const users = await fetchUsers({ page, limit })
  return users
})
```

### Route with Body

```ts
// server/api/users.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate body
  if (!body.name || !body.email) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, email'
    })
  }

  const user = await createUser(body)
  setResponseStatus(event, 201)
  return user
})
```

## Error Handling

Use `createError` for HTTP errors:

```ts
throw createError({
  statusCode: 400,
  statusMessage: 'Bad Request',
  message: 'Invalid input',
  data: { field: 'email' } // Optional additional data
})
```

## Server Middleware

Runs on every server request:

```ts
// server/middleware/log.ts
export default defineEventHandler((event) => {
  console.log(`${event.method} ${event.path}`)
})
```

Named middleware for specific patterns:

```ts
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  const token = getRequestHeader(event, 'authorization')

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Attach user to event context
  event.context.user = await verifyToken(token)
})
```

## Server Utils

Reusable server functions (auto-imported):

```ts
// server/utils/db.ts
import { db } from './database'

export async function fetchUsers(options: { page: number, limit: number }) {
  return await db.select().from('users').limit(options.limit).offset((options.page - 1) * options.limit)
}

export async function fetchUserById(id: string) {
  return await db.select().from('users').where({ id }).first()
}
```

Auto-imported in all server routes and middleware.

## Request Helpers

```ts
// Get params
const userId = getRouterParam(event, 'userId')

// Get query
const query = getQuery(event)

// Get body
const body = await readBody(event)

// Get headers
const auth = getRequestHeader(event, 'authorization')

// Get cookies
const token = getCookie(event, 'token')

// Get method
const method = getMethod(event)

// Get IP
const ip = getRequestIP(event)
```

## Response Helpers

```ts
// Set status code
setResponseStatus(event, 201)

// Set headers
setResponseHeader(event, 'X-Custom', 'value')
setResponseHeaders(event, { 'X-Custom': 'value', 'X-Another': 'value' })

// Set cookies
setCookie(event, 'token', 'value', {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 1 week
})

// Redirect
return sendRedirect(event, '/login', 302)

// Stream
return sendStream(event, stream)

// No content
return sendNoContent(event)
```

## Best Practices

- **Use descriptive param names** - `[userId]` not `[id]`
- **Keep routes thin** - delegate to server utils
- **Validate input** at route level
- **Use typed errors** with createError
- **Handle errors gracefully** - don't expose internals
- **Use server utils** for DB/external APIs
- **Don't expose sensitive data** in responses
- **Set proper status codes** - 201 for created, 204 for no content

## Common Mistakes

| ❌ Wrong                  | ✅ Right                      |
| ------------------------- | ----------------------------- |
| `event.context.params.id` | `getRouterParam(event, 'id')` |
| `return res.json(data)`   | `return data`                 |
| `[id].get.ts`             | `[userId].get.ts`             |
| `users-id.get.ts`         | `users/[id].get.ts`           |
| Throw generic errors      | Use createError with status   |

## Resources

- Nuxt server: https://nuxt.com/docs/guide/directory-structure/server
- h3 (Nitro engine): https://h3.unjs.io/
- Nitro: https://nitro.unjs.io/

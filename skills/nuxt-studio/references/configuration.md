# Configuration

## When to Use

Installing Nuxt Studio, configuring auth/git providers, setting up environment variables, or customizing module options.

## Installation

```bash
npx nuxt module add nuxt-studio
```

Requires `@nuxt/content` and SSR-capable hosting (`nuxt build`, not static-only).

## Module Options

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-studio'],
  studio: {
    route: '/_studio', // Admin route (default)
    dev: true, // Enable in dev (default), set false to test prod locally
    i18n: { defaultLocale: 'en' }, // 23 languages supported
    git: {
      commit: { messagePrefix: 'content:' }, // Prefix all commits
    },
    media: {
      external: false, // Enable NuxtHub blob storage
      maxFileSize: 10, // MB
      allowedTypes: ['image/*', 'video/*', 'audio/*'],
      prefix: 'studio', // Bucket path prefix
    },
    meta: {
      components: {
        include: ['Content*', 'Landing*'],
        exclude: ['HiddenComponent'],
        groups: [
          { label: 'Content', include: ['content*'] },
          { label: 'UI', include: ['app/components/ui/**'] },
        ],
        ungrouped: 'include',
      },
    },
  },
})
```

## Auth Providers

### GitHub OAuth

```bash
# .env
STUDIO_GITHUB_CLIENT_ID=<client_id>
STUDIO_GITHUB_CLIENT_SECRET=<client_secret>
STUDIO_GITHUB_MODERATORS=admin@example.com,editor@example.com  # Optional whitelist
STUDIO_GITHUB_INSTANCE_URL=https://gh-ent.com  # GitHub Enterprise
```

Callback URL: `https://yourdomain.com/__nuxt_studio/auth/github`
Git operations use the OAuth token automatically.

### GitLab OAuth

```bash
STUDIO_GITLAB_APPLICATION_ID=<app_id>
STUDIO_GITLAB_APPLICATION_SECRET=<secret>
STUDIO_GITLAB_MODERATORS=admin@example.com  # Optional
STUDIO_GITLAB_INSTANCE_URL=https://gitlab.company.com  # Self-hosted
```

Callback URL: `https://yourdomain.com/__nuxt_studio/auth/gitlab`
Requires `api` scope.

### Google OAuth

```bash
STUDIO_GOOGLE_CLIENT_ID=<client_id>
STUDIO_GOOGLE_CLIENT_SECRET=<client_secret>
STUDIO_GOOGLE_MODERATORS=admin@example.com  # REQUIRED
STUDIO_GITHUB_TOKEN=<pat>  # PAT needed — Google doesn't provide Git access
```

Callback URL: `https://yourdomain.com/__nuxt_studio/auth/google`

### SSO Server

Deploy [nuxt-studio-sso](https://github.com/nuxt-content/nuxt-studio-sso) independently:

```bash
STUDIO_SSO_URL=https://your-sso-server.com
STUDIO_SSO_CLIENT_ID=<client_id>
STUDIO_SSO_CLIENT_SECRET=<client_secret>
```

### Custom Auth

```ts
// server/api/login.post.ts
import { setStudioUserSession } from '#imports'

export default eventHandler(async (event) => {
  const { email, password } = await readBody(event)
  const user = await validateCredentials(email, password)
  if (!user) throw createError({ statusCode: 401, message: 'Invalid credentials' })

  await setStudioUserSession(event, {
    providerId: user.id, name: user.name, email: user.email, avatar: user.avatar || '',
  })
  return { ok: true }
})
```

Logout: call `clearStudioUserSession(event)`. Requires PAT for Git operations.

## Git Provider Setup

```ts
studio: {
  repository: {
    provider: 'github', // or 'gitlab'
    owner: 'your-username',
    repo: 'your-repo',
    branch: 'main',
    rootDir: 'docs', // Monorepo support
    private: true, // Set false to limit OAuth to public repos
    instanceUrl: 'https://gh-ent.com', // Enterprise/self-hosted
  },
}
```

Auto-detected on Vercel, Netlify, GitHub Actions, GitLab CI from platform env vars. Manual config overrides auto-detection.

## Auth Hooks

```ts
// server/plugins/studio-auth.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('studio:auth:login', async ({ user, event }) => {
    console.log(`${user.email} logged in`)
  })
  nitroApp.hooks.hook('studio:auth:logout', async ({ user, event }) => {
    console.log(`${user.email} logged out`)
  })
})
```

## Provider Comparison

| Provider | Auth | Git Ops       | Access Control       |
| -------- | ---- | ------------- | -------------------- |
| GitHub   | OAuth | Automatic    | OAuth scope          |
| GitLab   | OAuth | Automatic    | OAuth scope          |
| Google   | OAuth | PAT required | Moderator whitelist  |
| SSO      | SSO   | Automatic    | SSO server           |
| Custom   | Custom| PAT required | Custom logic         |

Multiple providers can be used simultaneously (e.g., GitHub for devs + Google for editors).

## Resources

- Setup: https://nuxt.studio/setup
- Auth providers: https://nuxt.studio/auth-providers
- Git providers: https://nuxt.studio/git-providers

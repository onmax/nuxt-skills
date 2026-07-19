---
name: nuxt-studio
description: Configure and operate the self-hosted Nuxt Studio editor for Nuxt Content. Use when working with nuxt-studio installation, editor customization, OAuth or custom authentication, media, drafts, Git publishing, or production deployment.
license: MIT
---

# Nuxt Studio

Nuxt Studio owns content editing and publishing. Nuxt Content owns collections, queries, parsing, and rendering.

## Workflow

1. Inspect the installed `nuxt-studio` and `@nuxt/content` versions, deployment mode, repository provider, and authentication provider. Setup is understood when the editor route, Git target, and login callback all point at the same deployment.
2. Open the smallest matching guide below and keep collection/schema changes within the `nuxt-content` boundary.
3. Verify local editing against the filesystem, then verify production login and one publish cycle on an SSR-capable deployment. The work is complete when the commit reaches the configured branch and the rebuilt site exposes it.

## Routing

| Task                                                                                      | Open                                         |
| ----------------------------------------------------------------------------------------- | -------------------------------------------- |
| Install, repository settings, OAuth/custom auth, editor filters, or environment variables | [Configuration](references/configuration.md) |
| Visual/MDC editing, schema forms, drafts, media, or AI assistance                         | [Live editing](references/live-editing.md)   |
| SSR deployment, Git publishing, branch strategy, conflicts, or monorepos                  | [Deployment](references/deployment.md)       |
| Collections, validators, queries, hooks, or rendering                                     | `nuxt-content` skill                         |

## Baseline

```bash
npx nuxt module add nuxt-studio
```

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-studio'],
  studio: {
    repository: {
      provider: 'github',
      owner: 'your-org',
      repo: 'your-repo',
      branch: 'main',
    },
  },
})
```

```bash
NUXT_STUDIO_AUTH_GITHUB_CLIENT_ID=<client-id>
NUXT_STUDIO_AUTH_GITHUB_CLIENT_SECRET=<client-secret>
```

Studio runs at `/_studio` by default. Supported CI providers can infer repository metadata, but authentication credentials remain explicit deployment secrets.

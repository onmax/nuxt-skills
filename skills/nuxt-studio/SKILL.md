---
name: nuxt-studio
description: Use when working with Nuxt Studio, the self-hosted open-source CMS for Nuxt Content sites - provides visual editing, media management, Git-based publishing, auth providers, and AI content assistance
license: MIT
---

# Nuxt Studio

Self-hosted, open-source CMS module for editing Nuxt Content websites in production.

## When to Use

Working with:

- Installing and configuring `nuxt-studio` module
- Authentication providers (GitHub, GitLab, Google OAuth, SSO, custom)
- Git provider setup (GitHub, GitLab, branch config)
- Visual content editing (MDC components, YAML/JSON forms, frontmatter)
- Media management (public dir, NuxtHub blob, S3, R2)
- Publishing flow (draft layer, conflict detection, CI/CD rebuild)
- AI-powered content assistance (Vercel AI Gateway)

**For content collections/queries:** use `nuxt-content` skill
**For NuxtHub storage/database:** use `nuxthub` skill
**For Nuxt basics:** use `nuxt` skill

## Available Guidance

Read specific files based on current work:

- **[references/configuration.md](references/configuration.md)** - Module setup, auth providers, Git providers, environment variables
- **[references/live-editing.md](references/live-editing.md)** - Visual editor, media management, MDC components, AI features
- **[references/deployment.md](references/deployment.md)** - SSR requirements, Git publishing, branch strategies, CI/CD

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [references/configuration.md](references/configuration.md) - if installing, configuring auth/git providers, or setting env vars
- [ ] [references/live-editing.md](references/live-editing.md) - if working with content editor, media, components, or AI features
- [ ] [references/deployment.md](references/deployment.md) - if deploying, configuring branches, or troubleshooting publish flow

**DO NOT load all files at once.** Load only what's relevant to your current task.

## Key Concepts

| Concept        | Purpose                                                    |
| -------------- | ---------------------------------------------------------- |
| Auth providers | Control who can access Studio (GitHub, GitLab, Google, SSO)|
| Git providers  | Handle publishing commits to your repository               |
| Draft layer    | IndexedDB-backed local storage for unpublished changes     |
| Media manager  | Upload/browse files in `/public` or external blob storage  |
| Visual editor  | TipTap-based WYSIWYG with MDC component support           |
| Publishing     | Commits drafts to Git, triggers CI/CD rebuild              |

## Quick Start

```bash
npx nuxt module add nuxt-studio
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-studio'],
  studio: {
    repository: {
      provider: 'github',
      owner: 'your-username',
      repo: 'your-repo',
      branch: 'main',
    },
  },
})
```

```bash
# .env
STUDIO_GITHUB_CLIENT_ID=<client_id>
STUDIO_GITHUB_CLIENT_SECRET=<client_secret>
```

Access Studio at `https://your-site.com/_studio` (default route).

## Official Documentation

- Nuxt Studio: https://nuxt.studio
- Setup: https://nuxt.studio/setup
- GitHub: https://github.com/nuxt-content/nuxt-studio

## Token Efficiency

Main skill: ~300 tokens. Each sub-file: ~800-1200 tokens. Only load files relevant to current task.

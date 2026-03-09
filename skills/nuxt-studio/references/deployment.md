# Deployment

## When to Use

Deploying a Nuxt Studio site, configuring Git publishing, setting up branch strategies, or troubleshooting the publish flow.

## Requirements

- **SSR hosting required** — Studio needs server-side routes for authentication. Deploy with `nuxt build`, not static-only generation.
- **Nuxt Content** — `@nuxt/content` must be installed and configured.
- Supported platforms: Vercel, Netlify, Cloudflare Pages, any Node.js SSR host.

## Publishing Flow

1. Editor makes changes → stored as drafts in IndexedDB (browser-local)
2. Editor clicks Publish → Studio commits drafts to Git via provider API
3. CI/CD detects commit → rebuilds and redeploys automatically
4. Studio detects new deployment → notifies editors

No webhooks to configure — publishing uses the Git provider's API directly, and deployment relies on your existing CI/CD pipeline.

## Git Repository Config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  studio: {
    repository: {
      provider: 'github', // or 'gitlab'
      owner: 'your-username',
      repo: 'your-repo',
      branch: 'main',
    },
  },
})
```

### Auto-Detection

On supported platforms, repository details auto-detect from CI env vars:

| Platform       | Env Vars Used                                                          |
| -------------- | ---------------------------------------------------------------------- |
| Vercel         | `VERCEL_GIT_PROVIDER`, `VERCEL_GIT_REPO_OWNER`, `VERCEL_GIT_REPO_SLUG`, `VERCEL_GIT_COMMIT_REF` |
| Netlify        | `REPOSITORY_URL`, `BRANCH`                                            |
| GitHub Actions | `GITHUB_REPOSITORY`, `GITHUB_REF_NAME`                                |
| GitLab CI      | `CI_PROJECT_NAMESPACE`, `CI_PROJECT_NAME`, `CI_COMMIT_BRANCH`         |

Manual config overrides auto-detection.

## Branch Strategies

### Direct to Production

Default. Commits go to `main` (or configured branch), triggering production rebuild:

```ts
studio: { repository: { branch: 'main' } }
```

### Preview Branch

Publish to a staging branch, review on preview environment, then merge to production:

```ts
studio: {
  repository: {
    branch: process.env.STUDIO_BRANCH_NAME || 'content-preview',
  },
}
```

### Environment-Based

Different branches per deployment environment:

```ts
studio: {
  repository: {
    branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
  },
}
```

## Commit Configuration

```ts
studio: {
  git: {
    commit: {
      messagePrefix: 'content:', // Prepends to all Studio commits
    },
  },
}
```

## Conflict Detection

Studio compares local drafts against the latest Git version before publishing. Conflicts arise when:

- Multiple editors modify the same files during active builds
- Deployments fail, leaving production database out of sync with Git

Studio warns editors and prevents overwriting newer changes.

## Platform-Specific Setup

### Vercel

```ts
// nuxt.config.ts — repository auto-detected
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-studio'],
  // studio.repository auto-populated from VERCEL_GIT_* env vars
})
```

Set `STUDIO_GITHUB_CLIENT_ID` and `STUDIO_GITHUB_CLIENT_SECRET` in Vercel project settings.

### Netlify

```ts
// nuxt.config.ts — repository auto-detected from REPOSITORY_URL
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-studio'],
})
```

### Cloudflare Pages

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content', 'nuxt-studio'],
  studio: {
    repository: {
      provider: 'github',
      owner: 'your-username',
      repo: 'your-repo',
      branch: process.env.CF_PAGES_BRANCH || 'main',
    },
  },
})
```

## Pre-rendering (Optional)

If using hybrid rendering, ensure Studio routes aren't pre-rendered:

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },
})
```

Studio's `/_studio` route requires SSR and handles itself automatically.

## Monorepo Support

```ts
studio: {
  repository: {
    rootDir: 'docs', // Subdirectory containing the Nuxt project
  },
}
```

## Troubleshooting

| Issue                          | Solution                                                    |
| ------------------------------ | ----------------------------------------------------------- |
| Auth callback fails            | Verify callback URL matches `/__nuxt_studio/auth/{provider}` |
| Publishing fails               | Check PAT/OAuth has write permissions to repo                |
| Changes not visible after publish | CI/CD may still be building — wait for deployment           |
| Draft conflicts                | Pull latest changes, discard stale drafts                    |
| Studio route 404               | Ensure SSR deployment (`nuxt build`), not static generation  |

## Resources

- Setup: https://nuxt.studio/setup
- Advanced sync: https://nuxt.studio/advanced
- Git providers: https://nuxt.studio/git-providers

# Deployment and publishing

## Runtime requirement

Studio needs server routes for authentication, so deploy with `nuxt build` to an SSR-capable platform. Content pages may still be prerendered through hybrid rendering; the Studio and auth routes remain server-backed.

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

## Repository resolution

Vercel, Netlify, GitHub Actions, and GitLab CI can populate provider, owner, repository, and branch from their system environment variables. For other platforms, or when the editor publishes to a different repository, configure every field explicitly.

```ts
export default defineNuxtConfig({
  studio: {
    repository: {
      provider: 'github',
      owner: 'your-org',
      repo: 'docs',
      branch: process.env.NUXT_STUDIO_BRANCH || 'content-preview',
      rootDir: 'apps/docs',
    },
  },
})
```

`rootDir` points at the Nuxt application inside a monorepo. A preview branch is useful when content changes require review before production; Studio commits to that branch and the repository's normal pull-request workflow owns promotion to `main`.

## Publish cycle

1. Studio checks drafts against the current Git revision.
2. The editor supplies a commit message and publishes.
3. The Git provider writes the commit to the configured branch.
4. Existing CI/CD builds and deploys the commit.
5. Studio waits for the deployed Content database to catch up.

There is no separate Studio deployment webhook in this flow. The Git commit is the deployment trigger.

## Failure boundaries

| Symptom                       | Inspect                                                             |
| ----------------------------- | ------------------------------------------------------------------- |
| Login callback fails          | OAuth callback URL, deployed origin, provider environment variables |
| Studio route returns 404      | SSR deployment, module registration, custom `studio.route`          |
| Publish is forbidden          | OAuth scopes or fine-grained token content permissions              |
| Wrong repository or branch    | CI auto-detected metadata and explicit `studio.repository` values   |
| Published content stays stale | CI build status and deployed Content database revision              |
| Draft conflict                | Upstream file changes made after the local draft baseline           |

## Checks

- A production login succeeds through the configured provider.
- A disposable content edit creates one commit on the intended branch.
- CI deploys that commit and the refreshed site reads the new Content dump.
- Secrets remain deployment environment variables and are absent from client runtime config.

Official references: [setup](https://nuxt.studio/setup), [Git providers](https://nuxt.studio/git-providers), [auth providers](https://nuxt.studio/auth-providers).

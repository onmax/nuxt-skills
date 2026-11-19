import cms from 'vite-hub/cms'
import { defineContent } from 'vite-hub/content'
import { docsCollection } from 'vite-hub/docs'

// The Console edits the docs pages. A save commits to the `vitehub/content` branch of this repository, and a publish
// opens a pull request into main. Both sign in to GitHub as the Personal Project CMS App (VITEHUB_GITHUB_APP_ID and
// VITEHUB_GITHUB_PRIVATE_KEY on the Worker).
export default defineContent({
  extends: [cms, { repo: 'onmax/nuxt-skills', publish: 'pr' }],
  collections: { docs: docsCollection({ path: 'docs/content/**/*.md' }) },
  // The repository is public, so anyone reads published pages: /llms.txt, /sitemap.md, Markdown copies and /mcp.
  access: 'public',
  // Drafts, saves and publishes come only from the Console, with a request signed for a member of the linked project,
  // who comes in as `user`.
  authorize: ({ user }) => Boolean(user),
})

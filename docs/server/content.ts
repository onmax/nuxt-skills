import cms from 'vite-hub/cms'
import { defineContent } from 'vite-hub/content'
import { docsCollection } from 'vite-hub/docs'

// The Console edits the docs pages. A save commits to the `vitehub/content` branch of this repository, and a publish
// opens a pull request into main. Both need VITEHUB_GITHUB_TOKEN.
export default defineContent({
  extends: [cms, { repo: 'onmax/nuxt-skills', publish: 'pr' }],
  collections: { docs: docsCollection({ path: 'docs/content/**/*.md' }) },
  // Only the Console calls Content, with a request signed for a member of the linked project, who comes in as `user`.
  authorize: ({ user }) => Boolean(user),
})

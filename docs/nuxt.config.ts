import process from 'node:process'

// Local builds and CI run on Node with SQLite. The deploy build sets CLOUDFLARE_D1_DATABASE_ID to build the Worker.
const d1DatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID

export default defineNuxtConfig({
  // hosted-skill and skill-catalog write files that @vite-hub/docs reads, so they run before it.
  modules: ['@nuxt/ui', 'vite-hub/nuxt', './modules/hosted-skill', './modules/skill-catalog', 'vite-hub/docs/nuxt'],
  docs: {
    site: {
      name: 'nuxt-skills',
      url: 'https://nuxt-skill.onmax.me',
      description: 'Agent skills for Nuxt and Vue, and a Nuxt module that writes the ones your project needs.',
    },
    github: { repo: 'onmax/nuxt-skills', dir: 'docs/content' },
    socials: [
      { label: 'nuxt-skills on GitHub', icon: 'i-simple-icons-github', to: 'https://github.com/onmax/nuxt-skills' },
      { label: 'nuxt-skill-hub on npm', icon: 'i-simple-icons-npm', to: 'https://npmx.dev/package/nuxt-skill-hub' },
    ],
    seoAudit: 'error',
    // Off: readers who comment need to sign in, and the site has no Auth yet.
    comments: false,
  },
  vitehub: {
    name: 'nuxt-skills-docs',
    preset: d1DatabaseId ? 'cloudflare' : 'node',
    // The CMS keeps editor sessions here. Documents and their history live in the GitHub repository.
    database: d1DatabaseId ? { databaseId: d1DatabaseId, databaseName: 'nuxt-skills-docs' } : true,
    // Link it at https://console.vitehub.dev: the Console gives a VITEHUB_CONSOLE_KEY_* variable to set on the Worker.
    console: true,
  },
  agentDiscovery: {
    // modules/hosted-skill.ts writes the `nuxt` skill here, for `npx skills add https://nuxt-skill.onmax.me/`.
    skills: { dir: 'node_modules/.cache/hosted-skills' },
  },
  compatibilityDate: '2026-11-01',
})

import { detectHost } from 'vite-hub'

// Local builds and CI run on Node with SQLite. `vitehub deploy --host cloudflare` sets VITEHUB_HOST, so the deploy
// builds the Worker with the D1 database that it provisions and records in .vitehub/provision.json.
const host = detectHost() ?? 'node'

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
    banner: 'nuxt-skills is discontinued and no longer gets updates. The Install page says how to remove it.',
    seoAudit: 'error',
    // Off: readers who comment need to sign in, and the site has no Auth yet.
    comments: false,
  },
  vitehub: {
    name: 'nuxt-skills-docs',
    // The CMS keeps editor sessions here. Documents and their history live in the GitHub repository.
    database: host === 'cloudflare'
      ? { driver: 'cloudflare', databaseName: 'nuxt-skills-docs', migrateOnDeploy: true }
      : true,
    // Content keeps GitHub answers that never change (commits, trees, archives) here, so a new Worker isolate opens the
    // Console overview with a few GitHub requests instead of reading every commit again.
    kv: host === 'cloudflare'
      ? { driver: 'cloudflare', namespaceName: 'nuxt-skills-docs' }
      : true,
    // Linked at https://console.vitehub.dev as "Nuxt Skills". Its public key is the Worker var below.
    console: true,
  },
  nitro: {
    cloudflare: {
      wrangler: {
        // A public key, not a secret: the Console signs its calls with the private half.
        vars: { VITEHUB_CONSOLE_KEY_CONSOLE_073E73ED: '51iPVWlAcmwgvdRZczP-Z5JGLrx1b4YRYSvdpvo3Eb8' },
      },
    },
  },
  fonts: {
    // The ViteHub theme names Geist only in --font-sans and --font-mono, which @nuxt/fonts 1.x doesn't scan. The
    // pages use weights 400 to 700, so each family is one variable file per subset.
    families: ['Geist', 'Geist Mono'].map(name => ({
      name,
      provider: 'google',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      global: true,
    })),
  },
  agentDiscovery: {
    // modules/hosted-skill.ts writes the `nuxt` skill here, for `npx skills add https://nuxt-skill.onmax.me/`.
    skills: { dir: 'node_modules/.cache/hosted-skills' },
  },
  hooks: {
    // Every page prefetched every lazy chunk: charts, Mermaid and the CMS editor, about 1 MB gzipped that no page here
    // uses. Without prefetch, a page loads the chunks it renders when it renders them.
    'build:manifest': (manifest) => {
      for (const chunk of Object.values(manifest))
        chunk.dynamicImports = []
    },
  },
  compatibilityDate: '2026-11-01',
})

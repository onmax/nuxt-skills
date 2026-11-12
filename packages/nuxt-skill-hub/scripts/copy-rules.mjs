// Agents that can't load a skill folder get a pointer to node_modules/nuxt-skill-hub/nuxt-best-practices/rules,
// so the published module carries a copy of the core rule packs at that path.
import { cpSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const from = fileURLToPath(new URL('../../core/nuxt-best-practices', import.meta.url))
const to = fileURLToPath(new URL('../nuxt-best-practices', import.meta.url))
rmSync(to, { recursive: true, force: true })
cpSync(from, to, { recursive: true })

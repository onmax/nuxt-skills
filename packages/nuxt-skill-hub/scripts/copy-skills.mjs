// The published package carries a copy of the nuxt-skills skills it links (src/bundled-skills.json).
// In this repository the module reads them from the root skills/ folder instead.
import { cpSync, readFileSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const packages = JSON.parse(readFileSync(new URL('../src/bundled-skills.json', import.meta.url), 'utf8'))
const names = ['vue-best-practices', ...Object.keys(packages)]
const from = fileURLToPath(new URL('../../../skills/', import.meta.url))
const to = fileURLToPath(new URL('../skills/', import.meta.url))
rmSync(to, { recursive: true, force: true })
for (const name of names)
  cpSync(from + name, to + name, { recursive: true })

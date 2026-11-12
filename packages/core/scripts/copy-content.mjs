// Bundled skills live in this repository's skills/. The published package carries its own copy.
// Runs after `tsdown`, so the list comes from the built entry.
import { cpSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
// eslint-disable-next-line antfu/no-import-dist -- prepack runs after the build, and the list lives in TypeScript.
import { BUNDLED_SKILL_NAMES } from '../dist/index.mjs'

const from = fileURLToPath(new URL('../../../skills/', import.meta.url))
const to = fileURLToPath(new URL('../skills/', import.meta.url))
rmSync(to, { recursive: true, force: true })
for (const name of BUNDLED_SKILL_NAMES)
  cpSync(from + name, to + name, { recursive: true })

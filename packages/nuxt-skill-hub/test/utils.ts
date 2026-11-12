import { promises as fsp } from 'node:fs'
import { join } from 'node:path'
import { expect } from 'vitest'

/** Every Nuxt pack copied into the generated tree is linked from its router, and every pack link resolves. */
export async function expectCopiedPacksMatchRouterLinks(generatedSkillRoot: string, entry: string): Promise<void> {
  const copied: string[] = []
  for await (const path of fsp.glob('**/*.md', { cwd: join(generatedSkillRoot, 'references/nuxt') })) {
    copied.push(path.replaceAll('\\', '/'))
  }
  const linked = Array.from(entry.matchAll(/\]\(\.\/references\/nuxt\/([^)]+)\)/g), match => match[1]!)

  expect(copied.length).toBeGreaterThan(0)
  expect([...new Set(linked)].sort()).toEqual(copied.sort())
}

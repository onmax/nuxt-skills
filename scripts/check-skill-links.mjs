#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { isInside, listMarkdownFiles, mapRelativeLinks } from './markdown-links.mjs'

// Relative links must resolve to a file shipped with the plugin, i.e. inside skills/.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillsDir = join(root, 'skills')
const problems = []

for (const file of await listMarkdownFiles(skillsDir)) {
  mapRelativeLinks(await readFile(file, 'utf8'), (link) => {
    const target = resolve(dirname(file), link.path)
    if (!isInside(skillsDir, target))
      problems.push(`${relative(root, file)}: ${link.href} points outside skills/`)
    else if (!existsSync(target))
      problems.push(`${relative(root, file)}: ${link.href} does not exist`)
    return null
  })
}

if (problems.length) {
  console.error(`Found ${problems.length} broken skill link(s):\n${problems.join('\n')}`)
  process.exit(1)
}
console.log('All relative skill links resolve')

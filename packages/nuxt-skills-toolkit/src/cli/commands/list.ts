import type { SkillsManifest } from '../../types'
import { existsSync, promises as fsp } from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { join, resolve } from 'pathe'

export default defineCommand({
  meta: {
    name: 'list',
    description: 'List all bundled skills from installed Nuxt modules',
  },
  args: {
    cwd: {
      type: 'string',
      description: 'Project root directory',
      default: '.',
    },
    json: {
      type: 'boolean',
      alias: 'j',
      description: 'Output as JSON',
      default: false,
    },
  },
  async run({ args }) {
    const cwd = resolve(args.cwd)
    const manifestPath = join(cwd, '.nuxt', 'skills', 'manifest.json')

    if (!existsSync(manifestPath)) {
      consola.warn('No skills manifest found. Run `nuxt prepare` first.')
      process.exit(1)
    }

    const manifest: SkillsManifest = JSON.parse(await fsp.readFile(manifestPath, 'utf-8'))

    if (args.json) {
      console.log(JSON.stringify(manifest, null, 2))
      return
    }

    if (manifest.skills.length === 0) {
      consola.info('No bundled skills found')
      return
    }

    consola.log('')
    consola.log('Bundled Skills:')
    consola.log('')

    // Group by source
    const bySource = new Map<string, typeof manifest.skills>()
    for (const skill of manifest.skills) {
      const list = bySource.get(skill.source) || []
      list.push(skill)
      bySource.set(skill.source, list)
    }

    for (const [source, skills] of bySource) {
      consola.log(`  ${source}`)
      for (const skill of skills) {
        const desc = skill.description.length > 60 ? `${skill.description.slice(0, 60)}...` : skill.description
        consola.log(`    - ${skill.name}: ${desc}`)
      }
      consola.log('')
    }

    consola.log(`Total: ${manifest.skills.length} skill(s) from ${bySource.size} package(s)`)
  },
})

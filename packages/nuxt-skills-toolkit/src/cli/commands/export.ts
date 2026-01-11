import type { AgentTarget, SkillsManifest } from '../../types'
import { existsSync, promises as fsp } from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'
import { consola } from 'consola'
import { join, resolve } from 'pathe'
import { copySkillDir, expandHome } from '../../runtime/utils'
import { AGENT_DESTINATIONS } from '../../types'

const VALID_TARGETS = Object.keys(AGENT_DESTINATIONS) as AgentTarget[]

export default defineCommand({
  meta: {
    name: 'export',
    description: 'Export bundled skills to agent-specific directory',
  },
  args: {
    cwd: {
      type: 'string',
      description: 'Project root directory',
      default: '.',
    },
    target: {
      type: 'string',
      alias: 't',
      description: `Agent target: ${VALID_TARGETS.join(', ')}`,
      default: 'claude',
    },
    dest: {
      type: 'string',
      alias: 'd',
      description: 'Custom destination directory (overrides --target)',
    },
  },
  async run({ args }) {
    const cwd = resolve(args.cwd)
    const manifestPath = join(cwd, '.nuxt', 'skills', 'manifest.json')
    const skillsDir = join(cwd, '.nuxt', 'skills')

    if (!existsSync(manifestPath)) {
      consola.warn('No skills manifest found. Run `nuxt prepare` first.')
      process.exit(1)
    }

    const manifest: SkillsManifest = JSON.parse(await fsp.readFile(manifestPath, 'utf-8'))

    if (manifest.skills.length === 0) {
      consola.info('No bundled skills to export')
      return
    }

    // Determine destination
    let destDir: string
    if (args.dest) {
      destDir = resolve(cwd, args.dest)
    }
    else {
      const target = args.target as AgentTarget
      if (!VALID_TARGETS.includes(target)) {
        consola.error(`Invalid target "${target}". Valid targets: ${VALID_TARGETS.join(', ')}`)
        process.exit(1)
      }
      const destPath = AGENT_DESTINATIONS[target]
      // Project-local paths stay relative to cwd, home paths expand ~
      destDir = destPath.startsWith('.') ? resolve(cwd, destPath) : expandHome(destPath)
    }

    consola.info(`Exporting ${manifest.skills.length} skill(s) to ${destDir}`)

    await fsp.mkdir(destDir, { recursive: true })

    for (const skill of manifest.skills) {
      const srcDir = join(skillsDir, skill.path)
      const destSkillDir = join(destDir, skill.name)
      await copySkillDir(srcDir, destSkillDir)
      consola.success(`  ${skill.name}`)
    }

    consola.log('')
    consola.success(`Exported to ${destDir}`)
  },
})

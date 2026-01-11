import type { Nuxt } from '@nuxt/schema'
import type { AddSkillOptions, SkillsToolkitOptions } from './types'
import { promises as fsp } from 'node:fs'
import { defineNuxtModule, useNuxt } from '@nuxt/kit'
import { consola } from 'consola'
import { join, resolve } from 'pathe'
import { copySkillDir, generateManifest, resolveSkills, scanForSkillPackages } from './runtime/utils'

const logger = consola.withTag('nuxt-skills')

// Store skills in nuxt.options to share state between module instances
const SKILLS_KEY = '__nuxtSkillsToolkit'

interface SkillEntry { dir: string, name?: string, source: string }

function getSkillsArray(nuxt: Nuxt): SkillEntry[] {
  const opts = nuxt.options as Record<string, unknown>
  if (!opts[SKILLS_KEY]) {
    opts[SKILLS_KEY] = []
  }
  return opts[SKILLS_KEY] as SkillEntry[]
}

/** Register a skill from a directory containing SKILL.md */
export function addSkill(options: AddSkillOptions): void {
  const nuxt = useNuxt()
  const skills = getSkillsArray(nuxt)
  skills.push({ dir: options.dir, name: options.name, source: 'module' })
}

export default defineNuxtModule<SkillsToolkitOptions>({
  meta: {
    name: 'nuxt-skills-toolkit',
    configKey: 'skills',
    compatibility: { nuxt: '>=3.14.0' },
  },
  defaults: { enabled: true },
  async setup(options, nuxt) {
    if (!options.enabled)
      return

    const outputDir = resolve(nuxt.options.buildDir, 'skills')

    // Shared function to scan and generate skills
    async function generateSkills() {
      const modulesDir = join(nuxt.options.rootDir, 'node_modules')
      const packageSkills = await scanForSkillPackages(modulesDir)
      const addedSkills = getSkillsArray(nuxt)

      // Add skills from additionalPaths (for local development)
      if (options.additionalPaths?.length) {
        for (const skillPath of options.additionalPaths) {
          const dir = resolve(nuxt.options.rootDir, skillPath)
          addedSkills.push({ dir, source: 'config' })
        }
      }

      const skills = await resolveSkills(packageSkills, addedSkills)

      if (skills.length === 0) {
        logger.info('No bundled skills found')
        return
      }

      logger.info(`Found ${skills.length} skill(s)`)

      // Copy skills to .nuxt/skills/
      await fsp.mkdir(outputDir, { recursive: true })
      for (const skill of skills) {
        const destDir = join(outputDir, skill.name)
        await copySkillDir(skill.dir, destDir)
        logger.success(`  ${skill.name} (from ${skill.source})`)
      }

      // Generate manifest
      const manifest = generateManifest(skills)
      await fsp.writeFile(join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
      logger.success(`Generated .nuxt/skills/manifest.json`)
    }

    // Hook: modules:done - runs during prepare, dev, build
    nuxt.hook('modules:done', generateSkills)

    // Hook: builder:watch - regenerate on skill file changes (dev only)
    if (nuxt.options.dev) {
      nuxt.hook('builder:watch', async (_event, path) => {
        if (path.includes('SKILL.md') || path.includes('/skills/')) {
          logger.info('Skill files changed, regenerating...')
          await generateSkills()
        }
      })
    }
  },
})

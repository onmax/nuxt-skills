import type { Nuxt } from '@nuxt/schema'
import type { AddSkillOptions, ResolvedSkill, SkillsToolkitOptions } from './types'
import { addTemplate, defineNuxtModule, useNuxt } from '@nuxt/kit'
import { consola } from 'consola'
import { join, resolve } from 'pathe'
import { copySkillDir, generateManifest, resolveSkills, scanForSkillPackages } from './runtime/utils'

const logger = consola.withTag('nuxt-skills')

// Store skills in nuxt.options to share state between module instances
const SKILLS_KEY = '__nuxtSkillsToolkit'
const RESOLVED_SKILLS_KEY = '__nuxtSkillsResolved'

interface SkillEntry { dir: string, name?: string, source: string }

function getSkillsArray(nuxt: Nuxt): SkillEntry[] {
  const opts = nuxt.options as Record<string, unknown>
  if (!opts[SKILLS_KEY]) opts[SKILLS_KEY] = []
  return opts[SKILLS_KEY] as SkillEntry[]
}

function setResolvedSkills(nuxt: Nuxt, skills: ResolvedSkill[]): void {
  const opts = nuxt.options as Record<string, unknown>
  opts[RESOLVED_SKILLS_KEY] = skills
}

function getResolvedSkills(nuxt: Nuxt): ResolvedSkill[] {
  const opts = nuxt.options as Record<string, unknown>
  return (opts[RESOLVED_SKILLS_KEY] || []) as ResolvedSkill[]
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

    // Collect skills during module setup
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
    setResolvedSkills(nuxt, skills)

    if (skills.length === 0) {
      logger.info('No bundled skills found')
      return
    }

    logger.info(`Found ${skills.length} skill(s)`)

    // Register manifest as template (uses Nuxt's write system)
    addTemplate({
      filename: 'skills/manifest.json',
      write: true,
      getContents: () => {
        const resolvedSkills = getResolvedSkills(nuxt)
        return JSON.stringify(generateManifest(resolvedSkills), null, 2)
      },
    })

    // Copy skill directories after templates are generated
    nuxt.hook('app:templatesGenerated', async () => {
      const resolvedSkills = getResolvedSkills(nuxt)
      for (const skill of resolvedSkills) {
        const destDir = join(outputDir, skill.name)
        await copySkillDir(skill.dir, destDir)
        logger.success(`  ${skill.name} (from ${skill.source})`)
      }
      logger.success(`Generated .nuxt/skills/manifest.json`)
    })

    // Hook: builder:watch - regenerate on skill file changes (dev only)
    if (nuxt.options.dev) {
      nuxt.hook('builder:watch', async (_event, path) => {
        if (path.includes('SKILL.md') || path.includes('/skills/')) {
          logger.info('Skill files changed, regenerating...')
          // Re-resolve and update skills
          const freshSkills = await resolveSkills(packageSkills, addedSkills)
          setResolvedSkills(nuxt, freshSkills)
          // Copy updated files
          for (const skill of freshSkills) {
            const destDir = join(outputDir, skill.name)
            await copySkillDir(skill.dir, destDir)
          }
        }
      })
    }
  },
})

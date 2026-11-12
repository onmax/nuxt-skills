import type { SkillHubCallHook, SkillHubHooks, SkillHubOptions } from './core'
import process from 'node:process'
import { defineNuxtModule, useLogger } from '@nuxt/kit'
import { join } from 'pathe'
import { isCI, isTest } from 'std-env'
import { version as PACKAGE_VERSION } from '../package.json'
import { DEFAULT_SKILL_HUB_GENERATION_MODE, deriveSkillName, detectConflictingSkills, formatConflictWarning, generateSkillTree, isValidSkillName, normalizeGenerationMode, resolveExportRoot, resolveTargets } from './core'
import { runInstallWizard } from './install'

export type ModuleOptions = SkillHubOptions

interface NuxtPerfProfiler {
  startPhase: (name: string) => void
  endPhase: (name: string) => void
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-skill-hub',
    version: PACKAGE_VERSION,
    configKey: 'skillHub',
    compatibility: {
      nuxt: '>=4.3.0',
    },
  },
  async onInstall(nuxt) {
    await runInstallWizard(nuxt)
  },
  defaults: {
    skillName: '',
    targets: [],
    moduleAuthoring: false,
    generationMode: DEFAULT_SKILL_HUB_GENERATION_MODE,
  },
  async setup(options, nuxt) {
    const logger = useLogger('nuxt-skill-hub')

    if (isCI && !isTest) {
      logger.info('Skipping skill generation in CI')
      return
    }

    if (process.argv.slice(2).includes('typecheck')) {
      logger.info('Skipping skill generation during typecheck')
      return
    }

    // Skills are written on `nuxt prepare` only, which also runs on postinstall in most projects.
    if (!nuxt.options._prepare) {
      return
    }

    const configuredSkillName = options.skillName?.trim()
    let resolvedSkillName: string

    if (configuredSkillName && isValidSkillName(configuredSkillName)) {
      resolvedSkillName = configuredSkillName
    }
    else {
      if (configuredSkillName) {
        logger.warn(`Invalid skillHub.skillName "${configuredSkillName}". Deriving from package.json.`)
      }
      resolvedSkillName = await deriveSkillName(nuxt.options.rootDir)
    }

    const exportRoot = await resolveExportRoot(nuxt.options.rootDir)
    const rawGenerationMode = options.generationMode
    const generationMode = normalizeGenerationMode(rawGenerationMode)
    const { targets, invalidTargets } = resolveTargets(options.targets || [])

    if (rawGenerationMode && rawGenerationMode !== generationMode) {
      logger.warn(`Invalid skillHub.generationMode "${rawGenerationMode}". Falling back to "prepare".`)
    }
    for (const invalidTarget of invalidTargets) {
      if (invalidTarget.reason === 'unknown-target') {
        logger.warn(`Target "${invalidTarget.target}" is unknown in unagent and was skipped.`)
        continue
      }
      logger.warn(`Target "${invalidTarget.target}" has no skillsDir in unagent and was skipped.`)
    }

    if (!targets.length) {
      logger.warn('No detected targets. Set skillHub.targets to force generation for specific agents.')
      return
    }

    for (const conflict of detectConflictingSkills(targets, resolvedSkillName)) {
      logger.warn(formatConflictWarning(conflict))
    }

    if (generationMode === 'manual') {
      logger.info('Skipping skill generation: skillHub.generationMode is \'manual\'')
      return
    }

    nuxt.hook('prepare:types', () => generateSkillTree({
      rootDir: nuxt.options.rootDir,
      modules: nuxt.options.modules,
      layerDirs: nuxt.options._layers.map(layer => layer.cwd || layer.config.rootDir || ''),
      // Older versions kept the tree in the build dir.
      staleDirs: [join(nuxt.options.buildDir, 'skill-hub')],
      debug: Boolean(nuxt.options.debug),
      callHook: nuxt.callHook as SkillHubCallHook,
      perf: (nuxt as unknown as { _perf?: NuxtPerfProfiler })._perf,
      logger,
      options,
      skillName: resolvedSkillName,
      exportRoot,
      targets,
    }))
  },
})

export type { SkillHubContribution, SkillHubContributionContext, SkillHubTarget } from './core'

declare module '@nuxt/schema' {
  interface NuxtHooks extends SkillHubHooks {}
}

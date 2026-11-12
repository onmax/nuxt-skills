import type { Nuxt } from '@nuxt/schema'
import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import { useLogger } from '@nuxt/kit'
import { createConsola } from 'consola'
import { colorize } from 'consola/utils'
import { join } from 'pathe'
import { agent, isAgent } from 'std-env'
import { collectInstalledModulePackages, deriveSkillName, detectConflictingSkills, detectCurrentTarget, detectInstalledTargets, formatConflictWarning, getSupportedTargets, MANAGED_HINT_END, MANAGED_HINT_START, pathExists, resolveExportRoot } from './core'

interface PendingWrite {
  file: string
  absPath: string
  preview: string
  content: string
  action: 'create' | 'modify'
}

function isCancelled(value: unknown): boolean {
  return value === null || typeof value === 'symbol'
}

function normalizeTargetSelection(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string')
        return entry
      if (entry && typeof entry === 'object' && typeof (entry as { value?: unknown }).value === 'string') {
        return (entry as { value: string }).value
      }
      return ''
    })
    .filter(Boolean)
}

export interface AIGuidance {
  intro: string
  snippet: string
  hintFile: string
  hint: string
  nextStep: string
  optionalFlags: string
}

export function buildAIGuidance(currentTarget?: string, detectedAgent?: string, skillName = 'nuxt'): AIGuidance {
  const agentTargetMap: Record<string, string> = {
    codex: 'codex',
    claude: 'claude-code',
    gemini: 'gemini-code-assist',
    replit: 'replit-agent',
  }
  const target = currentTarget || (detectedAgent ? agentTargetMap[detectedAgent] : undefined)
  const sourceLabel = detectedAgent ? ` (${detectedAgent})` : ''
  const hintFile = target === 'claude-code' ? 'CLAUDE.md' : 'AGENTS.md'
  const hint = `${MANAGED_HINT_START}\nUse the \`${skillName}\` skill as the Nuxt router/entrypoint for tasks in this repository.\n${MANAGED_HINT_END}`
  const snippetLines = [
    'export default defineNuxtConfig({',
    '  skillHub: {',
    ...(target ? [`    targets: ['${target}'],`] : []),
    `    generationMode: 'prepare',`,
    '  },',
    '})',
  ]

  return {
    intro: `Install wizard skipped because nuxt-skill-hub was installed by an AI agent${sourceLabel}. Add this to your nuxt.config.ts:`,
    snippet: snippetLines.join('\n'),
    hintFile,
    hint,
    nextStep: `Add the managed hint to ${hintFile}, then run \`npx nuxi prepare\` to generate the Nuxt skill tree.`,
    optionalFlags: target
      ? 'Optional flags: set `skillHub.skillName`, enable `skillHub.moduleAuthoring`, or switch to `skillHub.generationMode: \'manual\'` if needed.'
      : 'Optional flags: add `skillHub.targets` to pin an agent target, set `skillHub.skillName`, enable `skillHub.moduleAuthoring`, or switch to `skillHub.generationMode: \'manual\'` if needed.',
  }
}

export async function runInstallWizard(nuxt: Nuxt): Promise<void> {
  const logger = useLogger('nuxt-skill-hub')

  if (isAgent) {
    const guidance = buildAIGuidance(detectCurrentTarget(), agent, await deriveSkillName(nuxt.options.rootDir))
    logger.info(guidance.intro)
    logger.info(`\`\`\`ts\n${guidance.snippet}\n\`\`\``)
    logger.info(`Add this to ${guidance.hintFile}:\n\`\`\`md\n${guidance.hint}\n\`\`\``)
    logger.info(guidance.nextStep)
    logger.info(guidance.optionalFlags)
    return
  }

  // Skip in CI or non-interactive environments
  if (process.env.CI || !process.stdout.isTTY) {
    logger.info('Non-interactive environment detected, skipping install wizard.')
    return
  }

  const consola = createConsola()
  const rootDir = nuxt.options.rootDir
  const exportRoot = await resolveExportRoot(rootDir)
  const skillName = await deriveSkillName(rootDir)
  const pendingWrites: PendingWrite[] = []

  consola.box(
    `nuxt-skill-hub — First-time setup\n`
    + `Let's configure AI agent skills for your Nuxt project.`,
  )

  // ── Step 1: Detect agents ──
  const currentTarget = detectCurrentTarget()
  let selectedTargets: string[]

  if (currentTarget) {
    consola.info(`Running inside ${currentTarget}, auto-selecting it.`)
    selectedTargets = [currentTarget]
  }
  else {
    const detectedTargets = detectInstalledTargets()
    const allTargets = getSupportedTargets()

    if (!detectedTargets.length && !allTargets.length) {
      consola.warn('No AI agents detected. Skills will be generated when an agent is detected.')
      consola.info('Supported agents are sourced from unagent.')
      return
    }

    consola.info(`Detected agents: ${detectedTargets.length ? detectedTargets.join(', ') : 'none'}`)
    selectedTargets = detectedTargets

    if (!selectedTargets.length) {
      const chosen = await consola.prompt('Select agents to generate skills for:', {
        type: 'multiselect',
        options: allTargets.map(t => ({ label: t, value: t })),
        initial: allTargets.includes('codex') ? ['codex'] : allTargets.slice(0, 1),
        required: true,
        cancel: 'null',
      })

      if (isCancelled(chosen)) {
        consola.info('Setup cancelled.')
        return
      }

      selectedTargets = normalizeTargetSelection(chosen)
    }

    if (detectedTargets.length > 1) {
      const keepAll = await consola.prompt('Generate skills for all detected agents?', {
        type: 'confirm',
        initial: true,
        cancel: 'null',
      })

      if (isCancelled(keepAll)) {
        consola.info('Setup cancelled.')
        return
      }

      if (!keepAll) {
        const chosen = await consola.prompt('Select agents to generate skills for:', {
          type: 'multiselect',
          options: detectedTargets.map(t => ({ label: t, value: t })),
          initial: detectedTargets,
          required: true,
          cancel: 'null',
        })

        if (isCancelled(chosen)) {
          consola.info('Setup cancelled.')
          return
        }

        selectedTargets = normalizeTargetSelection(chosen)
      }
    }
  }

  // ── Step 2: Module skills ──
  const installedModulePackages = (await collectInstalledModulePackages(nuxt.options.modules, rootDir))
    .map(pkg => pkg.packageName)
    .filter(name => name !== 'nuxt-skill-hub')

  if (installedModulePackages.length) {
    consola.info(`Detected ${installedModulePackages.length} installed module package(s):`)
    for (const packageName of installedModulePackages) {
      consola.log(`  ${packageName}`)
    }
    consola.info('Module skills and metadata routers are resolved automatically at build time.')
  }
  else {
    consola.info('No installed module entries were discovered.')
  }

  // ── Warn about conflicting old standalone skills ──
  for (const conflict of detectConflictingSkills(selectedTargets, skillName)) {
    consola.warn(formatConflictWarning(conflict))
  }

  // ── Step 3: CLAUDE.md / AGENTS.md hint ──
  const hintBlock = `${MANAGED_HINT_START}\nUse the \`${skillName}\` skill as the Nuxt router/entrypoint for tasks in this repository.\n${MANAGED_HINT_END}`

  const hintFileChoice = await consola.prompt('Add a skill hint to help agents discover the skill?', {
    type: 'select',
    options: [
      { label: 'CLAUDE.md', value: 'claude', hint: 'Claude Code project instructions' },
      { label: 'AGENTS.md', value: 'agents', hint: 'Universal agent instructions' },
      { label: 'Both', value: 'both' },
      { label: 'Skip', value: 'skip' },
    ],
    cancel: 'null',
  })

  if (isCancelled(hintFileChoice)) {
    consola.info('Setup cancelled.')
    return
  }

  const addToFile = async (filename: string) => {
    const filePath = join(exportRoot, filename)
    const exists = await pathExists(filePath)
    const current = exists ? readFileSync(filePath, 'utf8') : ''
    const regex = new RegExp(`${MANAGED_HINT_START}[\\s\\S]*?${MANAGED_HINT_END}`)

    let newContent: string
    if (regex.test(current)) {
      newContent = current.replace(regex, hintBlock)
    }
    else if (current) {
      newContent = `${current.trimEnd()}\n\n${hintBlock}\n`
    }
    else {
      newContent = `${hintBlock}\n`
    }

    pendingWrites.push({
      file: filename,
      absPath: filePath,
      preview: `+ Use the \`${skillName}\` skill as the Nuxt router/entrypoint for tasks in this repository.`,
      content: newContent,
      action: exists ? 'modify' : 'create',
    })
  }

  if (hintFileChoice === 'claude' || hintFileChoice === 'both') {
    await addToFile('CLAUDE.md')
  }
  if (hintFileChoice === 'agents' || hintFileChoice === 'both') {
    await addToFile('AGENTS.md')
  }

  // ── Step 4: Summary + Confirmation ──
  if (!pendingWrites.length) {
    consola.success('No file changes needed. Setup complete!')
    consola.info('Run `nuxt prepare` to generate the build-dir skill output.')
    return
  }

  consola.log('')
  consola.info('Planned changes:')
  for (const write of pendingWrites) {
    consola.box({ title: write.file, message: colorize('green', write.preview), style: { borderColor: 'green' } })
  }

  const confirm = await consola.prompt('Apply these changes?', {
    type: 'confirm',
    initial: true,
    cancel: 'null',
  })

  if (isCancelled(confirm) || !confirm) {
    consola.info('Setup cancelled. No files were modified.')
    return
  }

  // ── Step 5: Execute writes ──
  for (const write of pendingWrites) {
    writeFileSync(write.absPath, write.content, 'utf8')
    const verb = write.action === 'create' ? 'Created' : 'Updated'
    consola.success(`${verb} ${write.file}`)
  }

  consola.log('')
  consola.box(
    `Setup complete!\n\n`
    + `Run \`nuxt prepare\` to generate the build-dir skill output.\n`
    + `Configure \`skillHub.skillName\`, \`skillHub.targets\`, or set \`skillHub.generationMode: 'manual'\` in nuxt.config.ts if needed.`,
  )
}

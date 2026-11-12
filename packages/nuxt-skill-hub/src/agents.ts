import type { AgentConfig } from 'unagent/env'
import { homedir } from 'node:os'
import { isAbsolute, join, relative } from 'pathe'
import {

  detectCurrentAgent as detectUnagentCurrentAgent,
  detectInstalledAgents as detectUnagentInstalledAgents,
  expandPath,
  getAgentConfig,
  getAgentIds,
} from 'unagent/env'

export type SkillHubTarget = string

/** Target for the shared `.agents/skills` folder, without naming an agent. */
export const UNIVERSAL_TARGET = 'universal'
const UNIVERSAL_SKILLS_DIR = '.agents/skills'
// Agents that read project skills from `.agents/skills`, per the agent table in vercel-labs/skills.
// unagent still maps them to their own config dirs.
const UNIVERSAL_AGENTS = new Set(['amp', 'cline', 'codex', 'cursor'])

export interface ResolvedAgentTargetConfig {
  target: SkillHubTarget
  configDir: string
  skillsDir: string
  /** Relative to the export root. Undefined when the agent's config dir isn't under home, so it can't be mirrored. */
  projectSkillsDir?: string
  loadsSkillFolders: boolean
  /** Where older versions wrote the skill for the agents this target covers, before they moved to `.agents/skills`. */
  previousProjectSkillsDirs: string[]
}

export type InvalidTargetReason = 'unknown-target' | 'missing-skills-dir'

export interface InvalidTarget {
  target: SkillHubTarget
  reason: InvalidTargetReason
}

function resolveSkillsDir(target: SkillHubTarget, config: AgentConfig | undefined): string | undefined {
  if (config?.skillsDir) {
    return config.skillsDir
  }

  if (target === 'codex') {
    return 'skills'
  }

  return undefined
}

/** Mirrors the agent's config dir inside the project, e.g. `~/.claude` + `skills` -> `.claude/skills`. */
function mirrorConfigDir(configDir: string, skillsDir: string): string | undefined {
  const relativeConfigDir = relative(homedir(), configDir)
  if (relativeConfigDir.startsWith('..') || isAbsolute(relativeConfigDir)) {
    return undefined
  }
  return join(relativeConfigDir, skillsDir)
}

export function getSupportedTargets(): SkillHubTarget[] {
  return [
    ...getAgentIds().filter(target => Boolean(resolveSkillsDir(target, getAgentConfig(target)))),
    UNIVERSAL_TARGET,
  ].sort((a, b) => a.localeCompare(b))
}

export function resolveAgentTargetConfig(target: SkillHubTarget): ResolvedAgentTargetConfig | undefined {
  const normalized = target.trim()
  if (!normalized) {
    return undefined
  }

  if (normalized === UNIVERSAL_TARGET) {
    return {
      target: normalized,
      configDir: join(homedir(), '.agents'),
      skillsDir: 'skills',
      projectSkillsDir: UNIVERSAL_SKILLS_DIR,
      loadsSkillFolders: true,
      previousProjectSkillsDirs: [...UNIVERSAL_AGENTS].flatMap(agent => resolveAgentTargetConfig(agent)?.previousProjectSkillsDirs ?? []),
    }
  }

  const config = getAgentConfig(normalized)
  const skillsDir = resolveSkillsDir(normalized, config)
  if (!config || !skillsDir) {
    return undefined
  }

  const configDir = expandPath(config.configDir)
  const ownProjectSkillsDir = mirrorConfigDir(configDir, skillsDir)
  if (UNIVERSAL_AGENTS.has(normalized)) {
    return {
      target: normalized,
      configDir,
      skillsDir,
      projectSkillsDir: UNIVERSAL_SKILLS_DIR,
      loadsSkillFolders: true,
      previousProjectSkillsDirs: ownProjectSkillsDir ? [ownProjectSkillsDir] : [],
    }
  }

  return {
    target: normalized,
    configDir,
    skillsDir,
    projectSkillsDir: ownProjectSkillsDir,
    loadsSkillFolders: skillsDir === 'skills',
    previousProjectSkillsDirs: [],
  }
}

/** Agents that load a skill folder with references. The rest load every file in a rules directory. */
export function loadsSkillFolders(target: SkillHubTarget): boolean {
  return resolveAgentTargetConfig(target)?.loadsSkillFolders ?? false
}

export function validateTargets(targets: SkillHubTarget[]): { valid: SkillHubTarget[], invalid: InvalidTarget[] } {
  const uniqueTargets = Array.from(new Set(targets.map(target => target.trim()).filter(Boolean)))
  const valid: SkillHubTarget[] = []
  const invalid: InvalidTarget[] = []

  for (const target of uniqueTargets) {
    if (target === UNIVERSAL_TARGET) {
      valid.push(target)
      continue
    }

    const config = getAgentConfig(target)
    if (!config) {
      invalid.push({
        target,
        reason: 'unknown-target',
      })
      continue
    }

    if (!resolveSkillsDir(target, config)) {
      invalid.push({
        target,
        reason: 'missing-skills-dir',
      })
      continue
    }

    valid.push(target)
  }

  return { valid, invalid }
}

export function detectCurrentTarget(): SkillHubTarget | undefined {
  const current = detectUnagentCurrentAgent()
  if (!current)
    return undefined
  const skillsDir = resolveSkillsDir(current.id, current.config)
  return skillsDir ? current.id : undefined
}

/** Agents with a config dir in the home directory, plus the agent running this process. */
export function detectInstalledTargets(): SkillHubTarget[] {
  return Array.from(new Set(
    detectUnagentInstalledAgents()
      .filter(agent => resolveSkillsDir(agent.id, agent.config))
      .map(agent => agent.id),
  )).sort((a, b) => a.localeCompare(b))
}

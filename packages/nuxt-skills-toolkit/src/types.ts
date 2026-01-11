/** Skill entry in package.json agentskills field */
export interface SkillEntry { name: string, path: string }

/** package.json agentskills field schema */
export interface PackageAgentSkills { skills: SkillEntry[] }

/** Options for addSkill() */
export interface AddSkillOptions {
  /** Path to skill directory containing SKILL.md */
  dir: string
  /** Override name (default: read from SKILL.md frontmatter) */
  name?: string
}

/** Resolved skill after processing */
export interface ResolvedSkill {
  name: string
  description: string
  source: string
  dir: string
  license?: string
  references: string[]
}

/** .nuxt/skills/manifest.json schema */
export interface SkillsManifest {
  version: 1
  generatedAt: string
  skills: Array<{
    name: string
    description: string
    source: string
    path: string
    license?: string
    references: string[]
  }>
}

/** Agent targets for export */
export type AgentTarget = 'claude' | 'copilot' | 'cursor' | 'codex' | 'opencode' | 'amp' | 'goose'

/** Module options */
export interface SkillsToolkitOptions {
  /** Enable skill discovery (default: true) */
  enabled?: boolean
  /** Additional skill paths to include (for local development) */
  additionalPaths?: string[]
}

/** Agent destination paths */
export const AGENT_DESTINATIONS: Record<AgentTarget, string> = {
  claude: '~/.claude/skills/',
  copilot: '.github/skills/',
  cursor: '.cursor/skills/',
  codex: '.codex/skills/',
  opencode: '~/.opencode/skills/',
  amp: '~/.amp/skills/',
  goose: '~/.config/goose/skills/',
}

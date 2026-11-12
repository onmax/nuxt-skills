import { homedir } from 'node:os'
import { describe, expect, it, vi } from 'vitest'

vi.mock('unagent/env', () => ({
  detectInstalledAgents: vi.fn(() => []),
  getAgentConfig: vi.fn(),
  getAgentIds: vi.fn(() => []),
  expandPath: (value: string) => value,
}))

const { detectInstalledAgents, getAgentConfig } = await import('unagent/env') as any
const { detectInstalledTargets, resolveAgentTargetConfig, validateTargets } = await import('../src/agents')

describe('detectInstalledTargets', () => {
  it('includes the running agent and skips agents without a skills dir', () => {
    vi.mocked(detectInstalledAgents).mockReturnValue([
      { id: 'codex', detected: 'config', config: {} },
      { id: 'cursor', detected: 'env', config: { skillsDir: 'rules' } },
      { id: 'claude-code', detected: 'both', config: { skillsDir: 'skills' } },
      { id: 'copilot', detected: 'both', config: {} },
      { id: 'windsurf', detected: 'config', config: { skillsDir: 'rules' } },
    ])

    const targets = detectInstalledTargets()
    expect(targets).toEqual(['claude-code', 'codex', 'cursor', 'windsurf'])
  })
})

describe('validateTargets', () => {
  it('returns valid targets and reports unknown/missing skillsDir targets', () => {
    vi.mocked(getAgentConfig).mockImplementation((target: string) => {
      if (target === 'claude-code')
        return { configDir: '~/.claude', skillsDir: 'skills' }
      if (target === 'codex')
        return { configDir: '~/.codex' }
      return undefined
    })

    const result = validateTargets(['claude-code', 'codex', 'universal', 'ghost'])
    expect(result.valid).toEqual(['claude-code', 'codex', 'universal'])
    expect(result.invalid).toEqual([
      { target: 'ghost', reason: 'unknown-target' },
    ])
  })
})

describe('resolveAgentTargetConfig', () => {
  it('sends agents that read .agents/skills there and remembers their old folder', () => {
    vi.mocked(getAgentConfig).mockImplementation((target: string) => {
      if (target === 'cursor')
        return { configDir: `${homedir()}/.cursor`, skillsDir: 'rules' }
      if (target === 'windsurf')
        return { configDir: `${homedir()}/.codeium/windsurf`, skillsDir: 'rules' }
      return undefined
    })

    expect(resolveAgentTargetConfig('cursor')).toMatchObject({
      projectSkillsDir: '.agents/skills',
      loadsSkillFolders: true,
      previousProjectSkillsDirs: ['.cursor/rules'],
    })
    expect(resolveAgentTargetConfig('windsurf')).toMatchObject({
      projectSkillsDir: '.codeium/windsurf/rules',
      loadsSkillFolders: false,
    })
    expect(resolveAgentTargetConfig('universal')).toMatchObject({
      projectSkillsDir: '.agents/skills',
      loadsSkillFolders: true,
    })
  })
})

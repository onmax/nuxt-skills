import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let mockIsAgent = false
let mockAgent: string | undefined
let mockCurrentTarget: string | undefined
let mockInstalledTargets: string[] = []
let mockSupportedTargets: string[] = []

const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
}

const mockConsola = {
  box: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  prompt: vi.fn(),
  log: vi.fn(),
  success: vi.fn(),
}

vi.mock('@nuxt/kit', () => ({
  useLogger: () => mockLogger,
}))

vi.mock('consola', () => ({
  createConsola: () => mockConsola,
}))

vi.mock('std-env', () => ({
  get isAgent() {
    return mockIsAgent
  },
  get agent() {
    return mockAgent
  },
}))

vi.mock('../src/core', () => ({
  detectCurrentTarget: () => mockCurrentTarget,
  detectInstalledTargets: () => mockInstalledTargets,
  getSupportedTargets: () => mockSupportedTargets,
  collectInstalledModulePackages: vi.fn(async () => []),
  deriveSkillName: vi.fn(async () => 'nuxt-test'),
  detectConflictingSkills: vi.fn(() => []),
  formatConflictWarning: vi.fn((value: string) => value),
  MANAGED_HINT_END: '<!-- skill-hub:end -->',
  MANAGED_HINT_START: '<!-- skill-hub:start -->',
  pathExists: vi.fn(async () => false),
  resolveExportRoot: vi.fn(async () => '/repo'),
}))

const { buildAIGuidance, runInstallWizard } = await import('../src/install')

const baseNuxt = {
  options: {
    rootDir: '/repo',
    modules: [],
  },
}

let originalStdoutTTY: PropertyDescriptor | undefined

function setTTY(value: boolean) {
  Object.defineProperty(process.stdout, 'isTTY', {
    configurable: true,
    value,
  })
}

describe('install wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    mockIsAgent = false
    mockAgent = undefined
    mockCurrentTarget = undefined
    mockInstalledTargets = []
    mockSupportedTargets = []
    originalStdoutTTY = Object.getOwnPropertyDescriptor(process.stdout, 'isTTY')
  })

  afterEach(() => {
    if (originalStdoutTTY) {
      Object.defineProperty(process.stdout, 'isTTY', originalStdoutTTY)
    }
    else {
      Reflect.deleteProperty(process.stdout, 'isTTY')
    }
  })

  it('keeps the interactive wizard for human TTY installs', async () => {
    setTTY(true)
    vi.stubEnv('CI', '')
    mockInstalledTargets = ['claude-code', 'codex']
    mockSupportedTargets = ['claude-code', 'codex']
    mockConsola.prompt
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce('skip')

    await runInstallWizard(baseNuxt as never)

    expect(mockConsola.prompt).toHaveBeenCalledTimes(2)
    expect(mockLogger.info).not.toHaveBeenCalledWith(expect.stringContaining('Install wizard skipped because nuxt-skill-hub was installed by an AI agent'))
  })

  it('prints codex guidance without prompting', async () => {
    setTTY(false)
    mockIsAgent = true
    mockAgent = 'codex'

    await runInstallWizard(baseNuxt as never)

    const logged = mockLogger.info.mock.calls.map(call => call[0]).join('\n')
    expect(mockConsola.prompt).not.toHaveBeenCalled()
    expect(logged).toContain('installed by an AI agent (codex)')
    expect(logged).toContain('targets: [\'codex\']')
    expect(logged).toContain('generationMode: \'prepare\'')
    expect(logged).toContain('Add this to AGENTS.md')
    expect(logged).toContain('npx nuxi prepare')
  })

  it('prints claude guidance without prompting', async () => {
    setTTY(false)
    mockIsAgent = true
    mockAgent = 'claude'

    await runInstallWizard(baseNuxt as never)

    const logged = mockLogger.info.mock.calls.map(call => call[0]).join('\n')
    expect(mockConsola.prompt).not.toHaveBeenCalled()
    expect(logged).toContain('targets: [\'claude-code\']')
    expect(logged).toContain('Add this to CLAUDE.md')
    expect(logged).toContain('generationMode: \'prepare\'')
  })

  it('omits targets for unmapped agents and explains explicit targets can be added later', async () => {
    setTTY(false)
    mockIsAgent = true
    mockAgent = 'auggie'

    await runInstallWizard(baseNuxt as never)

    const logged = mockLogger.info.mock.calls.map(call => call[0]).join('\n')
    expect(mockConsola.prompt).not.toHaveBeenCalled()
    expect(logged).not.toContain('targets:')
    expect(logged).toContain('add `skillHub.targets` to pin an agent target')
    expect(logged).toContain('generationMode: \'prepare\'')
  })

  it('prefers detectCurrentTarget over std-env agent mapping', () => {
    expect(buildAIGuidance('codex', 'claude').snippet).toContain('targets: [\'codex\']')
  })

  it('asks humans to select from supported agents when none are detected', async () => {
    setTTY(true)
    vi.stubEnv('CI', '')
    mockInstalledTargets = []
    mockSupportedTargets = ['claude-code', 'codex']
    mockConsola.prompt
      .mockResolvedValueOnce(['codex'])
      .mockResolvedValueOnce('skip')

    await runInstallWizard(baseNuxt as never)

    expect(mockConsola.prompt).toHaveBeenCalledWith('Select agents to generate skills for:', expect.objectContaining({
      type: 'multiselect',
      required: true,
    }))
    expect(mockConsola.prompt).toHaveBeenCalledTimes(2)
  })

  it('keeps the existing non-interactive skip for non-agent installs', async () => {
    setTTY(false)

    await runInstallWizard(baseNuxt as never)

    expect(mockConsola.prompt).not.toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledWith('Non-interactive environment detected, skipping install wizard.')
  })
})

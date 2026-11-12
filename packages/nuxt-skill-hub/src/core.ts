// Internal barrel: what module.ts and install.ts use from the generator.
export { detectCurrentTarget, detectInstalledTargets, getSupportedTargets, resolveAgentTargetConfig, validateTargets } from './agents'
export type { InvalidTarget, SkillHubTarget } from './agents'
export { BUNDLED_SKILL_NAMES, BUNDLED_SKILL_PACKAGES } from './bundled-skills'
export { generateSkillTree, publishSkill } from './generator'
export type { GenerateSkillTreeInput, SkillHubLogger } from './generator'
export { collectInstalledModulePackages, deriveSkillName, detectConflictingSkills, formatConflictWarning, isValidSkillName, MANAGED_HINT_END, MANAGED_HINT_START, pathExists, resolveExportRoot, resolveTargets } from './internal'
export { DEFAULT_SKILL_HUB_GENERATION_MODE, normalizeGenerationMode, normalizeRemoteOptions } from './types'
export type * from './types'

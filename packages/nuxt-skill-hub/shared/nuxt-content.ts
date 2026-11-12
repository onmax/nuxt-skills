import { loadSkillFilesFromDir } from './load-skill-files'

export async function loadNuxtRuleFilesFromDir(nuxtContentDir: string): Promise<Record<string, string>> {
  return loadSkillFilesFromDir(nuxtContentDir)
}

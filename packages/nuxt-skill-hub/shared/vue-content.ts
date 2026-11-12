import { loadSkillFilesFromDir } from './load-skill-files'

export async function loadVueSkillFilesFromDir(vueContentDir: string): Promise<Record<string, string>> {
  return loadSkillFilesFromDir(vueContentDir)
}

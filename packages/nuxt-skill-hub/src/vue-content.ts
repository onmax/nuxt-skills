import { loadVueSkillFilesFromDir } from '../shared/vue-content'
import { resolveBundledSkillDir } from './bundled-skills'

export function resolveVueContentDir(): string {
  return resolveBundledSkillDir('vue-best-practices')
}

export async function loadVueSkillFiles(): Promise<Record<string, string>> {
  return loadVueSkillFilesFromDir(resolveVueContentDir())
}

import { promises as fsp } from 'node:fs'
import { basename, join } from 'pathe'

export async function loadSkillFilesFromDir(dir: string, skip?: string[]): Promise<Record<string, string>> {
  const skipSet = skip ? new Set(skip) : undefined
  const entries: Array<[string, string]> = []

  for await (const globPath of fsp.glob('**/*', { cwd: dir })) {
    const relativePath = globPath.replaceAll('\\', '/')
    const absolutePath = join(dir, relativePath)
    if (
      (skipSet && skipSet.has(relativePath))
      || relativePath.split('/').some(segment => segment.startsWith('.'))
      || basename(relativePath).startsWith('_')
      || !(await fsp.lstat(absolutePath)).isFile()
    ) {
      continue
    }

    entries.push([relativePath, await fsp.readFile(absolutePath, 'utf8')])
  }

  entries.sort((a, b) => a[0].localeCompare(b[0]))

  return Object.fromEntries(entries)
}

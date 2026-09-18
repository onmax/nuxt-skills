#!/usr/bin/env node
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const exec = promisify(execFile)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configPath = join(root, 'ecosystem-skills.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
const destination = join(root, 'skills')
const tempRoot = await mkdtemp(join(process.env.TMPDIR || '/tmp', 'nuxt-skills-'))
const lock = { version: config.version, sources: {} }
const bumpPlugin = process.argv.includes('--bump-plugin')

try {
  for (const source of config.sources) {
    const checkout = join(tempRoot, source.name.replaceAll('/', '-'))
    await exec('git', ['clone', '--depth', '1', source.repository, checkout], { cwd: root })
    const { stdout: revision } = await exec('git', ['rev-parse', 'HEAD'], { cwd: checkout })
    lock.sources[source.name] = { repository: source.repository, revision: revision.trim() }

    for (const skillName of source.include) {
      const sourceDir = join(checkout, source.root, skillName)
      const skillFile = join(sourceDir, 'SKILL.md')
      if (!existsSync(skillFile))
        throw new Error(`${source.name}: missing ${source.root}/${skillName}/SKILL.md`)

      const targetDir = join(destination, skillName)
      await rm(targetDir, { recursive: true, force: true })
      await cp(sourceDir, targetDir, {
        recursive: true,
        filter: (path) => {
          const rel = relative(sourceDir, path)
          const base = rel.split('/').pop()
          if (rel.startsWith('scripts/') || base === 'AGENTS.md' || base === 'GENERATION.md' || base === 'SYNC.md' || base === 'README.md' || base.startsWith('LICENSE'))
            return false
          return true
        },
      })
      console.log(`bundled ${skillName} from ${source.name}`)
    }
  }
  await writeFile(join(root, 'ecosystem-skills.lock.json'), `${JSON.stringify(lock, null, 2)}\n`)
  let bundleChanged = true
  if (bumpPlugin) {
    const { stdout } = await exec('git', ['status', '--porcelain', '--', 'skills', 'ecosystem-skills.lock.json'], { cwd: root })
    bundleChanged = stdout.trim().length > 0
  }
  if (bumpPlugin && bundleChanged) {
    const marketplacePath = join(root, '.claude-plugin', 'marketplace.json')
    const marketplace = JSON.parse(await readFile(marketplacePath, 'utf8'))
    const current = marketplace.plugins?.[0]?.version
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(current || '')
    if (!match)
      throw new Error(`Invalid plugin version: ${current}`)
    const version = `${match[1]}.${match[2]}.${Number(match[3]) + 1}`
    for (const manifestPath of [
      join(root, '.claude-plugin', 'plugin.json'),
      marketplacePath,
      join(root, '.codex-plugin', 'plugin.json'),
    ]) {
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
      if (manifestPath === marketplacePath)
        manifest.plugins[0].version = version
      else
        manifest.version = version
      await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
    }
    console.log(`plugin version: ${current} -> ${version}`)
  }
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}

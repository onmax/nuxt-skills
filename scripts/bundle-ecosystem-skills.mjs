#!/usr/bin/env node
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import process from 'node:process'
import { createHash } from 'node:crypto'
import { promisify } from 'node:util'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const exec = promisify(execFile)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const configPath = join(root, 'ecosystem-skills.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
const destination = join(root, 'skills')
const tempRoot = await mkdtemp(join(process.env.TMPDIR || '/tmp', 'nuxt-skills-'))
const previousLock = await readJsonFile(join(root, 'ecosystem-skills.lock.json'))
const lock = { version: config.version, sources: {}, skills: {} }
const bumpPlugin = process.argv.includes('--bump-plugin')
const excludedSkillNames = new Set(config.exclude || [])
const configuredSkillNames = new Set(config.sources.flatMap(source => source.include.map(entry => typeof entry === 'string' ? entry : entry.name)))
const discoveredSources = (await discoverNuxtModuleSources()).map(source => ({
  ...source,
  include: source.include.filter((entry) => {
    const name = typeof entry === 'string' ? entry : entry.name
    return !configuredSkillNames.has(name) && !excludedSkillNames.has(name)
  }),
})).filter(source => source.include.length)
const sources = [...config.sources, ...discoveredSources]
const currentSkillNames = new Set(sources.flatMap(source => source.include.map(entry => typeof entry === 'string' ? entry : entry.name)))
try {
  for (const source of sources) {
    const checkout = join(tempRoot, source.name.replaceAll('/', '-'))
    await exec('git', ['clone', '--depth', '1', source.repository, checkout], { cwd: root })
    const { stdout: revision } = await exec('git', ['rev-parse', 'HEAD'], { cwd: checkout })
    lock.sources[source.name] = { repository: source.repository, revision: revision.trim() }

    for (const entry of source.include) {
      const skillName = typeof entry === 'string' ? entry : entry.name
      const sourcePath = typeof entry === 'string' ? entry : entry.path
      const sourceDir = join(checkout, source.root, sourcePath)
      const skillFile = join(sourceDir, 'SKILL.md')
      if (!existsSync(skillFile))
        throw new Error(`${source.name}: missing ${source.root}/${sourcePath}/SKILL.md`)

      const targetDir = join(destination, skillName)
      lock.skills[skillName] = source.name
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
      await normalizeMarkdown(targetDir)
      console.log(`bundled ${skillName} from ${source.name}`)
    }
  }
  for (const skillName of Object.keys(previousLock?.skills || {})) {
    if (!currentSkillNames.has(skillName))
      await rm(join(destination, skillName), { recursive: true, force: true })
  }
  await writeFile(join(root, 'ecosystem-skills.lock.json'), `${JSON.stringify(lock, null, 2)}\n`)
  await updateReadme(lock)
  let bundleChanged = true
  if (bumpPlugin) {
    const { stdout } = await exec('git', ['status', '--porcelain', '--', 'README.md', 'skills', 'ecosystem-skills.lock.json'], { cwd: root })
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

async function updateReadme(bundleLock) {
  const readmePath = join(root, 'README.md')
  const readme = await readFile(readmePath, 'utf8')
  const rows = []
  const bundled = new Map()
  for (const source of sources) {
    const revision = bundleLock.sources[source.name].revision
    for (const entry of source.include) {
      const skillName = typeof entry === 'string' ? entry : entry.name
      const sourcePath = typeof entry === 'string' ? entry.path || entry : entry.path
      const repository = source.repository.replace(/\.git$/, '')
      const sourceUrl = `${repository}/tree/${revision}/${source.root === '.' ? '' : `${source.root}/`}${sourcePath}`
      bundled.set(skillName, `[Bundled from ${source.name}](${sourceUrl})`)
    }
  }
  for (const entry of (await readdir(destination, { withFileTypes: true })).filter(entry => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const provenance = bundled.get(entry.name) || 'Manually written in this repository.'
    rows.push(`| [\`${entry.name}\`](skills/${entry.name}/) | ${provenance} |`)
  }
  const section = [
    '<!-- BEGIN GENERATED SKILL CATALOG -->',
    '## Skill catalog',
    '',
    'Every skill in the plugin is listed below with its provenance. The table is regenerated by `pnpm bundle:ecosystem`.',
    '',
    '| Skill | Provenance |',
    '| --- | --- |',
    ...rows,
    '',
    '<!-- END GENERATED SKILL CATALOG -->',
  ].join('\n')
  const pattern = /<!-- BEGIN GENERATED SKILL CATALOG -->[\s\S]*?<!-- END GENERATED SKILL CATALOG -->/
  const nextReadme = pattern.test(readme) ? readme.replace(pattern, section) : `${readme.trimEnd()}\n\n${section}\n`
  await writeFile(readmePath, nextReadme)
}

async function fetchText(url) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': 'nuxt-skills-bundler' }, signal: AbortSignal.timeout(30_000) })
    if (!response.ok)
      return null
    return await response.text()
  }
  catch (error) {
    throw new Error(`Unable to fetch ecosystem resource: ${url}`, { cause: error })
  }
}

async function fetchRequiredText(url) {
  const text = await fetchText(url)
  if (!text)
    throw new Error(`Unable to fetch required ecosystem resource: ${url}`)
  return text
}

async function readJsonFile(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  }
  catch {
    return null
  }
}

async function fetchJson(url) {
  const text = await fetchText(url)
  if (!text)
    return null
  try {
    return JSON.parse(text)
  }
  catch {
    return null
  }
}

function githubRepo(value) {
  if (typeof value !== 'string')
    return null
  const match = value.match(/github\.com[/:]([^/]+\/[^/#.]+?)(?:\.git|[#/]|$)/i)
  return match?.[1] || null
}

function moduleSlug(module) {
  const npm = module.npm
  if (typeof npm === 'string' && npm.startsWith('@nuxt/')) {
    const base = npm.split('/')[1]
    return base ? `nuxt-${base}` : null
  }
  if (typeof npm === 'string' && npm === '@nuxthub/core')
    return 'nuxthub'
  if (typeof module.name === 'string' && module.name)
    return module.name
  if (typeof npm !== 'string')
    return null
  const name = npm.split('/').pop()
  return name?.startsWith('nuxt-') ? name : name ? `nuxt-${name}` : null
}

async function findSkillPath(repo, ref, candidate) {
  const text = await fetchText(`https://raw.githubusercontent.com/${repo}/${ref}/${candidate}/SKILL.md`)
  return text && /^---\s*\n/.test(text) && /^description:/m.test(text) ? candidate : null
}

async function discoverNuxtModuleSources() {
  const html = await fetchRequiredText('https://nuxt.com/modules')
  const payloadPath = html?.match(/src="([^"]*modules\/_payload\.json[^"]*)"/)?.[1]
  if (!payloadPath)
    throw new Error('Nuxt module registry payload was not found')
  const payload = await fetchJson(`https://nuxt.com${payloadPath}`)
  if (!Array.isArray(payload))
    throw new Error('Nuxt module registry payload was invalid')

  const deref = value => typeof value === 'number' && value >= 0 && value < payload.length ? payload[value] : value
  const moduleIndex = payload.findIndex(value => value && typeof value === 'object' && !Array.isArray(value) && 'modules' in value)
  const moduleRefs = moduleIndex >= 0 ? deref(payload[moduleIndex].modules) : []
  const modules = (Array.isArray(moduleRefs) ? moduleRefs : []).map(ref => deref(ref)).map(module => {
    if (!module || typeof module !== 'object')
      return null
    return { ...module, name: deref(module.name), npm: deref(module.npm), github: deref(module.github) }
  }).filter(module => module && typeof module.github === 'string' && typeof module.npm === 'string')
  const sources = []
  const seen = new Set()
  const uniqueModules = modules.filter(module => {
    const repo = githubRepo(module.github)
    if (!repo || seen.has(repo))
      return false
    seen.add(repo)
    return true
  })
  for (const module of [{ name: 'better-auth', npm: '@nuxtjs/better-auth', github: 'https://github.com/nuxt-modules/better-auth' }]) {
    const repo = githubRepo(module.github)
    if (repo && !seen.has(repo)) {
      seen.add(repo)
      uniqueModules.push(module)
    }
  }
  const resolveModule = async (module) => {
    const repo = githubRepo(module.github)
    if (!repo)
      return null
    const refs = ['main', 'master']
    let found = []
    let foundRoot = '.'
    for (const ref of refs) {
      const pkg = await fetchJson(`https://raw.githubusercontent.com/${repo}/${ref}/package.json`)
      const declarations = pkg?.agentskills?.skills
      if (Array.isArray(declarations)) {
        const candidates = declarations
          .filter(skill => typeof skill?.name === 'string' && typeof skill?.path === 'string')
        for (const skill of candidates) {
          if (await findSkillPath(repo, ref, skill.path))
            found.push({ name: skill.name, path: skill.path })
        }
        if (found.length)
          break
      }
    }
    if (!found.length) {
      const indexRoots = ['.well-known/skills', 'docs/public/.well-known/skills', 'public/.well-known/skills']
      for (const ref of refs) {
        for (const indexRoot of indexRoots) {
          const index = await fetchJson(`https://raw.githubusercontent.com/${repo}/${ref}/${indexRoot}/index.json`)
          const entries = Array.isArray(index?.skills) ? index.skills : []
          const skills = entries.filter(skill => typeof skill?.name === 'string' && Array.isArray(skill.files) && skill.files.includes('SKILL.md'))
          if (skills.length) {
            const available = []
            for (const skill of skills) {
              if (await findSkillPath(repo, ref, `${indexRoot}/${skill.name}`))
                available.push({ name: skill.name, path: `${indexRoot}/${skill.name}` })
            }
            if (available.length) {
              found = available
              foundRoot = '.'
              break
            }
          }
        }
        if (found.length)
          break
      }
    }
    if (!found.length) {
      const indexRoots = ['.well-known/agent-skills', 'docs/public/.well-known/agent-skills', 'public/.well-known/agent-skills']
      for (const ref of refs) {
        for (const indexRoot of indexRoots) {
          const index = await fetchJson(`https://raw.githubusercontent.com/${repo}/${ref}/${indexRoot}/index.json`)
          const entries = Array.isArray(index?.skills) ? index.skills : []
          const available = []
          for (const skill of entries) {
            if (skill?.type !== 'skill-md' || typeof skill.name !== 'string' || typeof skill.url !== 'string' || typeof skill.digest !== 'string')
              continue
            const digest = skill.digest.replace(/^sha256:/, '')
            if (!/^[a-f0-9]{64}$/i.test(digest))
              continue
            const indexUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${indexRoot}/index.json`
            const skillUrl = new URL(skill.url, indexUrl).toString()
            const content = await fetchText(skillUrl)
            if (!content || createHash('sha256').update(content).digest('hex') !== digest)
              continue
            const prefix = `https://raw.githubusercontent.com/${repo}/${ref}/`
            if (!skillUrl.startsWith(prefix))
              continue
            const skillFilePath = decodeURIComponent(skillUrl.slice(prefix.length))
            available.push({ name: skill.name, path: skillFilePath.slice(0, skillFilePath.lastIndexOf('/')) })
          }
          if (available.length) {
            found = available
            foundRoot = '.'
            break
          }
        }
        if (found.length)
          break
      }
    }
    if (!found.length) {
      const slug = moduleSlug(module)
      for (const ref of refs) {
        for (const path of [`skills/${slug}`, `docs/skills/${slug}`, `.claude/skills/${slug}`, `.github/skills/${slug}`, `docs/public/.well-known/skills/${slug}`]) {
          if (slug && await findSkillPath(repo, ref, path)) {
            found.push({ name: slug, path })
            break
          }
        }
        if (found.length)
          break
      }
    }
    if (found.length) {
      const source = { name: `nuxt-modules/${repo}`, repository: `https://github.com/${repo}.git`, root: foundRoot, include: found }
      return source
    }
    return null
  }
  for (let index = 0; index < uniqueModules.length; index += 8) {
    const batch = await Promise.all(uniqueModules.slice(index, index + 8).map(resolveModule))
    sources.push(...batch.filter(Boolean))
  }
  console.log(`discovered ${sources.length} Nuxt module skill source(s) from ${modules.length} registered module(s)`)
  return sources
}

async function normalizeMarkdown(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      await normalizeMarkdown(path)
    }
    else if (entry.name.endsWith('.md')) {
      const content = await readFile(path, 'utf8')
      let normalized = content.replace(/[ \t]+$/gm, '').replace(/\n+$/, '\n')
      if (entry.name === 'SKILL.md' && normalized.startsWith('---\n')) {
        normalized = normalized.replace(/^(version|author):.*\n/gm, '')
      }
      await writeFile(path, normalized)
    }
  }
}

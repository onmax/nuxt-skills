import type { PackageAgentSkills, ResolvedSkill, SkillsManifest } from '../types'
import { existsSync, promises as fsp } from 'node:fs'
import { homedir } from 'node:os'
import matter from 'gray-matter'
import { join, resolve } from 'pathe'
import { readPackageJSON } from 'pkg-types'

/** Parse SKILL.md frontmatter */
export async function parseSkillMd(skillMdPath: string): Promise<{ name: string, description: string, license?: string }> {
  const content = await fsp.readFile(skillMdPath, 'utf-8')
  const { data } = matter(content)
  if (!data.name || !data.description) {
    throw new Error(`SKILL.md missing required frontmatter (name, description): ${skillMdPath}`)
  }
  return { name: data.name, description: data.description, license: data.license }
}

/** Find reference files in skill directory */
export async function findReferences(skillDir: string): Promise<string[]> {
  const refsDir = join(skillDir, 'references')
  if (!existsSync(refsDir))
    return []
  const files = await fsp.readdir(refsDir)
  return files.filter(f => f.endsWith('.md')).map(f => `references/${f}`)
}

/** Scan node_modules for packages with agentskills field */
export async function scanForSkillPackages(modulesDir: string): Promise<Array<{ pkg: string, skills: PackageAgentSkills, pkgDir: string }>> {
  const results: Array<{ pkg: string, skills: PackageAgentSkills, pkgDir: string }> = []
  if (!existsSync(modulesDir))
    return results

  const entries = await fsp.readdir(modulesDir, { withFileTypes: true })
  for (const entry of entries) {
    if (!entry.isDirectory())
      continue

    // Handle scoped packages (@org/pkg)
    if (entry.name.startsWith('@')) {
      const scopeDir = join(modulesDir, entry.name)
      const scopedEntries = await fsp.readdir(scopeDir, { withFileTypes: true }).catch(() => [])
      for (const scopedEntry of scopedEntries) {
        if (!scopedEntry.isDirectory())
          continue
        const pkgDir = join(scopeDir, scopedEntry.name)
        await checkPackage(pkgDir, `${entry.name}/${scopedEntry.name}`, results)
      }
    }
    else {
      const pkgDir = join(modulesDir, entry.name)
      await checkPackage(pkgDir, entry.name, results)
    }
  }
  return results
}

async function checkPackage(pkgDir: string, pkgName: string, results: Array<{ pkg: string, skills: PackageAgentSkills, pkgDir: string }>) {
  try {
    const pkg = await readPackageJSON(pkgDir)
    if (pkg.agentskills && Array.isArray((pkg.agentskills as PackageAgentSkills).skills)) {
      results.push({ pkg: pkg.name || pkgName, skills: pkg.agentskills as PackageAgentSkills, pkgDir })
    }
  }
  catch { /* ignore packages without package.json */ }
}

/** Copy skill directory to destination */
export async function copySkillDir(srcDir: string, destDir: string): Promise<void> {
  await fsp.mkdir(destDir, { recursive: true })
  const entries = await fsp.readdir(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)
    if (entry.isDirectory()) {
      await copySkillDir(srcPath, destPath)
    }
    else {
      await fsp.copyFile(srcPath, destPath)
    }
  }
}

/** Resolve skills from packages and addSkill() calls */
export async function resolveSkills(
  packageSkills: Array<{ pkg: string, skills: PackageAgentSkills, pkgDir: string }>,
  addedSkills: Array<{ dir: string, name?: string, source: string }>,
): Promise<ResolvedSkill[]> {
  const resolved: ResolvedSkill[] = []
  const seen = new Set<string>()

  // Process addSkill() calls first (higher priority)
  for (const added of addedSkills) {
    const skillMdPath = join(added.dir, 'SKILL.md')
    if (!existsSync(skillMdPath)) {
      console.warn(`[nuxt-skills] SKILL.md not found: ${skillMdPath}`)
      continue
    }
    const meta = await parseSkillMd(skillMdPath)
    const name = added.name || meta.name
    if (seen.has(name)) {
      console.warn(`[nuxt-skills] Duplicate skill "${name}" from ${added.source}, skipping`)
      continue
    }
    seen.add(name)
    resolved.push({ name, description: meta.description, license: meta.license, source: added.source, dir: added.dir, references: await findReferences(added.dir) })
  }

  // Process package.json agentskills
  for (const { pkg, skills, pkgDir } of packageSkills) {
    for (const entry of skills.skills) {
      if (seen.has(entry.name)) {
        console.warn(`[nuxt-skills] Duplicate skill "${entry.name}" from ${pkg}, skipping`)
        continue
      }
      const skillDir = resolve(pkgDir, entry.path)
      const skillMdPath = join(skillDir, 'SKILL.md')
      if (!existsSync(skillMdPath)) {
        console.warn(`[nuxt-skills] SKILL.md not found: ${skillMdPath}`)
        continue
      }
      const meta = await parseSkillMd(skillMdPath)
      seen.add(entry.name)
      resolved.push({ name: entry.name, description: meta.description, license: meta.license, source: pkg, dir: skillDir, references: await findReferences(skillDir) })
    }
  }

  return resolved
}

/** Generate manifest.json */
export function generateManifest(skills: ResolvedSkill[]): SkillsManifest {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    skills: skills.map(s => ({
      name: s.name,
      description: s.description,
      source: s.source,
      path: s.name, // relative path in .nuxt/skills/
      license: s.license,
      references: s.references,
    })),
  }
}

/** Expand ~ to home directory */
export function expandHome(path: string): string {
  return path.startsWith('~') ? path.replace('~', homedir()) : path
}

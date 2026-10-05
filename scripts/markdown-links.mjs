import { existsSync, statSync } from 'node:fs'
import { cp, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'

const fencePattern = /^(`{3,}|~{3,})[^`~\n]*\n[\s\S]*?^\1[^\S\n]*$/gm
const linkPattern = /(!?)\[([^\]]*)\]\(([^)\s]+)(\s[^)]*)?\)/g

// Calls `replace` for every relative markdown link outside code fences.
// Returning a string replaces the whole link; returning null keeps it.
export function mapRelativeLinks(content, replace) {
  let result = ''
  let last = 0
  for (const fence of content.matchAll(fencePattern)) {
    result += mapSegment(content.slice(last, fence.index), replace) + fence[0]
    last = fence.index + fence[0].length
  }
  return result + mapSegment(content.slice(last), replace)
}

function mapSegment(segment, replace) {
  return segment.replace(linkPattern, (match, bang, text, href, title = '') => {
    const index = href.search(/[?#]/)
    const rawPath = index === -1 ? href : href.slice(0, index)
    if (!rawPath || /^(?:[a-z][a-z\d+.-]*:|[/<])/i.test(rawPath))
      return match
    let path
    try {
      path = decodeURIComponent(rawPath)
    }
    catch {
      path = rawPath
    }
    const suffix = index === -1 ? '' : href.slice(index)
    return replace({ image: bang === '!', text, href, path, suffix, title }) ?? match
  })
}

export function isInside(parent, child) {
  const rel = relative(parent, child)
  return rel !== '..' && !rel.startsWith('../') && !isAbsolute(rel)
}

export async function listMarkdownFiles(dir) {
  const files = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory())
      files.push(...await listMarkdownFiles(path))
    else if (entry.name.endsWith('.md'))
      files.push(path)
  }
  return files
}

// Upstream links are written for the upstream layout. Keep links that resolve inside the skill
// (bundling files the copy filter skipped), point other existing files at the pinned upstream
// revision, and unlink targets that are missing upstream too.
export async function bundleRelativeLinks({ sourceDir, targetDir, checkout, upstreamUrl, revision }) {
  const queue = await listMarkdownFiles(targetDir)
  for (let index = 0; index < queue.length; index++) {
    const file = queue[index]
    const sourceFile = join(sourceDir, relative(targetDir, file))
    const missing = new Map()
    const content = mapRelativeLinks(await readFile(file, 'utf8'), (link) => {
      const target = resolve(dirname(sourceFile), link.path)
      if (!existsSync(target)) {
        console.warn(`${basename(targetDir)}/${relative(targetDir, file)}: unlinking ${link.href}, missing upstream`)
        return link.text
      }
      if (isInside(sourceDir, target)) {
        const bundled = join(targetDir, relative(sourceDir, target))
        if (!existsSync(bundled))
          missing.set(target, bundled)
        return null
      }
      if (!isInside(checkout, target)) {
        console.warn(`${basename(targetDir)}/${relative(targetDir, file)}: unlinking ${link.href}, outside the upstream repository`)
        return link.text
      }
      const kind = statSync(target).isDirectory() ? 'tree' : 'blob'
      return `${link.image ? '!' : ''}[${link.text}](${upstreamUrl}/${kind}/${revision}/${relative(checkout, target)}${link.suffix}${link.title})`
    })
    await writeFile(file, content)
    for (const [from, to] of missing) {
      if (existsSync(to))
        continue
      await cp(from, to, { recursive: true })
      if (statSync(to).isDirectory())
        queue.push(...await listMarkdownFiles(to))
      else if (to.endsWith('.md'))
        queue.push(to)
    }
  }
}

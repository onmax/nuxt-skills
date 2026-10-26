// Published registry documented at https://github.com/nuxt/modules#using-cdn.
const registryUrl = 'https://cdn.jsdelivr.net/npm/@nuxt/modules@latest/modules.json'

export async function fetchNuxtModules(fetchText) {
  const text = await fetchText(registryUrl)
  if (!text)
    throw new Error(`Unable to fetch Nuxt module registry: ${registryUrl}`)

  let modules
  try {
    modules = JSON.parse(text)
  }
  catch (error) {
    throw new Error(`Invalid Nuxt module registry JSON: ${registryUrl}`, { cause: error })
  }

  // An empty or partial registry would remove previously bundled module skills.
  if (!Array.isArray(modules) || !modules.length || !modules.every(module =>
    module && typeof module.name === 'string' && module.name
    && typeof module.npm === 'string' && module.npm
    && typeof module.github === 'string' && /^https:\/\/github\.com\/[^/]+\/[^/#]+/.test(module.github),
  )) {
    throw new Error(`Invalid or empty Nuxt module registry: ${registryUrl}`)
  }
  return modules
}

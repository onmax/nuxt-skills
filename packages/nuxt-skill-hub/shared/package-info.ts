import packageJson from '../package.json' with { type: 'json' }

interface PackageMetadata {
  name?: string
  version?: string
  description?: string
}

const metadata = packageJson as PackageMetadata

export const PACKAGE_NAME = metadata.name || 'nuxt-skill-hub'
export const PACKAGE_VERSION = metadata.version || '0.0.0'
export const PACKAGE_DESCRIPTION = metadata.description || ''

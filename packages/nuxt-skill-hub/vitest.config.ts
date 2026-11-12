import { defineVitestConfig } from '@nuxt/test-utils/config'
import { configDefaults } from 'vitest/config'

export default defineVitestConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    exclude: [...configDefaults.exclude, '.claude/worktrees/**'],
  },
})

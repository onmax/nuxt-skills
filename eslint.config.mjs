import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  yaml: true,
  jsonc: true,
  typescript: { tsconfigPath: false },
  // Disable code block linting in markdown - examples contain pseudo/partial code
  markdown: false,
}, {
  // Scripts can use process global
  files: ['**/scripts/**/*.ts'],
  rules: {
    'node/prefer-global/process': 'off',
  },
})

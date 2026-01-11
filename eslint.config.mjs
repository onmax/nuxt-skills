import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  yaml: true,
  jsonc: true,
  typescript: { tsconfigPath: false },
  // Disable code block linting in markdown - examples contain pseudo/partial code
  markdown: false,
}, {
  // Scripts and CLI can use process global
  files: ['**/scripts/**/*.ts', '**/cli/**/*.ts'],
  rules: {
    'node/prefer-global/process': 'off',
  },
})

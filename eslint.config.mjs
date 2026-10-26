import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  // Preserve the existing wrapping style when upgrading the shared config.
  rules: { 'antfu/reasonable-newline': 'off' },
  yaml: true,
  jsonc: true,
  typescript: { tsconfigPath: false },
  // Disable code block linting in markdown - examples contain pseudo/partial code
  markdown: false,
}, {
  // Bundled skills keep their upstream formatting.
  files: ['skills/**'],
  rules: {
    'format/prettier': 'off',
    'yaml/quotes': 'off',
    'yaml/plain-scalar': 'off',
  },
}, {
  // Scripts can use process global
  files: ['**/scripts/**/*.ts'],
  rules: {
    'node/prefer-global/process': 'off',
  },
})

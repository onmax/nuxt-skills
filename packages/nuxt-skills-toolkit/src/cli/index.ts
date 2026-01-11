import { defineCommand } from 'citty'
import exportCmd from './commands/export'
import list from './commands/list'

export const main = defineCommand({
  meta: {
    name: 'nuxt-skills',
    description: 'Manage bundled skills from Nuxt modules',
  },
  subCommands: {
    list,
    export: exportCmd,
  },
})

import { defineDatabase } from 'vite-hub/database'

// The CMS preset adds its editor sessions table to this Database. With this file, a Cloudflare build ships the
// migrations in ./default/migrations next to the Worker, so `vitehub deploy` applies them to D1.
export default defineDatabase({ schema: {} })

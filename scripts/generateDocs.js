import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateReferenceDocs } from '@tanstack/config/typedoc'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('@tanstack/config/typedoc').Package[]} */
const packages = [
  {
    name: '@reduxjs/vue-redux',
    entryPoints: [resolve(__dirname, '../packages/vue-redux/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/vue-redux/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/reference'),
  },
]

await generateReferenceDocs({ packages })

process.exit(0)

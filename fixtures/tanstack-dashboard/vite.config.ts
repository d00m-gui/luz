import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { luzVite } from '@d00m-gui/luz/vite'
import { config as luzConfig } from './luz.config'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),

    luzVite({
      ...luzConfig,
      path: fileURLToPath(new URL('src/luz.css', import.meta.url)),
      output: 'virtual',
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config

// @ts-check
import { defineConfig } from 'astro/config';
import { luzAstro } from '../../src/astro'
import { config } from './luz.config';

// https://astro.build/config
export default defineConfig({
  integrations: [
    luzAstro(config)
  ]
});

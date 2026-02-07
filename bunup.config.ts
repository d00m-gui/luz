import { defineConfig } from 'bunup';
import { exports, unused, injectStyles } from 'bunup/plugins';

export default defineConfig({
	unused: true,
	exports: true,
	css: {
    inject: true,
  },
	entry: 'src/index.ts',
	format: ['esm'],
	target: "browser",
	plugins: [exports(), unused(), injectStyles()],
	minify: true,
});
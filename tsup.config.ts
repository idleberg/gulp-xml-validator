import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	external: ['@xmldom/xmldom', 'kleur', 'external:plugin-error'],
	format: 'esm',
	minify: true,
	outDir: 'dist',
	platform: 'node',
	target: 'esnext',
	treeshake: 'recommended',
});

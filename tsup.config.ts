import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
	clean: true,
	dts: true,
	entry: ['src/index.ts'],
	external: ['@xmldom/xmldom', 'kleur', 'external:plugin-error'],
	format: 'esm',
	minify: true,
	outDir: 'dist',
	platform: 'node',
	treeshake: 'recommended',
});

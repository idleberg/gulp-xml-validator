import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/*.spec.ts', 'e2e/*.spec.ts'],
		coverage: {
			include: ['src/*.ts'],
		},
	},
});

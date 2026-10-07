import { resolve } from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import gulp from 'gulp';
import type PluginError from 'plugin-error';
import type Vinyl from 'vinyl';
import { describe, expect, it } from 'vitest';
import { xmlValidator } from '../src/index.ts';

function run(fileName: string, options?: { buffer: boolean }): Promise<{ error?: PluginError; files: Vinyl[] }> {
	return new Promise((done) => {
		const files: Vinyl[] = [];

		gulp
			.src(resolve(import.meta.dirname, 'fixtures', fileName), options)
			.pipe(xmlValidator())
			.on('data', (file: Vinyl) => files.push(file))
			.once('error', (error: PluginError) => done({ error, files }))
			.once('end', () => done({ files }));
	});
}

async function errorMessage(fileName: string): Promise<string> {
	const { error } = await run(fileName);

	expect(error).toBeDefined();

	return stripVTControlCharacters(error?.message ?? '');
}

describe('gulp integration', () => {
	it('should emit error on streamed file', async () => {
		const { error } = await run('valid.xml', { buffer: false });

		expect(error?.message).toBe('Streaming not supported');
	});

	it('should pass on valid xml', async () => {
		const { error, files } = await run('valid.xml');

		expect(error).toBeUndefined();
		expect(files).toHaveLength(1);
	});

	it('should fail on mismatching tags', async () => {
		expect(await errorMessage('mismatching_tags.xml')).toContain(
			'mismatching_tags.xml: <fatalError> Opening and ending tag mismatch',
		);
	});

	it('should fail on missing close tags', async () => {
		expect(await errorMessage('missing_close_tag.xml')).toContain('missing_close_tag.xml: <fatalError>');
	});

	it('should fail on missing quote', async () => {
		expect(await errorMessage('missing_quote.xml')).toContain(
			`missing_quote.xml: <error> element parse error: Error: attribute value no end '"' match`,
		);
	});

	it('should fail on invalid tag', async () => {
		expect(await errorMessage('invalid_tag.xml')).toContain(
			'invalid_tag.xml: <error> element parse error: Error: invalid tagName:1',
		);
	});
});

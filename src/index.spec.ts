import { Readable } from 'node:stream';
import type PluginError from 'plugin-error';
import Vinyl from 'vinyl';
import { describe, expect, it } from 'vitest';
import { xmlValidator } from './index.ts';

describe('xmlValidator', () => {
	describe('file handling', () => {
		it('should pass through null files', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: null,
				});

				const stream = xmlValidator();

				stream.once('data', (outputFile) => {
					expect(outputFile).toBe(file);
					expect(outputFile.contents).toBeNull();
					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should emit error for streaming files', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Readable.from(['<xml></xml>']),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					expect(error.message).toBe('Streaming not supported');
					expect(error.plugin).toBe('gulp-xml-validator');

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should emit error for empty file contents', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Buffer.from(''),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					// Empty buffer triggers XML parsing which results in "missing root element" error
					expect(error.message).toContain('test.xml');
					expect(error.plugin).toBe('gulp-xml-validator');

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});
	});

	describe('XML validation', () => {
		it('should pass valid XML', () => {
			return new Promise<void>((resolve, reject) => {
				const file = new Vinyl({
					path: 'valid.xml',
					contents: Buffer.from('<?xml version="1.0"?><root></root>'),
				});

				const stream = xmlValidator();

				stream.once('data', (outputFile) => {
					expect(outputFile).toBe(file);

					resolve();
				});

				stream.once('error', (error) => {
					reject(new Error(`Should not emit error: ${error.message}`));
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should emit error for mismatching tags', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'mismatching.xml',
					contents: Buffer.from('<?xml version="1.0"?><open></close>'),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					expect(error.message).toContain('mismatching.xml');
					expect(error.message).toContain('fatalError');
					expect(error.message).toContain('Opening and ending tag mismatch');
					expect(error.plugin).toBe('gulp-xml-validator');
					expect(error.fileName).toBe(file.path);

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should emit error for missing closing tag', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'unclosed.xml',
					contents: Buffer.from('<?xml version="1.0"?><open><inner></open>'),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					expect(error.message).toContain('unclosed.xml');
					expect(error.message).toContain('fatalError');
					expect(error.plugin).toBe('gulp-xml-validator');

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should emit error for missing quote in attribute', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'quote.xml',
					contents: Buffer.from('<?xml version="1.0"?><tag attribute="value></tag>'),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					expect(error.message).toContain('quote.xml');
					expect(error.message).toContain('error');
					expect(error.message).toContain('attribute value no end');
					expect(error.plugin).toBe('gulp-xml-validator');

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should emit error for invalid tag name', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'invalid.xml',
					contents: Buffer.from('<?xml version="1.0"?><123></123>'),
				});

				const stream = xmlValidator();
				stream.once('error', (error: PluginError) => {
					expect(error.message).toContain('invalid.xml');
					expect(error.message).toContain('error');
					expect(error.message).toContain('invalid tagName');
					expect(error.plugin).toBe('gulp-xml-validator');

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should handle multiple XML errors', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'multiple-errors.xml',
					contents: Buffer.from('<?xml version="1.0"?><tag attr="missing></tag>'),
				});

				const stream = xmlValidator();
				stream.once('error', (error) => {
					expect(error.message).toContain('multiple-errors.xml');

					// Should contain multiple error entries
					const errorLines = error.message.split('\n').filter((line: string) => line.includes('multiple-errors.xml'));
					expect(errorLines.length).toBeGreaterThan(1);

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});
	});

	describe('options', () => {
		it('should accept custom mimeType', () => {
			return new Promise<void>((resolve, reject) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Buffer.from('<?xml version="1.0"?><root></root>'),
				});

				const stream = xmlValidator({ mimeType: 'application/xml' });

				stream.once('data', (outputFile) => {
					expect(outputFile).toBe(file);

					resolve();
				});

				stream.once('error', (error) => {
					reject(new Error(`Should not emit error: ${error.message}`));
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should use default mimeType when not specified', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Buffer.from('<?xml version="1.0"?><root></root>'),
				});

				const stream = xmlValidator();

				stream.once('data', (outputFile) => {
					expect(outputFile).toBe(file);

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});
	});

	describe('error formatting', () => {
		it('should include filename in error message', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Buffer.from('<?xml version="1.0"?><open></close>'),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					// Check that filename is included in the error message
					expect(error.message).toContain('test.xml');

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should not show stack trace', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Buffer.from('<?xml version="1.0"?><open></close>'),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					expect(error.showStack).toBe(false);

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});

		it('should include error level in message', () => {
			return new Promise<void>((resolve) => {
				const file = new Vinyl({
					path: 'test.xml',
					contents: Buffer.from('<?xml version="1.0"?><open></close>'),
				});

				const stream = xmlValidator();

				stream.once('error', (error: PluginError) => {
					expect(error.message).toMatch(/<(error|warning|fatalError)>/);

					resolve();
				});

				stream.write(file);
				stream.end();
			});
		});
	});

	describe('stream behavior', () => {
		it('should process multiple files', () => {
			return new Promise<void>((resolve) => {
				const files = [
					new Vinyl({
						path: 'file1.xml',
						contents: Buffer.from('<?xml version="1.0"?><root></root>'),
					}),

					new Vinyl({
						path: 'file2.xml',
						contents: Buffer.from('<?xml version="1.0"?><data></data>'),
					}),
				];

				const stream = xmlValidator();
				const outputFiles: Vinyl[] = [];

				stream.on('data', (file) => {
					outputFiles.push(file);
				});

				stream.on('end', () => {
					expect(outputFiles).toHaveLength(2);
					expect(outputFiles[0]?.path).toBe('file1.xml');
					expect(outputFiles[1]?.path).toBe('file2.xml');

					resolve();
				});

				for (const file of files) {
					stream.write(file);
				}
				stream.end();
			});
		});

		it('should handle mixed valid and invalid files', () => {
			return new Promise<void>((resolve) => {
				const files = [
					new Vinyl({
						path: 'valid.xml',
						contents: Buffer.from('<?xml version="1.0"?><root></root>'),
					}),

					new Vinyl({
						path: 'invalid.xml',
						contents: Buffer.from('<?xml version="1.0"?><open></close>'),
					}),
				];

				const stream = xmlValidator();
				const outputFiles: Vinyl[] = [];

				let errorCount = 0;
				let filesProcessed = 0;

				stream.on('data', (file) => {
					outputFiles.push(file);
					filesProcessed++;

					if (filesProcessed + errorCount === files.length) {
						expect(outputFiles).toHaveLength(1);
						expect(outputFiles[0]?.path).toBe('valid.xml');
						expect(errorCount).toBe(1);

						resolve();
					}
				});

				stream.on('error', () => {
					errorCount++;

					if (filesProcessed + errorCount === files.length) {
						expect(outputFiles).toHaveLength(1);
						expect(outputFiles[0]?.path).toBe('valid.xml');
						expect(errorCount).toBe(1);

						resolve();
					}
				});

				for (const file of files) {
					stream.write(file);
				}
				stream.end();
			});
		});
	});
});

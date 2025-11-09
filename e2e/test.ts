import { resolve } from 'node:path';
import gulp from 'gulp';
import type PluginError from 'plugin-error';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { xmlValidator } from '../src/index.ts';

function resolveFixture(fileName: string): string {
	return resolve(process.cwd(), `e2e/fixtures/${fileName}`);
}

test('should emit error on streamed file', async () => {
	const fixture = resolveFixture('valid.xml');

	const { message }: Error = await new Promise((resolve) => {
		gulp
			.src(fixture, { buffer: false })
			.pipe(xmlValidator())
			.once('error', (error: PluginError) => resolve(error));
	});

	assert.is(message, 'Streaming not supported');
});

test('pass on valid xml', async () => {
	const fixture = resolveFixture('valid.xml');

	assert.not.throws(
		async () =>
			await new Promise(() => {
				gulp.src(fixture).pipe(xmlValidator());
			}),
	);
});

test('fail on mismatching tags', async () => {
	const fixture = resolveFixture('mismatching_tags.xml');

	const { message }: Error = await new Promise((resolve) => {
		gulp
			.src(fixture)
			.pipe(xmlValidator())
			.once('error', (error: PluginError) => resolve(error));
	});

	assert.ok(message.includes('\x1B[4mmismatching_tags.xml\x1B[24m: <fatalError> Opening and ending tag mismatch'));
});

test('fail on missing close tags', async () => {
	const fixture = resolveFixture('missing_close_tag.xml');

	const { message }: Error = await new Promise((resolve) => {
		gulp
			.src(fixture)
			.pipe(xmlValidator())
			.once('error', (error: PluginError) => resolve(error));
	});

	assert.ok(message.includes('\x1B[4mmissing_close_tag.xml\x1B[24m: <fatalError>'));
});

test('fail on missing quote', async () => {
	const fixture = resolveFixture('missing_quote.xml');

	const { message }: Error = await new Promise((resolve) => {
		gulp
			.src(fixture)
			.pipe(xmlValidator())
			.once('error', (error: PluginError) => resolve(error));
	});

	assert.ok(
		message.includes(
			`\x1B[4mmissing_quote.xml\x1B[24m: <error> element parse error: Error: attribute value no end '"' match`,
		),
	);
});

test('fail on invalid tag', async () => {
	const fixture = resolveFixture('invalid_tag.xml');

	const { message }: Error = await new Promise((resolve) => {
		gulp
			.src(fixture)
			.pipe(xmlValidator())
			.once('error', (error: PluginError) => resolve(error));
	});

	assert.ok(message.includes('\x1B[4minvalid_tag.xml\x1B[24m: <error> element parse error: Error: invalid tagName:1'));
});

test.run();

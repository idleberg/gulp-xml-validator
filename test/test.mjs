
// const meta = require('../package.json');
// const xmlValidator = require('..');

// const { it, describe } = require('mocha');
// const assert = require('stream-assert');
// const gulp = require('gulp');
// const path = require('path');

// require('should');

import { xmlValidator } from '../index.mjs';

import { resolve } from 'node:path';
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import gulp from 'gulp';

// const fixtures = glob => resolve(__dirname, 'fixtures', glob);

test('should emit error on streamed file', async () => {
	const fixture = resolve(process.cwd(), 'test/fixtures/valid.xml');

	const { message } = await new Promise(resolve => {
		gulp.src(fixture, { buffer: false })
			.pipe(xmlValidator())
			.once('error', error => resolve(error));
	});

	assert.is(message, 'Streaming not supported');
});

test('pass on valid xml', async () => {
	const fixture = resolve(process.cwd(), 'test/fixtures/valid.xml');

	assert.not.throws(async() => await new Promise(() => {
			gulp.src(fixture)
				.pipe(xmlValidator());
		}));
});

test('fail on mismatching tags', async () => {
	const fixture = resolve(process.cwd(), 'test/fixtures/mismatching_tags.xml');

	const { message } = await new Promise((resolve) => {
			gulp.src(fixture)
				.pipe(xmlValidator())
				.once('error', error => resolve(error));
		});

		assert.ok(message.includes('\x1B[4mmismatching_tags.xml\x1B[24m: <warning> unclosed xml attribute'));
});

test('fail on missing close tags', async () => {
	const fixture = resolve(process.cwd(), 'test/fixtures/missing_close_tag.xml');

	const { message } = await new Promise((resolve) => {
			gulp.src(fixture)
				.pipe(xmlValidator())
				.once('error', error => resolve(error));
		});

		assert.ok(message.includes('\x1B[4mmissing_close_tag.xml\x1B[24m: <warning> unclosed xml attribute'));
});

test('fail on missing quote', async () => {
	const fixture = resolve(process.cwd(), 'test/fixtures/missing_quote.xml');

	const { message } = await new Promise((resolve) => {
			gulp.src(fixture)
				.pipe(xmlValidator())
				.once('error', error => resolve(error));
		});

		assert.ok(message.includes(`\x1B[4mmissing_quote.xml\x1B[24m: <error> [xmldom error]\telement parse error: Error: attribute value no end '"' match`));
});

test('fail on invalid tag', async () => {
	const fixture = resolve(process.cwd(), 'test/fixtures/invalid_tag.xml');

	const { message } = await new Promise((resolve) => {
			gulp.src(fixture)
				.pipe(xmlValidator())
				.once('error', error => resolve(error));
		});

		assert.ok(message.includes('\x1B[4minvalid_tag.xml\x1B[24m: <error> [xmldom error]\telement parse error: Error: invalid tagName:1'));
});

test.run();

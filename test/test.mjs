import { xmlValidator } from '../index.mjs';

import { fileURLToPath } from 'node:url';
import { it, describe } from 'mocha';
import assert from 'stream-assert';
import gulp from 'gulp';
import path from 'node:path';
import 'should';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const fixtures = glob => path.resolve(__dirname, 'fixtures', glob);

describe('gulp-xml-validator', () => {
  describe('xmlValidator()', () => {
    it('should emit error on streamed file', done => {
      gulp.src(fixtures('*'), { buffer: false })
        .pipe(xmlValidator())
        .once('error', err => {
          err.message.should.eql('Streaming not supported');
          done();
        });
    });

    it('pass on valid xml', done => {
      gulp.src(fixtures('valid.xml'))
        .pipe(xmlValidator())
        .pipe(assert.length(1))
        .pipe(assert.first( d => d.contents.toString()))
        .pipe(assert.end(done));
    });

    it('fail on mismatching tags', done => {
      gulp.src(fixtures('mismatching_tags.xml'))
        .pipe(xmlValidator())
        .once('error', () => done());
    });

    it('fail on missing close tag', done => {
      gulp.src(fixtures('missing_close_tag.xml'))
        .pipe(xmlValidator())
        .once('error', () => done());
    });

    it('fail on missing quote', done => {
      gulp.src(fixtures('missing_quote.xml'))
        .pipe(xmlValidator())
        .once('error', () => done());
    });

    it('fail on invalid tag', done => {
      gulp.src(fixtures('invalid_tag.xml'))
        .pipe(xmlValidator())
        .once('error', () => done());
    });
  });
});

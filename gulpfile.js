// Dependencies
const gulp = require('gulp');
const debug = require('gulp-debug');
const eslint = require('gulp-eslint');
const jsonlint = require('gulp-jsonlint');

// Exclude node_modules
const self = '!./node_modules/**/*';

// Lint JavaScript files
gulp.task('eslint', (done) => {
  gulp.src(['./**/*.js', self])
  .pipe(debug({title: 'eslint:'}))
  .pipe(eslint());

  done()
});

// Lint JSON files
gulp.task('jsonlint', (done) => {
  gulp.src(['./**/*.json', self])
  .pipe(debug({title: 'jsonlint:'}))
  .pipe(jsonlint())
  .pipe(jsonlint.reporter());

  done()
});

// Tasks
gulp.task('lint', gulp.parallel('eslint', 'jsonlint', (done) => {
  done();
}));

// Dependencies
var gulp = require('gulp');
var debug = require('gulp-debug');
var jshint = require('gulp-jshint');
var jsonlint = require('gulp-jsonlint');

// Exclude node_modules
var self = '!node_modules/**/*';

// Lint JavaScript files
gulp.task('jshint', (done) => {
  gulp.src(['./**/*.js', self])
  .pipe(debug({title: 'jshint:'}))
  .pipe(jshint());

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
gulp.task('lint', gulp.parallel('jshint', 'jsonlint', (done) => {
  done();
}));
// Dependencies
var gulp = require('gulp');
var debug = require('gulp-debug');
var jshint = require('gulp-jshint');
var jsonlint = require('gulp-jsonlint');

// Tasks
gulp.task('lint', ['jshint', 'jsonlint']);

// Exclude node_modules
var self = '!node_modules/**/*';

// Lint JavaScript files
gulp.task('jshint', function() {
    return gulp.src(['./**/*.js', self])
        .pipe(debug({title: 'jshint:'}))
        .pipe(jshint());
});

// Lint JSON files
gulp.task('jsonlint', function() {
   gulp.src(['./**/*.json', self])
        .pipe(debug({title: 'jsonlint:'}))
        .pipe(jsonlint())
        .pipe(jsonlint.reporter());
});

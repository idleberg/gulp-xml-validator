# gulp-xml-validator

[![npm](https://flat.badgen.net/npm/license/gulp-xml-validator)](https://www.npmjs.org/package/gulp-xml-validator)
[![npm](https://flat.badgen.net/npm/v/gulp-xml-validator)](https://www.npmjs.org/package/gulp-xml-validator)
[![CI](https://img.shields.io/github/workflow/status/idleberg/gulp-xml-validator/CI?style=flat-square)](https://github.com/idleberg/gulp-xml-validator/actions)

Gulp plugin to validate XML. Based on `@xmldom/xmldom` and inspired by [grunt-xml-validator](https://github.com/kajyr/grunt-xml-validator).

## Installation

```sh
$ npm install gulp-xml-validator --save-dev
```

## Usage

```js
const gulp = require('gulp');
const xmlValidator = require('gulp-xml-validator');

// Gulp v4
gulp.task('lint', (done) => {
  gulp.src('**/*.xml')
    .pipe(xmlValidator());

  done();
});

// Gulp v3
gulp.task('lint', function() {
  return gulp.src('**/*.xml')
    .pipe(xmlValidator());
});
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

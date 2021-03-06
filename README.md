# gulp-xml-validator

[![npm](https://flat.badgen.net/npm/license/gulp-xml-validator)](https://www.npmjs.org/package/gulp-xml-validator)
[![npm](https://flat.badgen.net/npm/v/gulp-xml-validator)](https://www.npmjs.org/package/gulp-xml-validator)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/gulp-xml-validator)](https://circleci.com/gh/idleberg/gulp-xml-validator)
[![David](https://flat.badgen.net/david/dep/idleberg/gulp-xml-validator)](https://david-dm.org/idleberg/gulp-xml-validator)

Gulp plugin to validate XML. Based on `xmldom` and inspired by [grunt-xml-validator](https://github.com/kajyr/grunt-xml-validator).

## Installation

```sh
# npm
$ npm install gulp-xml-validator --save-dev

# Yarn
$ yarn add gulp-xml-validator --dev
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

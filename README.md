# gulp-xml-validator

[![npm](https://img.shields.io/npm/l/gulp-xml-validator.svg?style=flat-square)](https://www.npmjs.org/package/gulp-xml-validator)
[![npm](https://img.shields.io/npm/v/gulp-xml-validator.svg?style=flat-square)](https://www.npmjs.org/package/gulp-xml-validator)
[![npm](https://img.shields.io/npm/dm/gulp-xml-validator.svg?style=flat-square)](https://www.npmjs.org/package/gulp-xml-validator)
[![Travis](https://img.shields.io/travis/idleberg/gulp-xml-validator.svg?style=flat-square)](https://travis-ci.org/idleberg/gulp-xml-validator)
[![David](https://img.shields.io/david/idleberg/gulp-xml-validator.svg?style=flat-square)](https://david-dm.org/idleberg/gulp-xml-validator)
[![David](https://img.shields.io/david/dev/idleberg/gulp-xml-validator.svg?style=flat-square)](https://david-dm.org/idleberg/gulp-xml-validator?type=dev)

Gulp plugin to validate XML. Based on `xmldom` and inspired by [grunt-xml-validator](https://github.com/kajyr/grunt-xml-validator).

## Installation

```sh
# npm
$ npm install gulp-xml-validator

# Yarn
$ yarn add gulp-xml-validator
```

## Usage

```js
const gulp = require('gulp');
const xmlValidator = require('gulp-xml-validator');

gulp.task('lint', (done) => {
  gulp.src('**/*.xml')
  .pipe(xmlValidator());

  done();
});
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/gulp-xml-validator) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`

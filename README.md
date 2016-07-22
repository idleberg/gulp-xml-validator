# gulp-xml-validator

[![Travis](https://img.shields.io/travis/idleberg/gulp-xml-validator.svg?style=flat-square)](https://travis-ci.org/idleberg/gulp-xml-validator)
[![David](https://img.shields.io/david/idleberg/gulp-xml-validator.svg?style=flat-square)](https://david-dm.org/idleberg/gulp-xml-validator)
[![David](https://img.shields.io/david/dev/idleberg/gulp-xml-validator.svg?style=flat-square)](https://david-dm.org/idleberg/gulp-xml-validator#info=devDependencies)

Gulp plugin to validate XML

## Installation

`npm install gulp-xml-validator`

## Usage

```js
var gulp = require('gulp');
var xmlValidator = require('gulp-xml-validator');

gulp.task('lint', function () {
  gulp.src('**/*.xml')
    .pipe(xmlValidator())
});
```

## License

This work is dual-licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/gulp-xml-validator) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
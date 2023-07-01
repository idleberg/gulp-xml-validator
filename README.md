# gulp-xml-validator

> Gulp plugin to validate XML.

[![License](https://img.shields.io/npm/l/gulp-xml-validator?style=for-the-badge)](https://github.com/idleberg/gulp-xml-validator/blob/main/README.md)
[![Version](https://img.shields.io/github/v/release/idleberg/gulp-xml-validator?style=for-the-badge)](https://github.com/idleberg/gulp-xml-validator/releases)
[![Build](https://img.shields.io/github/actions/workflow/status/idleberg/gulp-xml-validator/default.yml?style=for-the-badge)](https://github.com/idleberg/gulp-xml-validator/actions)

## Installation

```sh
$ npm install gulp-xml-validator@next --save-dev
```

:warning: 

## Usage

```js
import gulp from 'gulp';
import { xmlValidator } from 'gulp-xml-validator';

gulp.task('lint', done => {
  gulp.src('**/*.xml')
    .pipe(xmlValidator());

  done();
});
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

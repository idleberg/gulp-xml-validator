# gulp-xml-validator

[![npm](https://flat.badgen.net/npm/license/gulp-xml-validator)](https://www.npmjs.org/package/gulp-xml-validator)
[![npm](https://flat.badgen.net/npm/v/gulp-xml-validator)](https://www.npmjs.org/package/gulp-xml-validator)
[![CI](https://img.shields.io/github/actions/workflow/status/idleberg/gulp-xml-validator/default.yml?style=flat-square)](https://github.com/idleberg/gulp-xml-validator/actions)
[![Snyk](https://flat.badgen.net/snyk/idleberg/gulp-xml-validator)](https://snyk.io/vuln/npm:gulp-xml-validator)

Gulp plugin to validate XML. Based on `@xmldom/xmldom` and inspired by [grunt-xml-validator](https://github.com/kajyr/grunt-xml-validator).

## Installation

```sh
$ npm install gulp-xml-validator --save-dev
```

## Usage

```js
import gulp from 'gulp';
import { xmlValidator } from 'gulp-xml-validator';

// Gulp v4
gulp.task('lint', (done) => {
  gulp.src('**/*.xml')
    .pipe(xmlValidator());

  done();
});
```

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

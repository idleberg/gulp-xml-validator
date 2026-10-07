# gulp-xml-validator

> Gulp plugin to validate XML.

[![License](https://img.shields.io/npm/l/gulp-xml-validator?style=for-the-badge)](https://github.com/idleberg/gulp-xml-validator/blob/main/README.md)
[![Version](https://img.shields.io/github/v/release/idleberg/gulp-xml-validator?style=for-the-badge)](https://github.com/idleberg/gulp-xml-validator/releases)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/gulp-xml-validator/main?style=for-the-badge)

## Installation

```sh
$ npm install gulp-xml-validator --save-dev
```

## Usage

```js
// Gulpfile.mjs
import gulp from 'gulp';
import { xmlValidator } from 'gulp-xml-validator';

gulp.task('lint', () =>
  gulp.src('**/*.xml')
    .pipe(xmlValidator())
);
```

> [!NOTE]
> 
> This package encourages the use of ESM. [Read how to migrate your `Gulpfile`](https://gist.github.com/noraj/007a943dc781dc8dd3198a29205bae04).

### Validation

Files are parsed with [xmldom](https://github.com/xmldom/xmldom). Any message it reports fails the task, including warnings: xmldom raises warnings for malformed XML it can recover from, such as unquoted attribute values (`<a b=c>`) or attributes without a value (`<a b>`).

All files are checked before the task fails, and the error lists every problem found. Files that pass validation continue down the stream.

### Options

#### `options.mimeType`

Type: `string`  
Default: `"text/xml"`

Allows modifying the MIME type passed to `DOMParser().parseFromString()`. An unsupported MIME type fails the task.

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT).

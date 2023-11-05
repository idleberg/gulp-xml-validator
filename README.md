# gulp-xml-validator

> Gulp plugin to validate XML.

i

## Installation

```sh
$ npm install gulp-xml-validator --save-dev
```

## Usage

```js
// Gulpfile.mjs
import gulp from 'gulp';
import { xmlValidator } from 'gulp-xml-validator';

gulp.task('lint', done => {
  gulp.src('**/*.xml')
    .pipe(xmlValidator());

  done();
});
```

:warning: This plugin is now pure ESM. [Read how to migrate your `Gulpfile`](https://gist.github.com/noraj/007a943dc781dc8dd3198a29205bae04).

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

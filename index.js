'use strict';

const meta = require('./package.json').name;

const DOMParser = require('xmldom').DOMParser;
const gutil = require('gulp-util');
const through = require('through2');

// Plugin level function(dealing with files)
module.exports = function xmlValidator() {
  const errorOutputList = [];

  // Creating a stream through which each file will pass
  function transformFunction(file, encoding, callback) {

    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new gutil.PluginError(meta, 'Streaming not supported'));
    }

    const document = new DOMParser({
      locator: {},
      errorHandler: function errorHandler(level, message) {
        message = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '');
        errorOutputList.push(gutil.colors.underline(file.relative) + ': <' + level + '> ' + message);
      }
    }).parseFromString(file.contents.toString(), 'text/xml');

    return callback(null, file);
  };

  function errorOutput(callback) {
    if (errorOutputList.length > 0) {
      this.emit('error', new gutil.PluginError(meta, '\n' + errorOutputList.join('\n\n') + '\n', {
        showStack: false
      }));
    }
    callback();
  }

  return through.obj(transformFunction, errorOutput);
};

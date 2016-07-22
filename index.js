'use strict';

var meta = require('./package.json');

var DOMParser = require('xmldom').DOMParser;
var gutil = require('gulp-util');
var through = require('through2');

// Plugin level function(dealing with files)
module.exports = function xmlValidator() {
  var errorOutputList = [];

  // Creating a stream through which each file will pass
  function transformFunction (file, encoding, callback) {

    if (file.isNull()) {
      // nothing to do
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new gutil.PluginError(meta.name, 'Streaming not supported'));
    }

    var document = new DOMParser({
      locator: {},
      errorHandler: function(level, message) {
        message = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '');
        errorOutputList.push(gutil.colors.underline(file.relative) + ': <' + level + '> ' + message);
      }
    }).parseFromString(file.contents.toString(), 'text/xml');

   return callback(null, file);
  };

  function errorOutput(callback) {
    if (errorOutputList.length > 0) {
        this.emit('error', new gutil.PluginError(meta.name, '\n' + errorOutputList.join('\n\n') + '\n', {
            showStack: false
        }));
     }
     callback();
  }

  return through.obj(transformFunction, errorOutput);

}
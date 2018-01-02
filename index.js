'use strict';

const meta = require('./package.json').name;

const DOMParser = require('xmldom').DOMParser;
const PluginError = require('plugin-error');
const through = require('through2');
const underline = require('ansi-underline')

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
      return callback(new PluginError(meta, 'Streaming not supported'));
    }

    const document = new DOMParser({
      locator: {},
      errorHandler: function errorHandler(level, message) {
        message = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '');
        errorOutputList.push(underline(file.relative) + ': <' + level + '> ' + message);
      }
    }).parseFromString(file.contents.toString(), 'text/xml');

    return callback(null, file);
  };

  function errorOutput(callback) {
    if (errorOutputList.length > 0) {
      this.emit('error', new PluginError(meta, '\n' + errorOutputList.join('\n\n') + '\n', {
        showStack: false
      }));
    }
    callback();
  }

  return through.obj(transformFunction, errorOutput);
};

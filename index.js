'use strict';

const meta = require('./package.json').name;

const DOMParser = require('@xmldom/xmldom').DOMParser;
const PluginError = require('plugin-error');
const through = require('through2');
const underline = require('ansi-underline');

// Plugin level function(dealing with files)
module.exports = function xmlValidator() {
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(new PluginError(meta, 'Streaming not supported'));
      return;
    }

    let errorList = [];

    try {
      new DOMParser({
        locator: {},
        errorHandler: function errorHandler(level, message) {
          message = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '');
          errorList.push(underline(file.relative) + ': <' + level + '> ' + message);
        }
      }).parseFromString(file.contents.toString(), 'text/xml');
    } catch (err) {
      this.emit('error', new PluginError(meta, err, {fileName: file.path}));
    }

    if (errorList && errorList.length > 0) {
      this.emit('error', new PluginError(meta, '\n' + errorList.join('\n'), {
        fileName: file.path,
        showStack: false
      }));
    }

    callback(null, file);
  });
};

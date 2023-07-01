import { DOMParser } from '@xmldom/xmldom'
import PluginError from 'plugin-error';
import through from 'through2';
import underline from 'ansi-underline';

const packageName = 'gulp-xml-validator';

// Plugin level function(dealing with files)
export function xmlValidator() {
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      callback(PluginError(packageName, 'Streaming not supported'));
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
      this.emit('error', new PluginError(packageName, err, {fileName: file.path}));
    }

    if (errorList && errorList.length > 0) {
      this.emit('error', new PluginError(packageName, '\n' + errorList.join('\n'), {
        fileName: file.path,
        showStack: false
      }));
    }

    callback(null, file);
  });
};

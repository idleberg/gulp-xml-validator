import { DOMParser } from '@xmldom/xmldom';
import { Transform } from 'node:stream';
import kleur from 'kleur';
import PluginError from 'plugin-error';

const packageName = 'gulp-xml-validator';

/**
 * Gulp plugin to validate XML files using the xmldom library.
 * @returns {Transform} A transform stream that validates XML files.
 */
export function xmlValidator() {
  return new Transform({
    objectMode: true,

		/**
     * Transform function for the Gulp plugin.
     * @param {Vinyl} file - The vinyl file being processed.
     * @param {BufferEncoding} _encoding - The encoding of the file.
     * @param {TransformCallback} callback - The callback function to signal the completion of the transformation.
     */
    transform(file, _encoding, callback) {
      if (file.isNull()) {
        callback(null, file);
        return;
      }

      if (file.isStream()) {
        callback(new PluginError(packageName, 'Streaming not supported'));
        return;
      }

      let errorList = [];

      try {
        new DOMParser({
          locator: {},
          errorHandler: function errorHandler(level, message) {
            message = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '');
            errorList.push(`${kleur.underline(file.relative)}: <${level}> ${message}`);
          }
        }).parseFromString(file.contents.toString(), 'text/xml');
      } catch (err) {
        this.emit('error', new PluginError(packageName, err, {
          fileName: file.path
        }));
      }

      if (errorList && errorList.length > 0) {
        this.emit('error', new PluginError(packageName, `\n${errorList.join('\n')}`, {
          fileName: file.path,
          showStack: false
        }));
      }

      callback(null, file);
    }
  });
}

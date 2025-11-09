import { Transform, type TransformCallback } from 'node:stream';
import { DOMParser } from '@xmldom/xmldom';
import { underline } from 'kleur/colors';
import PluginError from 'plugin-error';

import type Vinyl from 'vinyl';

type PluginOptions = {
	mimeType?: string;
};

/**
 * Gulp plugin to validate XML files using the xmldom library.
 * @returns {Transform} A transform stream that validates XML files.
 */
export function xmlValidator(
	options: PluginOptions = {
		mimeType: 'text/xml',
	},
): Transform {
	const packageName = 'gulp-xml-validator';

	return new Transform({
		objectMode: true,

		/**
		 * Transform function for the Gulp plugin.
		 * @param {Vinyl} file - The vinyl file being processed.
		 * @param {BufferEncoding} _encoding - The encoding of the file.
		 * @param {TransformCallback} callback - The callback function to signal the completion of the transformation.
		 */
		transform(file: Vinyl, _encoding: BufferEncoding, callback: TransformCallback) {
			if (file.isNull()) {
				callback(null, file);
				return;
			}

			if (file.isStream()) {
				callback(new PluginError(packageName, 'Streaming not supported'));
				return;
			}

			if (!file.contents) {
				callback(new PluginError(packageName, 'Empty file'));
				return;
			}

			const errorList: string[] = [];

			try {
				new DOMParser({
					onError: (level: string, message: string) => {
						const replacedMessage = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '') ?? '';

						errorList.push(`${underline(file.relative)}: <${level}> ${replacedMessage}`);
					},
				}).parseFromString(file.contents.toString(), options?.mimeType ?? 'text/xml');
			} catch (error) {
				if (error instanceof Error) {
					errorList.push(`${underline(file.relative)}: <fatalError> ${error.message}`);
				}
			}

			if (errorList && errorList.length > 0) {
				callback(
					new PluginError(packageName, `\n${errorList.join('\n')}`, {
						fileName: file.path,
						showStack: false,
					}),
				);
				return;
			}

			callback(null, file);
		},
	});
}

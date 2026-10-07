import { Transform, type TransformCallback } from 'node:stream';
import { styleText } from 'node:util';
import { DOMParser } from '@xmldom/xmldom';
import PluginError from 'plugin-error';

import type Vinyl from 'vinyl';

type PluginOptions = {
	mimeType?: string;
};

/**
 * Gulp plugin to validate XML files using the xmldom library.
 * @returns A transform stream that validates XML files.
 */
export function xmlValidator(
	options: PluginOptions = {
		mimeType: 'text/xml',
	},
): Transform {
	const packageName = 'gulp-xml-validator';
	const errorList: string[] = [];
	const failedFiles: string[] = [];

	return new Transform({
		objectMode: true,

		/**
		 * Transform function for the Gulp plugin.
		 * @param file - The vinyl file being processed.
		 * @param _encoding - The encoding of the file.
		 * @param callback - The callback function to signal the completion of the transformation.
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

			const fileErrors: string[] = [];

			try {
				new DOMParser({
					onError: (level: string, message: string) => {
						const replacedMessage = message.replace(/\[xmldom (warning|.*Error)\]\s+/g, '') ?? '';

						fileErrors.push(`${styleText('underline', file.relative)}: <${level}> ${replacedMessage}`);
					},
				}).parseFromString(file.contents.toString(), options?.mimeType ?? 'text/xml');
			} catch (error) {
				if (error instanceof Error) {
					fileErrors.push(`${styleText('underline', file.relative)}: <fatalError> ${error.message}`);
				}
			}

			if (fileErrors.length > 0) {
				errorList.push(...fileErrors);
				failedFiles.push(file.path);
				callback();
				return;
			}

			callback(null, file);
		},

		/**
		 * Reports all collected errors once every file has been validated.
		 * @param callback - The callback function to signal the completion of the stream.
		 */
		flush(callback: TransformCallback) {
			if (errorList.length === 0) {
				callback();
				return;
			}

			callback(
				new PluginError(packageName, `\n${errorList.join('\n')}`, {
					fileName: failedFiles.length === 1 ? failedFiles[0] : undefined,
					showStack: false,
				}),
			);
		},
	});
}

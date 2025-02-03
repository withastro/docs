import jsdoc from 'jsdoc-api';
import fs from 'node:fs';
import ts from 'typescript';

const sourceBranch = process.env.SOURCE_BRANCH || 'main';
const sourceRepo = process.env.SOURCE_REPO || 'withastro/astro';

const errorURL = `https://raw.githubusercontent.com/${sourceRepo}/${sourceBranch}/packages/astro/src/core/errors/errors-data.ts`;

// Fill this in to test a response locally, without fetching.
const STUB = undefined; // fs.readFileSync('../astro/packages/astro/src/core/errors/errors-data.ts', {encoding: 'utf-8',});

const HEADER = `---
# NOTE: This file is auto-generated from 'scripts/error-docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
# Translators, please remove this note and the <DontEditWarning/> component.

title: Error reference
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
---

import DontEditWarning from '~/components/DontEditWarning.astro'

<DontEditWarning />

The following reference is a complete list of the errors you may encounter while using Astro. For additional assistance, including common pitfalls, please also see our [Troubleshooting Guide](/en/guides/troubleshooting/).
`;

const FOOTER = '';

export async function run() {
	const astroErrorData = await getAstroErrorsData();

	// TODO: Implement compiler errors

	const alreadyDocumentedErrors = fs.readdirSync('src/content/docs/en/reference/errors');

	const documentedErrors = [];

	let astroResult = '';
	for (const comment of astroErrorData.jsdoc) {
		// Header
		if (comment.kind === 'heading') {
			astroResult += `\n## ${comment.name}\n\n`;
			if (comment.description) {
				astroResult += `${comment.description.trim()}\n\n`;
			}
			continue;
		}

		// The `@see` comments are often formatted in a way where despite containing multiple lines
		// they count as one big string. We'll manually create an array when this happens so we can map through it later
		if (comment.see && comment.see.length === 1) {
			comment.see = comment.see[0].split('\n');
		}

		// The error's title. Fallback to the error's name if we don't have one
		const errorTitle = sanitizeString(
			// the name has string like "export.UnknownError", and we remove the "export." bit to get the name of the error
			astroErrorData.errors[comment.meta.code.name.slice('exports.'.length)].title ?? comment.name
		);
		const completeReferenceEntry = [
			// Errors can be deprecated, as such we add a little "deprecated" caution to errors that needs it
			getDeprecatedText(comment.deprecated),
			'',
			// Get the error message and print it in a blockquote
			getMessage(
				comment.name,
				astroErrorData.errors[comment.name].message,
				comment.tags.find((tag) => tag.title === 'message')?.value
			),
			// Show the error's description under a header
			comment.description && `## What went wrong?\n${comment.description.trim()}`,
			'',
			// List @see entries
			comment.see
				? `**See Also:**\n${comment.see.map((s) => `- ${s.replace('-', '')}`.trim()).join('\n')}`
				: undefined,
			'\n\n',
		]
			.filter((l) => l !== undefined)
			.join('\n')
			// Replace absolute links with relative ones
			.replace(/https\\?:\/\/docs\.astro\.build\//g, '/');

		const fileName = getKebabFilename(comment.name);
		const filePath = `src/content/docs/en/reference/errors/${fileName}.mdx`;
		fs.writeFileSync(filePath, getErrorReferenceEntryHeader(errorTitle) + completeReferenceEntry);

		documentedErrors.push(`${fileName}.mdx`);

		// Build string for error reference list
		astroResult += [
			`- [**${comment.name}**](/en/reference/errors/${fileName}/)<br/>${errorTitle}\n`,
		]
			.filter((l) => l !== undefined)
			.join('\n');
	}

	// Add deprecation notice for errors that are no longer emitted
	const deprecatedErrors = alreadyDocumentedErrors.filter(
		(error) => !documentedErrors.includes(error)
	);

	for (const error of deprecatedErrors) {
		const filePath = `src/content/docs/en/reference/errors/${error}`;
		const currentContent = fs.readFileSync(filePath, 'utf8');

		// If the error got removed without a deprecation, add a deprecation notice
		if (!currentContent.includes(':::caution[Deprecated]')) {
			fs.writeFileSync(
				filePath,
				currentContent.replace(
					'<DontEditWarning />',
					[
						'<DontEditWarning />',
						'',
						getDeprecatedText(
							'This error is from an older version of Astro and is no longer in use. If you are unable to upgrade your project to a more recent version, then you can consult [unmaintained snapshots of older documentation](/en/upgrade-astro/#older-docs-unmaintained) for assistance.'
						),
					].join('\n')
				),
				'utf8'
			);
		}
	}

	fs.writeFileSync(
		'src/content/docs/en/reference/error-reference.mdx',
		HEADER + astroResult + FOOTER,
		'utf8'
	);

	/**
	 * @param {string} errorName
	 * @param {string} message
	 * @param {string} cleanMessage
	 * @returns {(string | undefined)} Formatted message for the error or `undefined`
	 */
	function getMessage(errorName, message, cleanMessage) {
		let resultMessage = undefined;

		if (cleanMessage) {
			resultMessage = `> ${cleanMessage}`;
		} else if (message) {
			if (typeof message === 'string') {
				resultMessage = `> **${errorName}**: ${sanitizeString(message)}`;
			} else {
				resultMessage = `> **${errorName}**: ${String.raw({
					raw: extractStringFromFunction(message.toString()),
				})}`;
			}
		}

		if (resultMessage) {
			return `${resultMessage}\n`;
		}

		return undefined;
	}

	/**
	 * @param {string | boolean} deprecateMention
	 */
	function getDeprecatedText(deprecateMention) {
		if (!deprecateMention) {
			return undefined;
		}

		return [
			'',
			':::caution[Deprecated]',
			typeof deprecateMention === 'string'
				? deprecateMention
				: 'This error cannot be emitted by Astro anymore',
			':::',
		].join('\n');
	}

	/**
	 * @param {string} filename
	 */
	function getKebabFilename(filename) {
		return filename.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
}

async function getAstroErrorsData() {
	const inputBuffer = STUB || (await fetch(errorURL).then((r) => r.text()));

	const compiledResult = ts.transpileModule(inputBuffer, {
		compilerOptions: {
			module: 'esnext',
			target: 'esnext',
			removeComments: false,
		},
	}).outputText;

	const encodedJs = encodeURIComponent(compiledResult);
	const dataUri = `data:text/javascript;charset=utf-8,${encodedJs}`;

	/**
	 * @type {{AstroErrorData: Object.<string, {code: number, message: string, hint: string, name: string}>}
	 */
	const data = await import(dataUri);

	/**
	 * Get all the JSDoc comments in the file marked with the tag `@docs`
	 */
	const jsDocComments = (await jsdoc.explain({ source: compiledResult })).filter((data) =>
		data.tags?.some((tag) => tag.title === 'docs')
	);

	return {
		errors: data,
		jsdoc: jsDocComments,
	};
}

/**
 *
 * @param {string} errorTitle
 * @returns {string}
 */
function getErrorReferenceEntryHeader(errorTitle) {
	const sanitizedTitle = errorTitle.replaceAll('`', '');
	return `
---
# NOTE: This file is auto-generated from 'scripts/error-docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
# Translators, please remove this note and the <DontEditWarning/> component.

title: ${sanitizedTitle}
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
---
import DontEditWarning from '~/components/DontEditWarning.astro'

<DontEditWarning />

`.trimStart();
}

/**
 * @param {string} func
 */
function extractStringFromFunction(func) {
	const arrowIndex = func.indexOf('=>') + '=>'.length;

	return expressionToText(func.slice(arrowIndex).trim().slice(1, -1));

	// Turn the following syntax: `{componentName}` into this result: `COMPONENT_NAME`
	function expressionToText(text) {
		return sanitizeString(
			text.replaceAll(
				/\${([^}]+)}/gm,
				(_, match1) =>
					`${match1
						.split(/\.?(?=[A-Z])/)
						.join('_')
						.toUpperCase()}`
			)
		);
	}
}

/**
 * MDX doesn't like some characters, so we need to sanitize the messages regarding the usage of client directives and HTML tags.
 * Also remove unnecessary backslashes for inline code and replace newlines with `<br/>`
 * @param {string} message
 */
function sanitizeString(message) {
	return message
		.replaceAll(/\\`/gm, '`')
		.replaceAll(/`?(client:[\w]+(="\(.+\)")?)`?/g, '`$1`')
		.replaceAll(/([^`\\])</gm, '$1\\<')
		.replaceAll(/>([^`\\])/gm, '\\$1>')
		.replaceAll('\\n', '<br/>');
}

run();

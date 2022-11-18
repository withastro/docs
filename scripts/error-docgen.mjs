/* eslint-disable no-mixed-spaces-and-tabs */
import fs from 'fs';
import jsdoc from 'jsdoc-api';
import fetch from 'node-fetch';
import ts from 'typescript';

import '../../astro/packages/astro/dist/core/errors/errors-data.js';

const errorURL =
	'https://raw.githubusercontent.com/withastro/astro/main/packages/astro/src/core/errors/errors-data.ts';

// Fill this in to test a response locally, with fetching.
const STUB = fs.readFileSync('../astro/packages/astro/src/core/errors/errors-data.ts', {
	encoding: 'utf-8',
});

const compilerErrorURL =
	'https://raw.githubusercontent.com/withastro/compiler/main/packages/compiler/shared/diagnostics.ts';

// Fill this in to test a response locally, with fetching.
const compilerSTUB = fs.readFileSync('../compiler/packages/compiler/shared/diagnostics.ts', {
	encoding: 'utf-8',
});

const HEADER = `---
# NOTE: This file is auto-generated from 'scripts/error-docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
# Translators, please remove this note and the <DontEditWarning/> component.

layout: ~/layouts/MainLayout.astro
title: Error reference
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
setup: |
  import Since from '../../../components/Since.astro';
  import DontEditWarning from '../../../components/DontEditWarning.astro';
---

<DontEditWarning />

The following reference is a complete list of the errors you may encounter while using Astro. For additional assistance, including common pitfalls, please also see our [Troubleshooting Guide](/en/guides/troubleshooting/).

`;

const FOOTER = ``;

export async function run() {
	const compilerErrorData = { errors: [], jsdoc: [] }; // await getCompilerErrors();
	const astroErrorData = await getAstroErrorsData();

	let compilerResult = '';
	for (const comment of compilerErrorData.jsdoc) {
		if (comment.kind === 'heading') {
			compilerResult += `## ${comment.name}\n\n`;
			if (comment.description) {
				compilerResult += comment.description.trim() + '\n\n';
			}
			continue;
		}

		const errorName = comment.meta.code.value;
		compilerResult += [
			`### ${padCode(compilerErrorData.errors[errorName])} - ${cleanCompilerError(errorName)}`,
			'\n',
		]
			.filter((l) => l !== undefined)
			.join('\n');
	}

	let astroResult = '';
	for (const comment of astroErrorData.jsdoc) {
		if (comment.kind === 'heading') {
			astroResult += `## ${comment.name}\n\n`;
			if (comment.description) {
				astroResult += comment.description.trim() + '\n\n';
			}
			continue;
		}

		if (comment.see && comment.see.length === 1) {
			comment.see = comment.see[0].split('\n');
		}

		const cleanMessage = comment.tags.find((tag) => tag.title === 'message')?.value;
		astroResult += [
			`### ${sanitizeString(
				astroErrorData.errors[comment.meta.code.name].title ?? comment.longname
			)}`,
			comment.deprecated
				? [
						``,
						':::caution[Deprecated]',
						typeof comment.deprecated === 'string'
							? comment.deprecated
							: 'This error cannot be emitted by Astro anymore',
						':::',
				  ]
						.filter((l) => l !== undefined)
						.join('\n')
				: undefined,
			``,
			`> ${getMessage(
				comment.longname,
				astroErrorData.errors[comment.longname].message,
				cleanMessage
			)} (E${padCode(astroErrorData.errors[comment.longname].code)})\n`,
			comment.description && `#### What went wrong?`,
			comment.description && comment.description.trim(),
			``,
			comment.see
				? `**See Also:**\n${comment.see.map((s) => `- ${s.replace('-', '')}`.trim()).join('\n')}`
				: undefined,
			`\n\n`,
		]
			.filter((l) => l !== undefined)
			.join('\n');
	}

	compilerResult = compilerResult.replace(/https\\?:\/\/docs\.astro\.build\//g, '/');
	astroResult = astroResult.replace(/https\\?:\/\/docs\.astro\.build\//g, '/');

	fs.writeFileSync(
		'src/pages/en/reference/error-reference.md',
		HEADER + compilerResult + astroResult + FOOTER,
		'utf8'
	);

	function getMessage(errorName, message, cleanMessage) {
		if (cleanMessage) {
			return cleanMessage;
		}

		if (message) {
			if (typeof message === 'string') {
				return `**${errorName}**: ${message}`;
			} else {
				return `**${errorName}**: ${String.raw({
					raw: extractStringFromFunction(message.toString()),
				})}`;
			}
		}

		return undefined;
	}
}

async function getAstroErrorsData() {
	const inputBuffer = STUB || (await fetch(errorURL).then((r) => r.text()));

	const compiledResult = ts.transpileModule(inputBuffer, {
		compilerOptions: { module: 'esnext', target: 'esnext', removeComments: false },
	}).outputText;

	const encodedJs = encodeURIComponent(compiledResult);
	const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;

	/**
	 * @type {{AstroErrorData: Object.<string, {code: number, message: string, hint: string}>}
	 */
	const data = await import(dataUri);

	const jsDocComments = jsdoc
		.explainSync({ source: compiledResult })
		.filter(
			(data) =>
				data.kind !== 'package' &&
				!data.undocumented &&
				data.tags &&
				data.tags.some((tag) => tag.title === 'docs')
		);

	return {
		errors: data.AstroErrorData,
		jsdoc: jsDocComments,
	};
}

// eslint-disable-next-line no-unused-vars
async function getCompilerErrors() {
	const inputBuffer = compilerSTUB || (await fetch(compilerErrorURL).then((r) => r.text()));

	const compiledResult = ts.transpileModule(inputBuffer, {
		compilerOptions: { module: 'esnext', target: 'esnext', removeComments: false },
	}).outputText;

	const encodedJs = encodeURIComponent(compiledResult);
	const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;

	/**
	 * @type {{DiagnosticCode: Object.<string, number>}
	 */
	const data = await import(dataUri);

	const jsDocComments = jsdoc
		.explainSync({ source: compiledResult })
		.filter(
			(data) =>
				data.kind !== 'package' &&
				!data.undocumented &&
				data.tags.some((tag) => tag.title === 'docs')
		);

	return {
		errors: data.DiagnosticCode,
		jsdoc: jsDocComments,
	};
}

/**
 * @param {string} func
 */
function extractStringFromFunction(func) {
	const arrowIndex = func.indexOf('=>') + '=>'.length;

	// eslint-disable-next-line no-useless-escape
	return escapeHtml(func.slice(arrowIndex).trim().slice(1, -1));

	function escapeHtml(unsafe) {
		return unsafe
			.replaceAll(
				/\${([^}]+)}/gm,
				(str, match1) =>
					`${match1
						.split(/\.?(?=[A-Z])/)
						.join('_')
						.toUpperCase()}`
			)
			.replaceAll('\\`', '`')
			.replaceAll(/`?(client:[\w]+(="\(.+\)")?)`?/g, '`$1`')
			.replaceAll(/&/g, '&amp;')
			.replaceAll(/</g, '&lt;')
			.replaceAll(/>/g, '&gt;');
	}
}

/**
 * @param {string} message
 */
function sanitizeString(message) {
	return message.replaceAll(/`?(client:[\w]+(="\(.+\)")?)`?/g, '`$1`');
}

/**
 *
 * @param {number} code
 */
function padCode(code) {
	return code.toString().padStart(5, '0');
}

/**
 *
 * @param {string} error
 */
function cleanCompilerError(error) {
	return error.replace('ERROR_', '');
}

run();

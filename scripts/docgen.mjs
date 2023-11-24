// @ts-check

import fs from 'fs';
import jsdoc from 'jsdoc-api';
import fetch from 'node-fetch';

// Fill this in to test a response locally, with fetching.
const STUB = ``; // fs.readFileSync('/PATH/TO/MONOREPO/astro/packages/astro/src/@types/astro.ts', {encoding: 'utf-8'});

const HEADER = `---
# NOTE: This file is auto-generated from 'scripts/docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts
# Translators, please remove this note and the <DontEditWarning/> component. 

title: Configuration Reference
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts
---

import Since from '~/components/Since.astro'
import DontEditWarning from '~/components/DontEditWarning.astro'

<DontEditWarning />

The following reference covers all supported configuration options in Astro. To learn more about configuring Astro, read our guide on [Configuring Astro](/en/guides/configuring-astro/).

\`\`\`js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // your configuration options here...
})
\`\`\`
`;

const FOOTER = ``;

/**
 * The simple demo does not rely on the TypeScript compiler API; instead, it parses the
 * source file directly.  It uses the default parser configuration.
 */
export async function run() {
	const sourceBranch = process.env.SOURCE_BRANCH || 'main';
	const sourceRepo = process.env.SOURCE_REPO || 'withastro/astro';

	let task = 'Fetch `@types/astro.ts` from ' + sourceRepo + '#' + sourceBranch;
	console.time(task);

	const inputBuffer =
		STUB ||
		(await fetch(
			`https://raw.githubusercontent.com/${sourceRepo}/${sourceBranch}/packages/astro/src/%40types/astro.ts`
		).then((r) => r.text()));

	console.timeEnd(task);
	task = 'Parse types and generate configuration reference';
	console.time(task);

	// Get all `@docs` JSDoc comments in the file.
	const allComments = [
		...inputBuffer.matchAll(/\/\*\*\s*\n([^*]|\*[^/])*@docs([^*]|\*[^/])*\*\//g),
	];
	const allCommentsInput = allComments
		.map((m) => m[0])
		.filter((c) => c.includes('* @docs'))
		.join('\n\n');

	const allParsedComments = jsdoc
		.explainSync({ source: allCommentsInput })
		.filter((data) => data.tags);

	let result = ``;

	for (const comment of allParsedComments) {
		if (!comment.name) {
			throw new Error(`Missing @docs JSDoc tag: @name`);
		}

		result += [
			getHeading(comment),
			getDeprecatedAside(comment.deprecated),
			getCommentProperties(comment),
			comment.description?.trim() || undefined,
			comment.see
				? `**See Also:**\n${comment.see.map((s) => `- ${s}`.trim()).join('\n')}`
				: undefined,
			`\n`,
		]
			.filter((l) => l !== undefined)
			.join('\n');
	}

	// Make any links to docs relative instead of absolute.
	result = result.replace(/https:\/\/docs\.astro\.build\//g, '/');

	console.timeEnd(task);
	task = 'Update configuration-reference.mdx';
	console.time(task);

	fs.writeFileSync(
		'src/content/docs/en/reference/configuration-reference.mdx',
		HEADER + result + FOOTER,
		'utf8'
	);

	console.timeEnd(task);
}

/**
 * Create a string of ### to create a Markdown heading for the given level.
 * @param {number} headingLevel
 */
function h(headingLevel) {
	return Array.from({ length: headingLevel }).fill('#').join('');
}

/**
 * Get a Markdown heading of the correct level for this comment.
 * @param {{ kind: string | undefined; longname: string }} comment
 */
function getHeading(comment) {
	let headingLevel = 3;
	const headingMatches = /^h(1|2|3|4|5|6)$/.exec(comment.kind || '');
	if (headingMatches) {
		headingLevel = parseInt(headingMatches[1]);
	} else if (comment.kind === 'heading') {
		headingLevel = 2;
	}
	return `${h(headingLevel)} ${comment.longname}\n`;
}

/**
 * Get a `:::caution` block if the passed tag is deprecated.
 * @param {string | undefined} tag
 */
function getDeprecatedAside(tag) {
	if (!tag) return undefined;
	return [
		'',
		':::caution[Deprecated]',
		typeof tag === 'string' ? tag : 'This option is deprecated.',
		':::',
		'',
	].join('\n');
}

/**
 * Get block of type, CLI command, default value, and version added in for the current comment.
 * @param {{ tags: { title: string; text: string }[]; kind: string; type?: { names: string [] }; defaultvalue?: string; version?: string }} comment
 */
function getCommentProperties(comment) {
	const cliFlag = comment.tags.find((f) => f.title === 'cli');
	const typerawFlag = comment.tags.find((f) => f.title === 'typeraw');

	if (comment.kind !== 'heading' && !comment.type && !typerawFlag) {
		throw new Error(`Missing @docs JSDoc tag: @type or @typeraw`);
	}
	const typesFormatted = typerawFlag
		? typerawFlag.text.replace(/\{(.*)\}/, '$1')
		: comment.type?.names.join(' | ');

	const properties = [
		typesFormatted ? `**Type:** \`${typesFormatted}\`` : undefined,
		cliFlag ? `**CLI:** \`${cliFlag.text}\`` : undefined,
		comment.defaultvalue ? `**Default:** ${comment.defaultvalue}` : undefined,
		comment.version ? `<Since v="${comment.version}" />` : undefined,
	]
		.filter((l) => l !== undefined)
		.join('<br />\n');

	return properties.length ? ['<p>', '', properties, '</p>', ''].join('\n') : undefined;
}

run();

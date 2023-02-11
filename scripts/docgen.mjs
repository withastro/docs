import { slug as githubSlug } from 'github-slugger';
import fs from 'fs';
import jsdoc from 'jsdoc-api';
import fetch from 'node-fetch';

// Fill this in to test a response locally, with fetching.
const STUB = fs.readFileSync('../astro/packages/astro/src/@types/astro.ts', {encoding: 'utf-8'});

const HEADER = `---
# NOTE: This file is auto-generated from 'scripts/docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts
# Translators, please remove this note and the <DontEditWarning/> component. 

layout: ~/layouts/MainLayout.astro
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts
$1
---

import Since from '../../../components/Since.astro'
import DontEditWarning from '../../../components/DontEditWarning.astro'

<DontEditWarning />
`;
const FOOTER = ``;

/**
 * The simple demo does not rely on the TypeScript compiler API; instead, it parses the
 * source file directly.  It uses the default parser configuration.
 */
export async function run() {
	const inputBuffer =
		STUB ||
		(await fetch(
			'https://raw.githubusercontent.com/withastro/astro/main/packages/astro/src/%40types/astro.ts'
		).then((r) => r.text()));

	// Get all `@docs` JSDoc comments in the file.
	const allComments = [
		...inputBuffer.matchAll(/\/\*\*\s*\n([^\*]|\*[^\/])*@docs([^\*]|\*[^\/])*\*\//g),
	];
	const allCommentsInput = allComments
		.map((m) => m[0])
		.filter((c) => c.includes('* @docs'))
		.join('\n\n');

	console.log(jsdoc);
	console.log(allCommentsInput);
	console.log(jsdoc.explainSync({ source: allCommentsInput }));

	const allParsedComments = jsdoc
		.explainSync({ source: allCommentsInput })
		.filter((data) => data.tags);

	for (const comment of allParsedComments) {
		if (comment.kind === 'heading') {
			result += `## ${comment.name}\n\n`;
			if (comment.description) {
				result += comment.description.trim() + '\n\n';
			}
			continue;
		}
		const slug = githubSlug(comment.longname);
		const cliFlag = comment.tags.find((f) => f.title === 'cli');
		const typerawFlag = comment.tags.find((f) => f.title === 'typeraw');
		if (!comment.name) {
			throw new Error(`Missing @docs JSDoc tag: @name`);
		}
		if (!comment.type && !typerawFlag) {
			throw new Error(`Missing @docs JSDoc tag: @type or @typeraw`);
		}
		const typesFormatted = typerawFlag
			? typerawFlag.text.replace(/\{(.*)\}/, '$1')
			: comment.type.names.join(' | ');
		const result = [
			`### ${comment.longname}`,
			``,
			`<p>`,
			``,
			[
				`**Type:** \`${typesFormatted}\``,
				cliFlag ? `**CLI:** \`${cliFlag.text}\`` : undefined,
				comment.defaultvalue ? `**Default:** ${comment.defaultvalue}` : undefined,
				comment.version ? `<Since v="${comment.version}" />` : undefined,
			]
				.filter((l) => l !== undefined)
				.join('<br />\n'),
			`</p>`,
			``,
			comment.description && comment.description.trim(),
			comment.see
				? `**See Also:**\n${comment.see.map((s) => `- ${s}`.trim()).join('\n')}`
				: undefined,
			`\n\n`,
		]
			.filter((l) => l !== undefined)
			.join('\n')
			.replace(/https:\/\/docs\.astro\.build\//g, '/');
		
			console.log(result);
			fs.writeFileSync(
				fs.writeFileSync(
				`src/pages/en/reference/configuration/${slug}.mdx`,
				HEADER.replace('$1', `title: ${comment.longname}`) + result + FOOTER,
				'utf8'
			);
	}

}

run();

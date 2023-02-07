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

	let result = ``;

	for (const comment of allParsedComments) {
		if (comment.kind === 'heading') {
			result += `## ${comment.name}\n\n`;
			if (comment.description) {
				result += comment.description.trim() + '\n\n';
			}
			continue;
		}
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
		result += [
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
			.join('\n');
	}

	result = result.replace(/https:\/\/docs\.astro\.build\//g, '/');

	console.log(result);
	fs.writeFileSync(
		'src/content/docs/en/reference/configuration-reference.mdx',
		HEADER + result + FOOTER,
		'utf8'
	);
}

run();

import kleur from 'kleur';
import type {
	Blockquote,
	Definition,
	HTML,
	Link,
	ListContent,
	Paragraph,
	PhrasingContent,
	Root,
	Text,
} from 'mdast';
import { toString } from 'mdast-util-to-string';
import fetch from 'node-fetch';
import fs from 'node:fs';
import { remark } from 'remark';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';
import { githubGet } from './lib/github-get.mjs';
import output from './lib/output.mjs';

interface IntegrationData {
	name: string;
	category: 'renderer' | 'adapter' | 'other';
	readme: string;
	srcdir: string;
	i18nReady: string;
}

const prettyCategoryDescription: Record<string, unknown> = {
	renderer: 'framework integration to extend component support in your Astro project',
	adapter: 'SSR adapter to deploy your Astro project',
	other: 'integration in your Astro project',
};

class IntegrationPagesBuilder {
	readonly #githubToken?: string;
	readonly #sourceBranch: string;
	readonly #sourceRepo: string;
	readonly #deprecatedIntegrations = new Set(['turbolinks']);
	readonly #i18nNotReadyIntegrations = new Set(['markdoc']);

	constructor(opts: { githubToken?: string; sourceBranch: string; sourceRepo: string }) {
		this.#githubToken = opts.githubToken;
		this.#sourceBranch = opts.sourceBranch;
		this.#sourceRepo = opts.sourceRepo;

		if (!this.#githubToken) {
			if (output.isCi) {
				output.error(
					'Missing GITHUB_TOKEN. Please add the following lines to the task:\n' +
						'    env:\n' +
						'      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}'
				);
				process.exit(1);
			} else {
				output.warning(
					'You have not set the GITHUB_TOKEN environment variable. ' +
						'Calls to GitHub’s API may hit rate limits without it.'
				);
			}
		}
	}

	/**
	 * Collect data for each official Astro integration.
	 */
	async #getIntegrationData(): Promise<IntegrationData[]> {
		// Read all the packages in Astro’s integrations directory.
		const url = `https://api.github.com/repos/${
			this.#sourceRepo
		}/contents/packages/integrations?ref=${this.#sourceBranch}`;
		const packages: { name: string }[] = await githubGet({ url, githubToken: this.#githubToken });

		return await Promise.all(
			packages
				.filter((pkg) => !this.#deprecatedIntegrations.has(pkg.name))
				.map(async (pkg) => {
					const pkgJsonURL = `https://raw.githubusercontent.com/${this.#sourceRepo}/${
						this.#sourceBranch
					}/packages/integrations/${pkg.name}/package.json`;
					const readmeURL = `https://raw.githubusercontent.com/${this.#sourceRepo}/${
						this.#sourceBranch
					}/packages/integrations/${pkg.name}/README.md`;
					const { name, keywords } = await githubGet({
						url: pkgJsonURL,
						githubToken: this.#githubToken,
					});
					const category = keywords.includes('renderer')
						? 'renderer'
						: keywords.includes('astro-adapter')
						? 'adapter'
						: 'other';
					const i18nReady = (!this.#i18nNotReadyIntegrations.has(pkg.name)).toString();
					const readme = await (await fetch(readmeURL)).text();
					return { name, category, readme, srcdir: pkg.name, i18nReady };
				})
		);
	}

	/**
	 * Process the raw README markdown:
	 * - Add frontmatter including a layout
	 * - Move the README title into frontmatter
	 * - Add the correct base to any relative links
	 * - _Remove_ the base from any docs links
	 */
	async #processReadme({
		name,
		readme,
		srcdir,
		category,
		i18nReady,
	}: IntegrationData): Promise<string> {
		// Remove title from body
		readme = readme.replace(/^# (.+)/, '');
		const githubLink = `https://github.com/${this.#sourceRepo}/tree/${
			this.#sourceBranch
		}/packages/integrations/${srcdir}/`;

		const createDescription = (name: string, category: string): string => {
			return `Learn how to use the ${name} ${prettyCategoryDescription[category]}.`;
		};
		const processor = remark()
			.use(removeTOC)
			.use(absoluteLinks, { base: githubLink })
			.use(relativeLinks, { base: `https://docs.astro.build/` })
			.use(githubVideos)
			.use(replaceAsides)
			.use(closeUnclosedLinebreaks);
		readme = (await processor.process(readme)).toString();
		readme =
			`---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
#       and pulls content directly from the package’s README.
#       DO NOT MAKE EDITS TO THIS FILE DIRECTLY, THEY WILL BE OVERWRITTEN!
#       For corrections, please edit the package README at
#       ${githubLink}
#
# TRANSLATORS: please remove this note and the <DontEditWarning/> component.

type: integration
title: '${name}'
description: ${createDescription(name, category)}
githubURL: '${githubLink}'
hasREADME: true
category: ${category}
i18nReady: ${i18nReady}
---

import Video from '~/components/Video.astro';
import DontEditWarning from '~/components/DontEditWarning.astro';

<DontEditWarning/>\n\n` + readme;
		return readme;
	}

	async #writeReadme(packageName: string, readme: string): Promise<void> {
		const unscopedName = packageName.split('/').pop();
		return await fs.promises.writeFile(
			`src/content/docs/en/guides/integrations-guide/${unscopedName}.mdx`,
			readme,
			'utf8'
		);
	}

	async run() {
		console.log(kleur.bold('Creating integration pages...\n'));
		const integrations = await this.#getIntegrationData();
		await Promise.all(
			integrations.map(async (integration) => {
				const readme = await this.#processReadme(integration);
				await this.#writeReadme(integration.name, readme);
				console.log('', kleur.green('✔︎'), integration.name);
			})
		);
		console.log('\n');
	}
}

const builder = new IntegrationPagesBuilder({
	sourceBranch: process.env.SOURCE_BRANCH || 'main',
	sourceRepo: process.env.SOURCE_REPO || 'withastro/astro',
	githubToken: process.env.GITHUB_TOKEN,
});
builder.run();

/** Remark plugin to prepend an absolute path in front of link hrefs. */
function absoluteLinks({ base }: { base: string }) {
	return function transform(tree: Root) {
		function visitor(node: Link | Definition) {
			// Sanitize URL by removing leading `/`
			const relativeUrl = node.url.replace(/^.?\//, '');
			// Don't add absolute path to local links.
			node.url = node.url.startsWith('#') ? node.url : new URL(relativeUrl, base).href;
		}
		visit(tree, 'link', visitor);
		visit(tree, 'definition', visitor);
		visit(tree, 'html', function htmlVisitor(node) {
			node.value = node.value.replace(/(?<=href=")(?!https?:\/\/)\/?(.+)(?=")/g, `${base}$1`);
		});
	};
}

/** Close unclosed `<br>` tags => `<br/>` */
function closeUnclosedLinebreaks() {
	return function transform(tree: Root) {
		visit(tree, 'html', function htmlVisitor(node) {
			node.value = node.value.replaceAll(/<br>/gi, '<br/>');
		});
	};
}

/** Remark plugin to replace GitHub note/warning syntax with docs-style asides. */
function replaceAsides() {
	return function transform(tree: Root) {
		visit(tree, 'blockquote', (node: Blockquote | Paragraph) => {
			const openingParagraph = node.children[0];

			if (!('children' in openingParagraph)) return;
			const [firstChild, trailingText, ...children] = openingParagraph.children;

			// check for **Note:** or **Warning:** at the beginning of the first paragraph
			if (firstChild.type !== 'strong') return;
			const firstChildText = toString(firstChild);
			if (!/Note|Warning/.test(firstChildText)) return;

			// assign aside type
			const AsideType = firstChildText.toLowerCase() === 'warning' ? 'caution' : 'note';

			// remove blockquotes `>`
			node.type = 'paragraph';

			// if trailingText starts with `: ` replace it with a newline
			if ('value' in trailingText) {
				trailingText.value = trailingText.value.replace(/^: /, '\n');
			}

			// Opening and closing ::: text to wrap blockquote.
			const openAside: Text = { type: 'text', value: `:::${AsideType}` };
			const closeAside: Text = { type: 'text', value: '\n:::' };

			openingParagraph.children = [
				openAside,
				trailingText,
				...children,
				closeAside,
			] as ListContent[];
		});
	};
}

/** Remark plugin to strip the docs base from absolute link hrefs. */
function relativeLinks({ base }: { base: string }) {
	return function transform(tree: Root) {
		function visitor(node: Link | Definition) {
			if (!node.url.startsWith(base)) return;
			const url = new URL(node.url);
			node.url = url.pathname + url.search + url.hash;
		}
		visit(tree, 'link', visitor);
		visit(tree, 'definition', visitor);
		visit(tree, 'html', function htmlVisitor(node) {
			node.value = node.value.replace(new RegExp(base, 'g'), '/');
		});
	};
}

/** Remark plugin to convert GitHub video URLs to `<video>` elements. */
function githubVideos() {
	return function transform(tree: Root) {
		visit(tree, 'text', function visitor(node: Text | HTML) {
			if (node.value.startsWith('https://user-images.githubusercontent.com/')) {
				const type = node.value.split('.').pop();
				node.type = 'html';
				node.value = `<Video src="${node.value}" type="video/${type}" />`;
			}
		});
	};
}

/** Remark plugin to strip out the table of contents from an integration README. */
function removeTOC() {
	return function transform(tree: Root) {
		remove(tree, (node) => {
			if (node.type !== 'list') return;
			const firstItemContent = node.children[0].children[0];
			if (firstItemContent.type !== 'paragraph') return;
			return firstItemContent.children.some(
				(child: PhrasingContent) =>
					child.type === 'link' &&
					(child.url.startsWith('#why') || child.url.startsWith('#installation'))
			);
		});
	};
}

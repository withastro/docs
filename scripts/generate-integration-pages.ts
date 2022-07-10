import kleur from 'kleur';
import type { Definition, HTML, Link, Root, Text } from 'mdast';
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
}

class IntegrationPagesBuilder {
	readonly #githubToken?: string;
	readonly #sourceBranch: string;
	readonly #sourceRepo: string;
	readonly #deprecatedIntegrations = new Set(['turbolinks']);

	constructor(opts: { githubToken?: string; sourceBranch: string; sourceRepo: string }) {
		this.#githubToken = opts.githubToken;
		this.#sourceBranch = opts.sourceBranch;
		this.#sourceRepo = opts.sourceRepo;

		if (!this.#githubToken) {
			if (output.isCi) {
				output.error('Missing GITHUB_TOKEN. Please add the following lines to the task:\n' + '    env:\n' + '      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
				process.exit(1);
			} else {
				output.warning('You have not set the GITHUB_TOKEN environment variable. ' + 'Calls to Github’s API may hit rate limits without it.');
			}
		}
	}

	/**
	 * Collect data for each official Astro integration.
	 */
	async #getIntegrationData(): Promise<IntegrationData[]> {
		// Read all the packages in Astro’s integrations directory.
		const url = `https://api.github.com/repos/${this.#sourceRepo}/contents/packages/integrations?ref=${this.#sourceBranch}`;
		const packages: { name: string }[] = await githubGet({ url, githubToken: this.#githubToken });

		return await Promise.all(
			packages
				.filter((pkg) => !this.#deprecatedIntegrations.has(pkg.name))
				.map(async (pkg) => {
					const pkgJsonURL = `https://raw.githubusercontent.com/${this.#sourceRepo}/${this.#sourceBranch}/packages/integrations/${pkg.name}/package.json`;
					const readmeURL = `https://raw.githubusercontent.com/${this.#sourceRepo}/${this.#sourceBranch}/packages/integrations/${pkg.name}/README.md`;
					const { name, keywords } = await githubGet({ url: pkgJsonURL, githubToken: this.#githubToken });
					const category = keywords.includes('renderer') ? 'renderer' : keywords.includes('astro-adapter') ? 'adapter' : 'other';
					const readme = await (await fetch(readmeURL)).text();
					return { name, category, readme, srcdir: pkg.name };
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
	async #processReadme({ readme, srcdir, category }: IntegrationData): Promise<string> {
		const titleRegEx = /# (.+)/;
		const [, title] = readme.match(titleRegEx) || [];
		// Remove title from body
		readme = readme.replace(titleRegEx, '');
		const processor = remark()
			.use(removeTOC)
			.use(absoluteLinks, { base: `https://github.com/${this.#sourceRepo}/tree/${this.#sourceBranch}/packages/integrations/${srcdir}/` })
			.use(relativeLinks, { base: `https://docs.astro.build/` })
			.use(githubVideos);
		readme = (await processor.process(readme)).toString();
		readme =
			`---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
#       and pulls content directly from the package’s README.
#       DO NOT MAKE EDITS TO THIS FILE DIRECTLY, THEY WILL BE OVERWRITTEN!
#       For corrections, please edit the package README at
#       https://github.com/${this.#sourceRepo}/tree/${this.#sourceBranch}/packages/integrations/${srcdir}

layout: ~/layouts/IntegrationLayout.astro
title: '${title.split(' ').shift()}'
category: ${category}
i18nReady: false
---\n\n` + readme;
		return readme;
	}

	async #writeReadme(packageName: string, readme: string): Promise<void> {
		const unscopedName = packageName.split('/').pop();
		return await fs.promises.writeFile(`src/pages/en/guides/integrations-guide/${unscopedName}.md`, readme, 'utf8');
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
			node.url = new URL(relativeUrl, base).href;
		}
		visit(tree, 'link', visitor);
		visit(tree, 'definition', visitor);
		visit(tree, 'html', function htmlVisitor(node) {
			node.value = node.value.replace(/(?<=href=")(?!https?:\/\/)\/?(.+)(?=")/g, `${base}$1`);
		});
	};
}

/** Remark plugin to strip the docs base from absolute link hrefs. */
function relativeLinks({ base }: { base: string }) {
	return function transform(tree: Root) {
		function visitor(node: Link | Definition) {
			if (!node.url.startsWith(base)) return;
			node.url = new URL(node.url).pathname;
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
				node.value = `<video controls><source src="${node.value}" type="video/${type}" /></video>`;
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
			return firstItemContent.children.some((child) => child.type === 'link' && child.url.startsWith('#why'));
		});
	};
}

import kleur from 'kleur';
import type { Root } from 'mdast';
import fs from 'node:fs';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import { githubGet } from './lib/github-get.mjs';
import output from './lib/output.mjs';

interface IntegrationData {
	name: string;
	readme: string;
	srcdir: string;
}

class IntegrationPagesBuilder {
	readonly #githubToken?: string;

	constructor(opts: { githubToken?: string }) {
		this.#githubToken = opts.githubToken;

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
		const url = `https://api.github.com/repos/withastro/astro/contents/packages/integrations`;
		const packages = await githubGet({ url, githubToken: this.#githubToken });

		return await Promise.all(
			packages.map(async (pkg: { name: string }) => {
				// Load source `package.json` to get the scoped name.
				const url = `https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/${pkg.name}/package.json`;
				const githubPkgJSON = await githubGet({ url, githubToken: this.#githubToken });
				// Fetch package data from the npm registry.
				const { name, readme } = await githubGet({ url: `https://registry.npmjs.org/${githubPkgJSON.name}` });
				return { name, readme, srcdir: pkg.name };
			})
		);
	}

	/**
	 * Process the raw README markdown returned from the npm registry:
	 * - Add frontmatter including a layout
	 * - Move the README title into frontmatter
	 * - Add the correct base to any relative links
	 * - _Remove_ the base from any docs links
	 */
	async #processReadme({ readme, srcdir }: IntegrationData): Promise<string> {
		const titleRegEx = /# (.+)/;
		const [, title] = readme.match(titleRegEx) || [];
		// Remove title from body
		readme = readme.replace(titleRegEx, '');
		const processor = remark()
			.use(absoluteLinks, { base: `https://github.com/withastro/astro/tree/main/packages/integrations/${srcdir}/` })
			.use(relativeLinks, { base: `https://docs.astro.build/` });
		readme = (await processor.process(readme)).toString();
		readme =
			`---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
# Do not make edits to it directly, they will be overwritten.

layout: ~/layouts/MainLayout.astro
title: '${title}'
i18nReady: false
---\n\n` + readme;
		return readme;
	}

	async #writeReadme(packageName: string, readme: string): Promise<void> {
		const unscopedName = packageName.split('/').pop();
		return await fs.promises.writeFile(`src/pages/en/guides/integrations/${unscopedName}.md`, readme, 'utf8');
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
	githubToken: process.env.GITHUB_TOKEN,
});
builder.run();

/** Remark plugin to prepend an absolute path in front of link hrefs. */
function absoluteLinks({ base }: { base: string }) {
	return function transform(tree: Root) {
		visit(tree, 'link', function visitor(node) {
			// Sanitize URL by removing leading `/`
			const relativeUrl = node.url.replace(/^.?\//, '');
			node.url = new URL(relativeUrl, base).href;
		});
		visit(tree, 'html', function htmlVisitor(node) {
			node.value = node.value.replace(/(?<=href=")(?!https?:\/\/)\/?(.+)(?=")/g, `${base}$1`);
		});
	};
}

/** Remark plugin to strip the docs base from absolute link hrefs. */
function relativeLinks({ base }: { base: string }) {
	return function transform(tree: Root) {
		visit(tree, 'link', function visitor(node) {
			if (!node.url.startsWith(base)) return;
			node.url = new URL(node.url).pathname;
		});
		visit(tree, 'html', function htmlVisitor(node) {
			node.value = node.value.replace(new RegExp(base, 'g'), '/');
		});
	};
}

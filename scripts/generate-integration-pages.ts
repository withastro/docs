import fs from 'node:fs';
import output from './lib/output.mjs';
import { githubGet } from './lib/github-get.mjs';

interface IntegrationPagesBuilderOptions {
	githubToken?: string;
}

class IntegrationPagesBuilder {
	readonly #githubToken?: string;

	constructor(opts: IntegrationPagesBuilderOptions) {
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
	 * Get the package JSON of each Astro integration from the npm registry.
	 */
	async #getIntegrationPkgJSON(): Promise<{ name: string; readme: string }[]> {
		// Read all the packages in Astro’s integrations directory.
		const url = `https://api.github.com/repos/withastro/astro/contents/packages/integrations`;
		const packages = await githubGet({ url, githubToken: this.#githubToken });

		return await Promise.all(
			packages.map(async (pkg: { name: string }) => {
				// Load source `package.json` to get the scoped name.
				const url = `https://raw.githubusercontent.com/withastro/astro/main/packages/integrations/${pkg.name}/package.json`;
				const githubPkgJSON = await githubGet({ url, githubToken: this.#githubToken });
				// Fetch the full package data from the npm registry.
				return await githubGet({ url: `https://registry.npmjs.org/${githubPkgJSON.name}` });
			})
		);
	}

	#processReadme(packageName: string, readme: string): string {
		const titleRegEx = /# (.+)/;
		const [, title] = readme.match(titleRegEx) || [];
		// Remove title from body
		readme = readme.replace(titleRegEx, '');
		// Make docs links relative.
		readme = readme.replace(/https:\/\/docs\.astro\.build\//g, '/');
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
		const integrations = await this.#getIntegrationPkgJSON();
		for (const integration of integrations) {
			const readme = this.#processReadme(integration.name, integration.readme);
			await this.#writeReadme(integration.name, readme);
		}
	}
}

const builder = new IntegrationPagesBuilder({
	githubToken: process.env.GITHUB_TOKEN,
});
builder.run();

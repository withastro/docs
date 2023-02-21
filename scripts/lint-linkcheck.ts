import { LinkCheckerOptions, LinkCheckerState } from './lib/linkcheck/base/base';
import { CanonicalUrl } from './lib/linkcheck/checks/canonical-url';
import { GoodLabels } from './lib/linkcheck/checks/good-link-label';
import { RelativeUrl } from './lib/linkcheck/checks/relative-url';
import { SameLanguage } from './lib/linkcheck/checks/same-language';
import { TargetExists } from './lib/linkcheck/checks/target-exists';
import { getPagePathnamesFromSitemap, parsePages } from './lib/linkcheck/steps/build-index';
import { addSourceFileAnnotations, findLinkIssues } from './lib/linkcheck/steps/find-issues';
import { handlePossibleAutofix } from './lib/linkcheck/steps/optional-autofix';
import { outputAnnotationsForGitHub, outputIssues } from './lib/linkcheck/steps/output-issues';

/**
 * Contains all link checking logic.
 */
class LinkChecker {
	readonly options: LinkCheckerOptions;
	readonly state: LinkCheckerState;

	constructor(options: LinkCheckerOptions) {
		this.options = options;
		this.state = new LinkCheckerState();
	}

	/**
	 * Checks all pages referenced by the sitemap for link issues
	 * and outputs the result to the console.
	 */
	run() {
		const options = this.options;
		const state = this.state;

		// Get the pathnames of all content pages from the sitemap contained in the build output
		const pagePathnames = getPagePathnamesFromSitemap(options);

		// Parse all pages referenced by the sitemap and build an index of their contents
		const allPages = parsePages(pagePathnames, options);

		// Find all link issues
		const linkIssues = findLinkIssues(allPages, options, state);

		// If issues were found, let our caller know through the process exit code
		process.exitCode = linkIssues.length > 0 ? 1 : 0;

		// Try to annotate all found issues with their Markdown source code locations
		addSourceFileAnnotations(linkIssues, options);

		// Output all found issues to the console
		outputIssues(linkIssues, state);

		// Run autofix logic
		const performedAutofix = handlePossibleAutofix(linkIssues, options, state);
		if (performedAutofix) {
			// If we just performed an autofix, repeat our entire run
			// to show the user what's left for them to fix manually
			this.run();
			return;
		}

		// If we're being run by a CI workflow, output annotations in GitHub format
		if (process.env.CI) {
			outputAnnotationsForGitHub(linkIssues);
		}
	}
}

// Use our class to check for link issues
const linkChecker = new LinkChecker({
	baseUrl: 'https://docs.astro.build',
	buildOutputDir: './dist',
	pageSourceDir: './src/content/docs',
	checks: [
		new TargetExists(),
		new SameLanguage({
			ignoredLinkPathnames: ['/lighthouse/'],
		}),
		new CanonicalUrl({
			ignoreMissingCanonicalUrl: ['/lighthouse/'],
		}),
		new RelativeUrl(),
		new GoodLabels(),
	],
	autofix: process.argv.includes('--autofix') || Boolean(process.env.npm_config_autofix),
});

linkChecker.run();

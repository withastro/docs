import path from 'path';
import fs from 'fs';
import kleur from 'kleur';
import core from '@actions/core';
import { dedentMd, formatCount } from './lib/output.mjs';
import { AllPagesByPathname, HtmlPage } from './lib/linkcheck/base/page';
import { IssueType, LinkIssue, SourceFileAnnotation } from './lib/linkcheck/base/issue';
import { CheckBase } from './lib/linkcheck/base/check';
import { TargetExists } from './lib/linkcheck/checks/target-exists';
import { SameLanguage } from './lib/linkcheck/checks/same-language';
import { CanonicalUrl } from './lib/linkcheck/checks/canonical-url.js';
import { RelativeUrl } from './lib/linkcheck/checks/relative-url.js';

interface LinkCheckerOptions {
	baseUrl: string;
	buildOutputDir: string;
	pageSourceDir: string;
	checks: CheckBase[];
	autofix?: boolean;
}

/**
 * Contains all link checking logic.
 */
class LinkChecker {
	readonly baseUrl: string;
	readonly buildOutputDir: string;
	readonly pageSourceDir: string;
	readonly checks: CheckBase[];
	autofix: boolean;
	autofixedCount = 0;
	readonly autofixedPathnameHrefs = new Set<string>();

	constructor ({
		baseUrl,
		buildOutputDir,
		pageSourceDir,
		checks,
		autofix = false
	}: LinkCheckerOptions) {
		this.baseUrl = baseUrl;
		this.buildOutputDir = buildOutputDir;
		this.pageSourceDir = pageSourceDir;
		this.checks = checks;
		this.autofix = autofix;
	}

	/**
	 * Checks all pages referenced by the sitemap for link issues
	 * and outputs the result to the console.
	 */
	run () {
		// Get the pathnames of all content pages from the sitemap contained in the build output
		const pagePathnames = this.getPagePathnamesFromSitemap();

		// Parse all pages referenced by the sitemap and build an index of their contents
		const allPages = this.parsePages(pagePathnames);

		// Find all link issues
		const linkIssues = this.findLinkIssues(allPages);
		
		// If issues were found, let our caller know through the process exit code
		process.exitCode = linkIssues.length > 0 ? 1 : 0;

		// Attempt to locate the source file lines that caused the issues we found
		// and add them to the respective link issues
		this.addSourceFileAnnotations(linkIssues);

		// Output all issues found in the parsed HTML files to the console
		this.outputIssues(linkIssues);

		// Run autofix logic
		const performedAutofix = this.handlePossibleAutofix(linkIssues);
		if (performedAutofix) {
			// If we just performed an autofix, repeat our entire run
			// to show the user what's left for them to fix manually
			this.run();
			return;
		}

		// If we're being run by a CI workflow, output annotations in GitHub format
		if (process.env.CI) {
			this.outputAnnotationsForGitHub(linkIssues);
		}
	}

	/**
	 * Reads the `sitemap.xml` from the build output and extracts all unique pathnames.
	 */
	private getPagePathnamesFromSitemap () {
		const sitemapFilePath = path.join(this.buildOutputDir, 'sitemap.xml');
		const sitemap = fs.readFileSync(sitemapFilePath, 'utf8');
		const sitemapRegex = new RegExp(`<loc>${this.baseUrl}(/.*?)</loc>`, 'ig');
		const uniquePagePaths = [...new Set(Array.from(
			sitemap.matchAll(sitemapRegex),
			m => m[1]
		))];

		return uniquePagePaths;
	}

	/**
	 * Parses multiple HTML pages based on their pathnames and builds an index of their contents.
	 */
	private parsePages (pathnames: string[]): AllPagesByPathname {
		const pages: AllPagesByPathname = {};
		pathnames.forEach(pathname => {
			pages[pathname] = this.parsePage(pathname);
		});

		return pages;
	}

	/**
	 * Parses an HTML page based on its pathname and builds an index of its contents.
	 */
	private parsePage (pathname: string): HtmlPage {
		// Determine the html file path and full page URL from the given pathname
		const htmlFilePath = this.pathnameToHtmlFilePath(pathname);
		const href = this.pathnameToHref(pathname);
		
		try {
			// Attempt to load the HTML file and create a page instance to parse it
			const html = fs.readFileSync(htmlFilePath, 'utf8');
			const htmlPage = new HtmlPage({ html, href, pathname });

			// Do not allow pages without main content unless they are a redirect
			if (!htmlPage.isRedirect && !htmlPage.mainContent)
				throw new Error('Failed to find main content - page has no <article> or <body>');
			
			// Do not allow pages without a main content "lang" attribute unless they are a redirect
			if (!htmlPage.isRedirect && !htmlPage.mainContentLang)
				throw new Error('Failed to find "lang" attribute of main content');

			return htmlPage;

		} catch (err: unknown) {
			throw new Error(dedentMd`Error parsing HTML file "${htmlFilePath}"
				referenced by sitemap: ${err instanceof Error ? err.message : err}`);
		}
	}

	/**
	 * Goes through all pre-parsed and indexed pages, runs all configured checks,
	 * and returns an array containing all link issues (if any).
	 */
	private findLinkIssues (allPages: AllPagesByPathname) {
		var linkIssues: LinkIssue[] = [];

		Object.values(allPages).forEach(page => {
			this.checks.forEach(check => {
				check.checkHtmlPage({
					allPages,
					baseUrl: this.baseUrl,
					page,
					report: (issueData) => {
						// Do not add the issue found in the HTML build output
						// if it was just autofixed in the source file
						if (this.autofixedCount > 0) {
							const wasAutofixedInSource = this.autofixedPathnameHrefs.has(
								`${page.pathname},${issueData.linkHref}`);
							if (wasAutofixedInSource)
								return;
						}

						linkIssues.push({
							...issueData,
							page,
							check,
							sourceFileAnnotations: [],
						});
					},
				});
			});
		});
		
		return linkIssues;
	}

	private addSourceFileAnnotations (linkIssues: LinkIssue[]) {
		// Collect all unique pathnames that had link issues
		const pathnames = new Set(linkIssues.map(linkIssue => linkIssue.page.pathname));

		// Go through the collected pathnames
		pathnames.forEach(pathname => {
			// Try to find the Markdown source file for the current pathname
			let sourceFilePath = this.tryFindSourceFileForPathname(pathname) || '';

			// If we could not find the source file, we can't create annotations for it
			if (!sourceFilePath)
				return;

			// Load the source file
			sourceFilePath = sourceFilePath.replace(/\\/g, '/');
			const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');
			const lines = sourceFileContents.split(/\r?\n/);

			// Try to locate all link issues in the source file and output error annotations
			// including line and column numbers
			const linkIssuesOnCurrentPage = linkIssues
				.filter(linkIssue => linkIssue.page.pathname === pathname);
			lines.forEach((line, idx) => {
				const lineNumber = idx + 1;
				linkIssuesOnCurrentPage.forEach(linkIssue => {
					const startColumn = this.indexOfHref(line, linkIssue.linkHref);
					if (startColumn === -1)
						return;
					
					// Add the source file annotation
					let message = dedentMd`${linkIssue.type.formatTitle()}
						in ${sourceFilePath}, line ${lineNumber}:
						${linkIssue.annotationText || linkIssue.linkHref}`;
					if (linkIssue.autofixHref) {
						message += ` Suggested fix: ${linkIssue.autofixHref}`;
					}
					linkIssue.sourceFileAnnotations.push({
						message,
						location: {
							file: sourceFilePath,
							startLine: lineNumber,
							startColumn,
							endColumn: startColumn + linkIssue.linkHref.length
						}
					});
				});
			});
		});
	}

	/**
	 * Outputs the result of the link check to the console.
	 */
	private outputIssues (linkIssues: LinkIssue[]) {
		if (!linkIssues.length) {
			console.log(kleur.green().bold('*** Found no link issues. Great job!'));
			console.log();
			return;
		}

		// Output all link issues one by one
		let totalIssues = 0;
		let issuesNotFoundInSource = 0;
		let lastPage: HtmlPage;
		linkIssues.forEach(linkIssue => {
			if (lastPage !== linkIssue.page) {
				console.log(`\n${linkIssue.page.pathname}`);
				lastPage = linkIssue.page;
			}
			const sourceLocations = linkIssue.sourceFileAnnotations.length;
			totalIssues += sourceLocations || 1;
			if (!sourceLocations)
				issuesNotFoundInSource++;
			console.log(`  ${linkIssue.type.prefix} ${linkIssue.linkHref}` +
				(linkIssue.autofixHref ? ` --> ${linkIssue.autofixHref}` : '') +
				(sourceLocations > 1 ? kleur.gray(` (${sourceLocations}x)`) : '') +
				(!sourceLocations ? kleur.yellow().bold(` (not found in Markdown source)`) : '')
			);
		});
		console.log();

		// Output a summary with issue counts by type
		const summary = [
			!this.autofixedCount ?
				`*** Found ${formatCount(totalIssues, 'link issue(s)')}:` :
				`*** Found ${formatCount(totalIssues, 'remaining link issue(s)')} after autofix:`,
		];
		const sortedIssues = [...linkIssues];
		sortedIssues.sort((a, b) => a.type.sortOrder - b.type.sortOrder);
		const issueCountByType = new Map<IssueType, number>();
		sortedIssues.forEach(({ type, sourceFileAnnotations }) => {
			const occurrences = sourceFileAnnotations.length || 1;
			issueCountByType.set(type, (issueCountByType.get(type) || 0) + occurrences);
		});
		issueCountByType.forEach((count, type) => {
			summary.push(`  ${type.prefix} ${type.formatTitle(count)}`);
		});

		// Output a summary with issue counts by type
		console.log(kleur.white().bold(summary.filter(line => line).join('\n')));
		console.log();

		if (issuesNotFoundInSource > 0) {
			let warningText = dedentMd`*** Warning:
				${formatCount(issuesNotFoundInSource, 'issue was|issues were')}
				found in the build output, but not the Markdown source.
				
				If you just changed or autofixed the source, please perform a fresh build.

				If not, search for issues in non-Markdown sources (e.g. components, HTML).`;
			console.log(kleur.yellow().bold(warningText.split('\n\n').join('\n    ')));
			console.log();
		}
	}

	private handlePossibleAutofix (linkIssues: LinkIssue[]): boolean {
		// If this is true, we've been called from the second `run()` pass
		// after an autofix and can now inform the user about the result
		if (this.autofixedCount > 0) {
			console.log(kleur.magenta().bold(
				kleur.inverse(' Autofix complete ') + ' ' +
				`${formatCount(this.autofixedCount, 'issue was|issues were')} autofixed. ` +
				(linkIssues.length > 0 ?
					`Any issues above must be fixed manually.` :
					`There's nothing left to do!`
				)
			));
			console.log();
			return false;
		}

		// No need to do anything if we didn't find any issues
		if (!linkIssues.length)
			return false;
		
		// Count issues that can be autofixed
		const autofixCount = linkIssues.reduce((prev, linkIssue) =>
			prev + (linkIssue.autofixHref ? linkIssue.sourceFileAnnotations.length : 0), 0);
		
		// Skip autofix if it wasn't requested
		if (!this.autofix) {
			// Before skipping, promote the autofix option if available
			if (autofixCount > 0) {
				console.log(kleur.magenta().bold(
					kleur.inverse(' Autofix available ') + ' ' +
					dedentMd`${formatCount(autofixCount, 'issue(s)')}
						can be fixed automatically with "--autofix".`
				));
				console.log();
			}
			return false;
		}

		// Give feedback if a requested autofix is not available for the found issues
		if (!autofixCount) {
			console.log(kleur.magenta().bold(
				kleur.inverse(' Autofix unavailable ') + ' ' +
				`Autofix was requested, but there are no autofixable issues.`
			));
			console.log();
			return false;
		}

		// Autofix is enabled, so go through all source file that contain autofixable issues
		const sourceFilesWithAutofixes = new Set(linkIssues.flatMap(linkIssue =>
			linkIssue.autofixHref &&
			linkIssue.sourceFileAnnotations.map(annotation => annotation.location.file)
		));

		console.log(kleur.magenta().bold(
			kleur.inverse(' Starting autofix ') + ' ' +
			dedentMd`Autofixing ${formatCount(autofixCount, 'issue(s)')}
				in ${formatCount(sourceFilesWithAutofixes.size, 'source file(s)')}...`
		));
		console.log();

		sourceFilesWithAutofixes.forEach(sourceFilePath => {
			if (!sourceFilePath)
				return;
			this.autofixIssuesInSourceFile(sourceFilePath, linkIssues);
		});

		// Remember that we performed an autofix
		this.autofixedCount = autofixCount;

		console.log(kleur.magenta().bold(
			kleur.inverse(' Checking result ') + ' ' +
			dedentMd`Scanning for remaining issues after autofix...`
		));

		// Return true to trigger a new `run()` pass
		return true;
	}

	private autofixIssuesInSourceFile (sourceFilePath: string, linkIssues: LinkIssue[]) {
		const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');

		// Split the source file into lines, but this time also capture the line separators
		// in the array, allowing us to put the file back together after autofixing
		// without modifying the line separators
		const linesAndNewlines = sourceFileContents.split(/(\r?\n)/);

		linkIssues.forEach(linkIssue => {
			if (!linkIssue.autofixHref)
				return;
			
			linkIssue.sourceFileAnnotations.forEach(annotation => {
				if (annotation.location.file !== sourceFilePath)
					return;
				if (annotation.location.startLine === undefined)
					return;
				
				// Remember that we performed an autofix for this link issue
				this.autofixedPathnameHrefs.add(`${linkIssue.page.pathname},${linkIssue.linkHref}`);
				
				// Convert startLine to a zero-based `linesAndNewlines` index
				const lineIndex = (annotation.location.startLine - 1) * 2;

				// Replace all occurrences of linkHref with autofixHref
				linesAndNewlines[lineIndex] = this.replaceHrefs(
					linesAndNewlines[lineIndex],
					linkIssue.linkHref,
					linkIssue.autofixHref!
				);
			});
		});

		// Put the autofixed contents back together, retaining the exact newlines we captured,
		// and update the source file with the new contents
		const autofixedSourceFileContents = linesAndNewlines.join('');
		if (sourceFileContents === autofixedSourceFileContents)
			throw new Error(`Failed to autofix "${sourceFilePath}": File contents did not change`);
		fs.writeFileSync(sourceFilePath, autofixedSourceFileContents);
	}

	private outputAnnotationsForGitHub (linkIssues: LinkIssue[]) {
		// Instruct the user to check the logs if there are too many annotations
		// (GitHub does not display more than 10)
		const annotationCount = linkIssues.reduce((prev, linkIssue) =>
			prev + (linkIssue.sourceFileAnnotations.length || 1), 0);
		if (annotationCount > 10) {
			core.error(`Found ${annotationCount} link issues, please check the log to see them all`);
		}

		// Now output all line annotations
		linkIssues.forEach(linkIssue => {
			linkIssue.sourceFileAnnotations.forEach(annotation => {
				core.error(annotation.message, annotation.location)
			});

			// Also output an error if no annotations were found for a link issue
			if (!linkIssue.sourceFileAnnotations.length) {
				let message = dedentMd`${linkIssue.type.formatTitle()} in HTML page
					at "${linkIssue.page.pathname}", unknown source location:
					${linkIssue.annotationText || linkIssue.linkHref}`;
				if (linkIssue.autofixHref) {
					message += ` Suggested fix: ${linkIssue.autofixHref}`;
				}
				core.error(message);
			}
		});
	}

	private pathnameToHref (pathname: string) {
		const url = new URL(pathname, this.baseUrl);
		return url.href;
	}

	private pathnameToHtmlFilePath (pathname: string) {
		return path.join(this.buildOutputDir, pathname, 'index.html');
	}

	/**
	 * Attempts to find a Markdown source file for the given `pathname`.
	 * 
	 * Example: Given a pathname of `/en/some-page` or `/en/some-page/`,
	 * searches for the source file in the following locations
	 * and returns the first matching path:
	 * - `${this.pageSourceDir}/en/some-page.md`
	 * - `${this.pageSourceDir}/en/some-page/index.md`
	 * 
	 * If no existing file is found, returns `undefined`.
	 */
	private tryFindSourceFileForPathname (pathname: string) {
		const possibleSourceFilePaths = [
			path.join(this.pageSourceDir, pathname, '.') + '.md',
			path.join(this.pageSourceDir, pathname, 'index.md'),
		];
		return possibleSourceFilePaths.find(possiblePath => fs.existsSync(possiblePath));
	}

	/**
	 * Attempts to find the given link `href` inside `input` and returns its index on a match.
	 * 
	 * Prevents false positive partial matches (like an href of `/en/install` matching
	 * an input containing `/en/install/auto`) by requiring the characters surrounding a match
	 * not to be a part of URLs in Markdown.
	 */
	private indexOfHref (input: string, href: string, startIndex?: number) {
		let i = input.indexOf(href, startIndex);
		while (i !== -1) {
			// Get the characters surrounding the current match (if any)
			let charBefore = input[i - 1] || '';
			let charAfter = input[i + href.length] || '';
			// If both characters are not a part of URLs in Markdown,
			// we have a proper (non-partial) match, so return the index
			if ((charBefore + charAfter).match(/^[\s"'()[\],.]*$/))
				return i;
			// Otherwise, keep searching for other matches
			i = input.indexOf(href, i + 1);
		}
		return -1;
	}

	/**
	 * Uses `indexOfHref` to find all occurrences of `findHref` in the given `input`
	 * and replaces them with `replaceWithHref`.
	 */
	private replaceHrefs (input: string, findHref: string, replaceWithHref: string) {
		let i = this.indexOfHref(input, findHref);
		while (i !== -1) {
			input = input.slice(0, i) + replaceWithHref + input.slice(i + findHref.length);
			i = this.indexOfHref(input, findHref, i + 1 + replaceWithHref.length);
		}
		return input;
	}
}

// Use our class to check for link issues
const linkChecker = new LinkChecker({
	baseUrl: 'https://docs.astro.build',
	buildOutputDir: './dist',
	pageSourceDir: './src/pages',
	checks: [
		new TargetExists(),
		new SameLanguage({
			ignoredLinkPathnames: [
				'/lighthouse/',
			],
		}),
		new CanonicalUrl({
			ignoreMissingCanonicalUrl: [
				'/lighthouse/',
			],
		}),
		new RelativeUrl(),
	],
	autofix: process.argv.includes('--autofix'),
});

linkChecker.run();

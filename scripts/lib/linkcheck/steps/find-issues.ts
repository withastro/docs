import fs from 'fs';
import path from 'path';
import { dedentMd } from '../../output.mjs';
import { indexOfHref, LinkCheckerOptions, LinkCheckerState } from '../base/base';
import type { LinkIssue } from '../base/issue';
import type { AllPagesByPathname, HtmlPage } from '../base/page';

/**
 * Goes through all pre-parsed and indexed pages, runs all configured checks,
 * and returns an array containing all link issues (if any).
 */
export function findLinkIssues(
	allPages: AllPagesByPathname,
	options: LinkCheckerOptions,
	state: LinkCheckerState
) {
	const linkIssues: LinkIssue[] = [];

	Object.values(allPages).forEach((page) => {
		linkIssues.push(...findLinkIssuesOnPage(page, allPages, options, state));
	});

	return linkIssues;
}

function findLinkIssuesOnPage(
	page: HtmlPage,
	allPages: AllPagesByPathname,
	options: LinkCheckerOptions,
	state: LinkCheckerState,
	checkSingleLinkHref?: string
) {
	const linkIssues: LinkIssue[] = [];

	options.checks.forEach((check) => {
		check.checkHtmlPage({
			allPages,
			baseUrl: options.baseUrl,
			page,
			checkSingleLinkHref,
			report: (issueData) => {
				// Do not add the issue found in the HTML build output
				// if it was just autofixed in the source file
				if (state.autofixedCount > 0) {
					const wasAutofixedInSource = state.autofixedPathnameHrefs.has(
						`${page.pathname},${issueData.linkHref}`
					);
					if (wasAutofixedInSource) return;
				}

				// If the report contains an autofix suggestion, perform a recursive call
				// limited to this suggestion to ensure that it doesn't cause new issues
				if (issueData.autofixHref && !checkSingleLinkHref) {
					const autofixLinkIssues = findLinkIssuesOnPage(
						page,
						allPages,
						options,
						state,
						issueData.autofixHref
					);
					// Remove the autofix suggestion if it would still cause issues
					if (autofixLinkIssues.length > 0) {
						issueData.autofixHref = undefined;
					}
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

	return linkIssues;
}

/**
 * Attempts to locate the source file lines that caused the given link issues,
 * creates annotations for those lines, and adds them to the issues.
 */
export function addSourceFileAnnotations(linkIssues: LinkIssue[], options: LinkCheckerOptions) {
	// Collect all unique pathnames that had link issues
	const pathnames = new Set(linkIssues.map((linkIssue) => linkIssue.page.pathname));

	// Go through the collected pathnames
	pathnames.forEach((pathname) => {
		// Try to find the Markdown source file for the current pathname
		let sourceFilePath = tryFindSourceFileForPathname(pathname, options.pageSourceDir) || '';

		// If we could not find the source file, we can't create annotations for it
		if (!sourceFilePath) return;

		// Load the source file
		sourceFilePath = sourceFilePath.replace(/\\/g, '/');
		const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');
		const lines = sourceFileContents.split(/\r?\n/);

		// Try to locate all link issues in the source file and output error annotations
		// including line and column numbers
		const linkIssuesOnCurrentPage = linkIssues.filter(
			(linkIssue) => linkIssue.page.pathname === pathname
		);
		lines.forEach((line, idx) => {
			const lineNumber = idx + 1;
			linkIssuesOnCurrentPage.forEach((linkIssue) => {
				const startColumn = indexOfHref(line, linkIssue.linkHref);
				if (startColumn === -1) return;

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
						endColumn: startColumn + linkIssue.linkHref.length,
					},
				});
			});
		});
	});
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
export function tryFindSourceFileForPathname(pathname: string, pageSourceDir: string) {
	const possibleSourceFilePaths = [
		path.join(pageSourceDir, pathname, '.') + '.md',
		path.join(pageSourceDir, pathname, 'index.md'),
		path.join(pageSourceDir, pathname, '.') + '.mdx',
		path.join(pageSourceDir, pathname, 'index.mdx'),
	];
	return possibleSourceFilePaths.find((possiblePath) => fs.existsSync(possiblePath));
}

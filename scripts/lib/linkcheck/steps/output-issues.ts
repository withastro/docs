import core from '@actions/core';
import kleur from 'kleur';
import { dedentMd, formatCount } from '../../output.mjs';
import type { LinkCheckerState } from '../base/base';
import type { IssueType, LinkIssue } from '../base/issue';
import type { HtmlPage } from '../base/page';

/**
 * Outputs the result of the link check to the console.
 */
export function outputIssues(linkIssues: LinkIssue[], state: LinkCheckerState) {
	// Add an empty line between the build output and our first output
	if (!state.autofixedCount && !process.env.npm_lifecycle_event?.includes('nobuild')) {
		console.log();
	}

	if (!linkIssues.length) {
		console.log(kleur.green().bold('*** Found no link issues. Great job!'));
		console.log();
		return;
	}

	// Output all link issues one by one
	let totalIssues = 0;
	let issuesNotFoundInSource = 0;
	let lastPage: HtmlPage;
	linkIssues.forEach((linkIssue) => {
		if (lastPage !== linkIssue.page) {
			if (lastPage) {
				console.log();
			}
			console.log(linkIssue.page.pathname);
			lastPage = linkIssue.page;
		}
		const sourceLocations = linkIssue.sourceFileAnnotations.length;
		totalIssues += sourceLocations || 1;
		if (!sourceLocations) issuesNotFoundInSource++;
		console.log(
			`  ${linkIssue.type.prefix} ${linkIssue.linkHref}` +
				(linkIssue.autofixHref ? ` --> ${linkIssue.autofixHref}` : '') +
				(sourceLocations > 1 ? kleur.gray(` (${sourceLocations}x)`) : '') +
				(!sourceLocations ? kleur.yellow().bold(` (not found in Markdown source)`) : '')
		);
	});
	console.log();

	// Output a summary with issue counts by type
	const summary = [
		!state.autofixedCount
			? `*** Found ${formatCount(totalIssues, 'link issue(s)')}:`
			: `*** Found ${formatCount(totalIssues, 'remaining link issue(s)')} after autofix:`,
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
	console.log(kleur.white().bold(summary.filter((line) => line).join('\n')));
	console.log();

	if (issuesNotFoundInSource > 0) {
		const warningText = dedentMd`*** Warning:
			${formatCount(issuesNotFoundInSource, 'issue was|issues were')}
			found in the build output, but not the Markdown source.
			
			If you just changed or autofixed the source, please perform a fresh build.

			If not, search for issues in non-Markdown sources (e.g. components, HTML).`;
		console.log(kleur.yellow().bold(warningText.split('\n\n').join('\n    ')));
		console.log();
	}
}

export function outputAnnotationsForGitHub(linkIssues: LinkIssue[]) {
	// Instruct the user to check the logs if there are too many annotations
	// (GitHub does not display more than 10)
	const annotationCount = linkIssues.reduce(
		(prev, linkIssue) => prev + (linkIssue.sourceFileAnnotations.length || 1),
		0
	);
	if (annotationCount > 10) {
		core.error(`Found ${annotationCount} link issues, please check the log to see them all`);
	}

	// Now output all line annotations
	linkIssues.forEach((linkIssue) => {
		linkIssue.sourceFileAnnotations.forEach((annotation) => {
			core.error(annotation.message, annotation.location);
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

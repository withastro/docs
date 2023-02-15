import fs from 'fs';
import kleur from 'kleur';
import { dedentMd, formatCount } from '../../output.mjs';
import { LinkCheckerOptions, LinkCheckerState, replaceHrefs } from '../base/base';
import type { LinkIssue } from '../base/issue';

/**
 * Handle all autofix-related tasks:
 *
 * - Promote the autofix option if autofixable issues were found, but no autofix was requested.
 * - If autofix was requested, perform it, and return `true` to cause a second `run()` pass.
 * - In the second `run()` after an autofix, inform the user about the result.
 */
export function handlePossibleAutofix(
	linkIssues: LinkIssue[],
	options: LinkCheckerOptions,
	state: LinkCheckerState
): boolean {
	// If we've been called from the second `run()` pass after an autofix,
	// inform the user about the result
	if (state.autofixedCount > 0) {
		const todos =
			linkIssues.length > 0
				? `Any remaining issues above must be fixed manually.`
				: `There's nothing left to do!`;
		outputAutofixMessage(
			'Autofix complete',
			`${formatCount(state.autofixedCount, 'issue was|issues were')} autofixed. ${todos}`
		);
		return false;
	}

	// No need to do anything if we didn't find any issues
	if (!linkIssues.length) return false;

	// Count issues that can be autofixed
	const autofixCount = linkIssues.reduce(
		(prev, linkIssue) =>
			prev + (linkIssue.autofixHref ? linkIssue.sourceFileAnnotations.length : 0),
		0
	);

	// Skip autofix if it wasn't requested
	if (!options.autofix) {
		// Before skipping, promote the autofix option if available
		if (autofixCount > 0) {
			outputAutofixMessage(
				'Autofix available',
				dedentMd`${formatCount(autofixCount, 'issue(s)')}
					can be fixed automatically with "--autofix".`
			);
		}
		return false;
	}

	// Give feedback if a requested autofix is not available for the found issues
	if (!autofixCount) {
		outputAutofixMessage(
			'Autofix unavailable',
			'Autofix was requested, but there are no autofixable issues.'
		);
		return false;
	}

	// Autofix is enabled, so go through all source file that contain autofixable issues
	const sourceFilesWithAutofixes = new Set(
		linkIssues.flatMap(
			(linkIssue) =>
				linkIssue.autofixHref &&
				linkIssue.sourceFileAnnotations.map((annotation) => annotation.location.file)
		)
	);

	outputAutofixMessage(
		'Starting autofix',
		dedentMd`Autofixing ${formatCount(autofixCount, 'issue(s)')}
			in ${formatCount(sourceFilesWithAutofixes.size, 'source file(s)')}...`
	);

	sourceFilesWithAutofixes.forEach((sourceFilePath) => {
		if (!sourceFilePath) return;
		autofixIssuesInSourceFile(sourceFilePath, linkIssues, state);
	});

	// Remember that we performed an autofix
	state.autofixedCount = autofixCount;

	outputAutofixMessage('Checking result', 'Scanning for remaining issues after autofix...');

	// Return true to trigger a new `run()` pass
	return true;
}

function autofixIssuesInSourceFile(
	sourceFilePath: string,
	linkIssues: LinkIssue[],
	state: LinkCheckerState
) {
	const sourceFileContents = fs.readFileSync(sourceFilePath, 'utf8');

	// Split the source file into lines, but this time also capture the line separators
	// in the array, allowing us to put the file back together after autofixing
	// without modifying the line separators
	const linesAndNewlines = sourceFileContents.split(/(\r?\n)/);

	linkIssues.forEach((linkIssue) => {
		if (!linkIssue.autofixHref) return;

		linkIssue.sourceFileAnnotations.forEach((annotation) => {
			if (annotation.location.file !== sourceFilePath) return;
			if (annotation.location.startLine === undefined) return;

			// Remember that we performed an autofix for this link issue
			state.autofixedPathnameHrefs.add(`${linkIssue.page.pathname},${linkIssue.linkHref}`);

			// Convert startLine to a zero-based `linesAndNewlines` index
			const lineIndex = (annotation.location.startLine - 1) * 2;

			// Replace all occurrences of linkHref with autofixHref
			linesAndNewlines[lineIndex] = replaceHrefs(
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

function outputAutofixMessage(title: string, message: string) {
	console.log(kleur.magenta().bold(kleur.inverse(` ${title} `) + ' ' + message));
	console.log();
}

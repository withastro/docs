import type { CheckBase } from './check';

export interface LinkCheckerOptions {
	baseUrl: string;
	buildOutputDir: string;
	pageSourceDir: string;
	checks: CheckBase[];
	autofix?: boolean;
}

export class LinkCheckerState {
	autofixedCount = 0;
	readonly autofixedPathnameHrefs = new Set<string>();
}

/**
 * Attempts to find the given link `href` inside `input` and returns its index on a match.
 *
 * Prevents false positive partial matches (like an href of `/en/install` matching
 * an input containing `/en/install/auto`) by requiring the characters surrounding a match
 * not to be a part of URLs in Markdown.
 */
export function indexOfHref(input: string, href: string, startIndex?: number) {
	let i = input.indexOf(href, startIndex);
	while (i !== -1) {
		// Get the characters surrounding the current match (if any)
		const charBefore = input[i - 1] || '';
		const charAfter = input[i + href.length] || '';
		// If both characters are not a part of URLs in Markdown,
		// we have a proper (non-partial) match, so return the index
		if ((charBefore + charAfter).match(/^[\s"'()[\],.]*$/)) return i;
		// Otherwise, keep searching for other matches
		i = input.indexOf(href, i + 1);
	}
	return -1;
}

/**
 * Uses `indexOfHref` to find all occurrences of `findHref` in the given `input`
 * and replaces them with `replaceWithHref`.
 */
export function replaceHrefs(input: string, findHref: string, replaceWithHref: string) {
	let i = indexOfHref(input, findHref);
	while (i !== -1) {
		input = input.slice(0, i) + replaceWithHref + input.slice(i + findHref.length);
		i = indexOfHref(input, findHref, i + 1 + replaceWithHref.length);
	}
	return input;
}

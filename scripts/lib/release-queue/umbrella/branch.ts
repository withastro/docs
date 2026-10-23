// What the reserved prefix of umbrella branches means.

import { STABLE_BRANCH, UMBRELLA_BRANCH_PREFIX } from '../config.ts';

/**
 * Whether a branch is an umbrella branch, by its reserved prefix.
 *
 * @param {string} branch - The branch name.
 * @returns {boolean} `true` for an umbrella branch.
 */
export function isUmbrellaBranch(branch: string): boolean {
	return branch.startsWith(UMBRELLA_BRANCH_PREFIX);
}

/**
 * Gets the branch a docs PR ships to.
 *
 * @param {string} base - The base of the docs PR.
 * @returns {string} The base itself, or the base of the umbrella when the PR
 *   targets an umbrella branch.
 */
export function getUmbrellaBase(base: string): string {
	return isUmbrellaBranch(base) ? base.slice(UMBRELLA_BRANCH_PREFIX.length) : base;
}

/**
 * Gets the umbrella branch of the umbrella PR merging into a branch.
 *
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @returns {string} The umbrella branch, with its reserved prefix.
 */
export function getUmbrellaBranch(umbrellaBase: string): string {
	return `${UMBRELLA_BRANCH_PREFIX}${umbrellaBase}`;
}

export const STABLE_UMBRELLA_BRANCH = getUmbrellaBranch(STABLE_BRANCH);

import { FRAMEWORK_REPO } from './config.ts';

/** Writes the reference to a PR of `withastro/astro`, which GitHub links. */
export function formatFrameworkReference(prNumber: number): string {
	return `${FRAMEWORK_REPO}#${prNumber}`;
}

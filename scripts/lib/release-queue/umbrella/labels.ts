import {
	ALL_RELEASE_LABELS,
	FALLBACK_RELEASE_LABEL,
	MERGE_ON_RELEASE_LABEL,
	type ReleaseLabel,
} from '../config.ts';

/** Labels to add to an umbrella PR, and release labels to remove from it. */
export interface LabelChanges {
	toAdd: string[];
	toRemove: string[];
}

/**
 * Gets the label changes that give an umbrella PR the label that marks
 * umbrella PRs, and its release label. Other labels, such as the translations
 * label, stay.
 *
 * @param {string[]} current - The labels of the umbrella PR.
 * @param {ReleaseLabel} releaseLabel - The label of the release it ships with.
 * @returns {LabelChanges} The labels to add, and the other release labels to
 *   remove.
 */
export function getLabelChanges(current: string[], releaseLabel: ReleaseLabel): LabelChanges {
	const wanted = [MERGE_ON_RELEASE_LABEL, releaseLabel];
	return {
		toAdd: wanted.filter((label) => !current.includes(label)),
		toRemove: ALL_RELEASE_LABELS.filter(
			(label) => label !== releaseLabel && current.includes(label)
		),
	};
}

/**
 * Gets the label changes of an umbrella whose release can't be followed.
 *
 * @param {string[]} current - The labels of the umbrella PR.
 * @returns {LabelChanges} The label that marks umbrella PRs if missing, and
 *   the fallback release label only when the umbrella has none. Nothing to
 *   remove.
 */
export function getKeptLabelChanges(current: string[]): LabelChanges {
	const hasReleaseLabel = ALL_RELEASE_LABELS.some((label) => current.includes(label));
	return {
		toAdd: [
			...(current.includes(MERGE_ON_RELEASE_LABEL) ? [] : [MERGE_ON_RELEASE_LABEL]),
			...(hasReleaseLabel ? [] : [FALLBACK_RELEASE_LABEL]),
		],
		toRemove: [],
	};
}

/**
 * Gets the labels of an umbrella PR once label changes are applied.
 *
 * @param {string[]} current - The labels of the umbrella PR.
 * @param {LabelChanges} changes - The labels to add and to remove.
 * @returns {string[]} The new labels.
 */
export function applyToLabels(current: string[], { toAdd, toRemove }: LabelChanges): string[] {
	return [...current, ...toAdd].filter((label) => !toRemove.includes(label));
}

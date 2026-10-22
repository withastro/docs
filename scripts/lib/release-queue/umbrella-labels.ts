import {
	ALL_RELEASE_LABELS,
	FALLBACK_RELEASE_LABEL,
	MERGE_ON_RELEASE_LABEL,
	type ReleaseLabel,
} from './config.ts';

/** Labels to add to an umbrella PR, and release labels to remove from it. */
export interface LabelChanges {
	toAdd: string[];
	toRemove: string[];
}

/**
 * Gets the label changes that give an umbrella PR `merge-on-release` and its
 * release label. Other labels, like `i18n`, stay.
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
 * Gets the label changes of an umbrella whose release can't be followed: it
 * keeps its release label, and gets the fallback one only if it has none.
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

/** Gets the labels of an umbrella PR once `changes` are applied. */
export function applyToLabels(current: string[], { toAdd, toRemove }: LabelChanges): string[] {
	return [...current, ...toAdd].filter((label) => !toRemove.includes(label));
}

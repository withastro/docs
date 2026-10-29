import { REVIEW_STATES, type Review } from '../lib/github/repository.ts';
import { formatPrNumbers } from './comments.ts';
import { FRAMEWORK_REPOSITORY, I18N_LABEL, LUNARIA_DIRECTIVE } from './config.ts';
import { readMarker, renderMarker } from './markers.ts';
import type { ReleaseQueueContext } from './run-state.ts';
import type { Umbrella } from './umbrella.ts';

/** In the checklist review. */
const COVERED_PRS_MARKER_NAME = 'release-queue:covered-prs';

type MergeBlockContext = Pick<ReleaseQueueContext, 'reviewer' | 'log'>;

/** What a maintainer checks before merging an umbrella PR. */
export type MergeChecklist = {
	umbrella: Pick<Umbrella, 'number' | 'branches'>;
	/** The framework release PR the umbrella ships with, or `null` when there is none yet. */
	releasePrNumber: number | null;
	isReleaseMerged: boolean;
	/** The open PRs based on the umbrella branch. */
	openPrNumbers: number[];
	includedPrNumbers: number[];
};

/**
 * Blocks the merge of an umbrella PR with a review requesting changes, which
 * holds the checklist to go through before merging.
 *
 * A run without new PRs never blocks the merge again.
 *
 * @param {MergeBlockContext} context - The repository to review with, and where to log.
 * @param {MergeChecklist} checklist - The umbrella, and what its checklist says.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function syncMergeBlockReview(
	{ reviewer, log }: MergeBlockContext,
	checklist: MergeChecklist
): Promise<void> {
	const umbrellaPrNumber = checklist.umbrella.number;
	const checklistBody = renderChecklistReview(checklist);
	const reviews = await reviewer.getReviews(umbrellaPrNumber);
	const latestReview = reviews.filter(({ body }) => readCoveredPrNumbers(body) !== null).at(-1);

	if (shouldBlockAgain(latestReview, checklist.includedPrNumbers)) {
		await reviewer.requestChanges(umbrellaPrNumber, checklistBody);
		log(`Umbrella #${umbrellaPrNumber}: merge blocked by a review.`);
		return;
	}

	if (latestReview && shouldUpdateChecklist(latestReview, checklistBody)) {
		await reviewer.updateReview(umbrellaPrNumber, {
			reviewId: latestReview.id,
			body: checklistBody,
		});
		log(`Umbrella #${umbrellaPrNumber}: merge checklist updated.`);
	}
}

function shouldUpdateChecklist(latestReview: Review, checklistBody: string) {
	return (
		latestReview.state === REVIEW_STATES.changesRequested && latestReview.body !== checklistBody
	);
}

/** Tells whether to request changes: without a checklist review, or after new PRs joined. */
function shouldBlockAgain(latestReview: Review | undefined, includedPrNumbers: number[]) {
	if (!latestReview) return true;
	if (latestReview.state !== REVIEW_STATES.dismissed) return false;

	const coveredPrNumbers = readCoveredPrNumbers(latestReview.body) ?? [];
	return includedPrNumbers.some((prNumber) => !coveredPrNumbers.includes(prNumber));
}

/** Reads the PRs a checklist review covered, or gives `null` for any other review. */
function readCoveredPrNumbers(body: string) {
	const prNumbers = readMarker(COVERED_PRS_MARKER_NAME, body);
	return prNumbers === null ? null : prNumbers.split(',').filter(Boolean).map(Number);
}

function renderChecklistReview(checklist: MergeChecklist) {
	const items = [renderReleaseItem(checklist), renderOpenPrsItem(checklist), renderLunariaItem()];
	const marker = renderMarker(COVERED_PRS_MARKER_NAME, checklist.includedPrNumbers.join(','));
	const paragraphs = [
		`${marker}\nBefore merging this umbrella PR, check the following, then dismiss this review.`,
		items.join('\n'),
	];
	return `${paragraphs.join('\n\n')}\n`;
}

function renderReleaseItem({ releasePrNumber, isReleaseMerged }: MergeChecklist) {
	if (releasePrNumber === null) {
		return renderItem(
			false,
			'The release this umbrella ships with is merged. No release PR is linked yet.'
		);
	}
	return renderItem(
		isReleaseMerged,
		`${FRAMEWORK_REPOSITORY}#${releasePrNumber}, the release this umbrella ships with, is merged.`
	);
}

function renderOpenPrsItem({ umbrella, openPrNumbers }: MergeChecklist) {
	const { branches } = umbrella;
	const requirement = `No open PRs target \`${branches.head}\`.`;
	if (openPrNumbers.length === 0) return renderItem(true, requirement);

	const instruction =
		`Merge them into this umbrella, or change their base to \`${branches.base}\` and rebase them once this umbrella is merged.`;
	return renderItem(
		false,
		`${requirement} Still open: ${formatPrNumbers(openPrNumbers)}. ${instruction}`
	);
}

function renderLunariaItem() {
	return renderItem(
		false,
		`If this PR has the \`${I18N_LABEL}\` label, add the Lunaria directive to the commit body, usually \`${LUNARIA_DIRECTIVE}\`.`
	);
}

function renderItem(isChecked: boolean, text: string) {
	return `- [${isChecked ? 'x' : ' '}] ${text}`;
}

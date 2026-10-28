import { REVIEW_STATES, type GitHubRepository, type Review } from '../lib/github/repository.ts';
import { FRAMEWORK_REPOSITORY, I18N_LABEL, LUNARIA_DIRECTIVE } from './config.ts';
import type { Route } from './umbrella.ts';

/** Names the hidden line of the checklist review, which records the PRs the review covered. */
const CHECKLIST_MARKER_NAME = 'release-queue:merge-checklist';
const CHECKLIST_MARKER = new RegExp(`^<!-- ${CHECKLIST_MARKER_NAME} included=([\\d,]*) -->$`, 'm');

type MergeBlockContext = {
	reviewer: Pick<GitHubRepository, 'getReviews' | 'requestChanges' | 'updateReview'>;
	log: (message: string) => void;
};

/** What a maintainer checks before merging an umbrella PR. */
export type MergeChecklist = {
	route: Route;
	/** The framework release PR the umbrella ships with, or `null` when none is linked yet. */
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
 * A maintainer dismisses the review to merge. Requests changes when the
 * umbrella has no checklist review, or when PRs joined it since the last one
 * was dismissed. Updates the checklist of an active review. Otherwise, changes
 * nothing, so a run without new PRs never blocks the merge again.
 *
 * @param {MergeBlockContext} context - The repository to review with, and where to log.
 * @param {number} umbrellaPrNumber - The number of the umbrella PR.
 * @param {MergeChecklist} checklist - What the checklist says.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function syncMergeBlockReview(
	{ reviewer, log }: MergeBlockContext,
	umbrellaPrNumber: number,
	checklist: MergeChecklist
): Promise<void> {
	const body = renderChecklistReview(checklist);
	const reviews = await reviewer.getReviews(umbrellaPrNumber);
	const latestReview = reviews.filter((review) => CHECKLIST_MARKER.test(review.body)).at(-1);

	if (shouldBlockAgain(latestReview, checklist.includedPrNumbers)) {
		await reviewer.requestChanges(umbrellaPrNumber, body);
		log(`Umbrella #${umbrellaPrNumber}: merge blocked by a review.`);
		return;
	}

	const isActive = latestReview?.state === REVIEW_STATES.changesRequested;
	if (isActive && latestReview.body !== body) {
		await reviewer.updateReview(umbrellaPrNumber, { reviewId: latestReview.id, body });
		log(`Umbrella #${umbrellaPrNumber}: merge checklist updated.`);
	}
}

/** Tells whether to request changes: without a checklist review, or after new PRs joined. */
function shouldBlockAgain(latestReview: Review | undefined, includedPrNumbers: number[]) {
	if (!latestReview) return true;
	if (latestReview.state !== REVIEW_STATES.dismissed) return false;

	const coveredPrNumbers = readCoveredPrNumbers(latestReview.body);
	return includedPrNumbers.some((prNumber) => !coveredPrNumbers.includes(prNumber));
}

function readCoveredPrNumbers(body: string) {
	const [, prNumbers = ''] = body.match(CHECKLIST_MARKER) ?? [];
	return prNumbers.split(',').filter(Boolean).map(Number);
}

function renderChecklistReview(checklist: MergeChecklist) {
	const items = [renderReleaseItem(checklist), renderOpenPrsItem(checklist), renderLunariaItem()];
	const marker = `<!-- ${CHECKLIST_MARKER_NAME} included=${checklist.includedPrNumbers.join(',')} -->`;
	return `${marker}\nBefore merging this umbrella PR, check the following, then dismiss this review.\n\n${items.join('\n')}\n`;
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

function renderOpenPrsItem({ route, openPrNumbers }: MergeChecklist) {
	const requirement = `No open PRs target \`${route.umbrellaBranch}\`.`;
	if (openPrNumbers.length === 0) return renderItem(true, requirement);

	const openPrs = openPrNumbers.map((prNumber) => `#${prNumber}`).join(', ');
	return renderItem(
		false,
		`${requirement} Still open: ${openPrs}. Merge them into this umbrella, or change their base to \`${route.umbrellaBaseBranch}\` and rebase them once this umbrella is merged.`
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

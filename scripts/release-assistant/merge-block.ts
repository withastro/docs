import { REVIEW_STATES, type Review } from '../lib/github/repository.ts';
import { formatPrNumbers } from './comments.ts';
import {
	ACCEPTED_LABEL,
	FRAMEWORK_REPOSITORY,
	I18N_LABEL,
	LUNARIA_DIRECTIVE_EXAMPLE,
	LUNARIA_DIRECTIVE_GUIDE,
} from './config.ts';
import { readMarker, renderMarker } from './markers.ts';
import type { ReleaseAssistantContext } from './run-state.ts';
import type { Umbrella } from './umbrella.ts';

/** In the checklist review. */
const COVERED_PRS_MARKER_NAME = 'release-assistant:covered-prs';

type MergeBlockContext = Pick<ReleaseAssistantContext, 'reviewer' | 'log'>;

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
	const items = [renderReleaseItem(checklist), renderDocsPrsItem(), renderLunariaItem()];
	const marker = renderMarker(COVERED_PRS_MARKER_NAME, checklist.includedPrNumbers.join(','));
	const paragraphs = [
		`${marker}\nReview each item, then dismiss this review before merging.`,
		items.join('\n'),
		...renderOpenPrsWarning(checklist),
	];
	return `${paragraphs.join('\n\n')}\n`;
}

function renderReleaseItem({ releasePrNumber, isReleaseMerged }: MergeChecklist) {
	if (releasePrNumber === null) {
		return renderItem(false, `An associated release PR is open in \`${FRAMEWORK_REPOSITORY}\`.`);
	}
	return renderItem(
		isReleaseMerged,
		`The release ${FRAMEWORK_REPOSITORY}#${releasePrNumber} is merged.`
	);
}

function renderDocsPrsItem() {
	return renderItem(false, 'Every docs PR related to the release is merged.');
}

function renderLunariaItem() {
	return renderItem(
		false,
		`If this PR has the \`${I18N_LABEL}\` label, add a [Lunaria directive](${LUNARIA_DIRECTIVE_GUIDE}) to the commit body when merging (e.g. \`${LUNARIA_DIRECTIVE_EXAMPLE}\`).`
	);
}

/** Lists the open PRs based on the umbrella branch, or nothing when there is none. */
function renderOpenPrsWarning({ umbrella, openPrNumbers }: MergeChecklist) {
	if (openPrNumbers.length === 0) return [];

	const { head, base } = umbrella.branches;
	return [
		`Still open and based on \`${head}\`: ${formatPrNumbers(openPrNumbers)}. Add \`${ACCEPTED_LABEL}\` to merge them into this umbrella PR, or change their base to \`${base}\`.`,
	];
}

function renderItem(isChecked: boolean, text: string) {
	return `- [${isChecked ? 'x' : ' '}] ${text}`;
}

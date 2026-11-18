import {
	ACCEPTED_LABEL,
	FRAMEWORK_REPOSITORY_NAME,
	I18N_LABEL,
	LUNARIA_DIRECTIVE_EXAMPLE,
	LUNARIA_DIRECTIVE_GUIDE,
} from '../config.ts';
import { REVIEW_STATES, type Review } from '../github/reviews.ts';
import type { ReleaseAssistantContext } from '../run.ts';
import { formatPrNumbers } from '../utils/pr-numbers.ts';
import { readMarker, renderMarker } from './markers.ts';
import type { Umbrella } from './umbrella.ts';

/** Records the PRs the checklist review covers. */
const COVERED_PRS_MARKER_NAME = 'release-assistant:covered-prs';
const COVERED_PRS_SEPARATOR = ',';

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
 * Blocks the merge of an umbrella PR with a review that requests changes and
 * holds the merge checklist, or updates the checklist of that review. Once a
 * maintainer dismisses the review, blocks again only when new PRs joined.
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
	return prNumbers === null
		? null
		: prNumbers.split(COVERED_PRS_SEPARATOR).filter(Boolean).map(Number);
}

function renderChecklistReview(checklist: MergeChecklist) {
	const items = [renderReleaseItem(checklist), renderDocsPrsItem(), renderLunariaItem()];
	const marker = renderMarker(
		COVERED_PRS_MARKER_NAME,
		checklist.includedPrNumbers.join(COVERED_PRS_SEPARATOR)
	);
	const paragraphs = [
		`${marker}\nReview each item, then dismiss this review before merging.`,
		items.join('\n'),
		...renderOpenPrsWarning(checklist),
	];
	return `${paragraphs.join('\n\n')}\n`;
}

function renderReleaseItem({ releasePrNumber, isReleaseMerged }: MergeChecklist) {
	if (releasePrNumber === null) {
		return renderItem(`An associated release PR is open in \`${FRAMEWORK_REPOSITORY_NAME}\`.`);
	}
	return renderItem(`The release ${FRAMEWORK_REPOSITORY_NAME}#${releasePrNumber} is merged.`, {
		isChecked: isReleaseMerged,
	});
}

function renderDocsPrsItem() {
	return renderItem('Every docs PR related to the release is merged.');
}

function renderLunariaItem() {
	return renderItem(
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

function renderItem(text: string, { isChecked = false } = {}) {
	return `- [${isChecked ? 'x' : ' '}] ${text}`;
}

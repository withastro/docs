import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { REVIEW_STATES, type Review, type ReviewState } from '../lib/github/repository.ts';
import { FakeRepository, MAIN_BRANCHES } from './fake-repository.ts';
import { syncMergeBlockReview, type MergeChecklist } from './merge-block.ts';

const CHECKLIST: MergeChecklist = {
	umbrella: { number: 50, branches: MAIN_BRANCHES },
	releasePrNumber: 100,
	isReleaseMerged: false,
	openPrNumbers: [],
	includedPrNumbers: [7, 9],
};

function buildBotReview(id: number, state: ReviewState, body: string): Review {
	return { id, user: { login: 'github-actions[bot]' }, state, body, commit_id: 'sha-1' };
}

/** Syncs the review of umbrella #50, and gives the writes and the logs. */
async function sync(reviews: Review[], checklist = CHECKLIST) {
	const reviewer = new FakeRepository({ reviewsByPrNumber: { 50: reviews } });
	const logs: string[] = [];
	await syncMergeBlockReview({ reviewer, log: (message) => logs.push(message) }, checklist);
	return { writes: reviewer.writes, logs };
}

/** Gets the text of the review the bot sends, from a sync without any review yet. */
async function renderReview(checklist = CHECKLIST) {
	const { writes } = await sync([], checklist);
	const [{ args }] = writes;
	return String(args[1]);
}

describe('syncMergeBlockReview', () => {
	it('should request changes when no checklist review exists', async () => {
		const { writes, logs } = await sync([
			{ ...buildBotReview(1, REVIEW_STATES.approved, 'Looks good!'), user: { login: 'someone' } },
		]);

		assert.equal(writes.length, 1);
		assert.equal(writes[0].method, 'requestChanges');
		assert.equal(writes[0].args[0], 50);
		assert.deepEqual(logs, ['Umbrella #50: merge blocked by a review.']);
	});

	it('should update the checklist of the active review when it changed', async () => {
		const previousBody = await renderReview({ ...CHECKLIST, includedPrNumbers: [7] });

		const { writes, logs } = await sync([
			buildBotReview(3, REVIEW_STATES.changesRequested, previousBody),
		]);

		assert.deepEqual(writes, [
			{ method: 'updateReview', args: [50, { reviewId: 3, body: await renderReview() }] },
		]);
		assert.deepEqual(logs, ['Umbrella #50: merge checklist updated.']);
	});

	it('should leave an active review that is up to date', async () => {
		const { writes } = await sync([
			buildBotReview(3, REVIEW_STATES.changesRequested, await renderReview()),
		]);

		assert.deepEqual(writes, []);
	});

	it('should not block again after a dismissal without new PRs', async () => {
		const { writes } = await sync([
			buildBotReview(3, REVIEW_STATES.dismissed, await renderReview()),
		]);

		assert.deepEqual(writes, []);
	});

	it('should block again when a PR joined after the dismissal', async () => {
		const dismissedBody = await renderReview({ ...CHECKLIST, includedPrNumbers: [7] });

		const { writes } = await sync([buildBotReview(3, REVIEW_STATES.dismissed, dismissedBody)]);

		assert.deepEqual(writes, [{ method: 'requestChanges', args: [50, await renderReview()] }]);
	});

	describe('checklist', () => {
		it('should link the release, and tick it once it is merged', async () => {
			assert.match(await renderReview(), /- \[ \] The release withastro\/astro#100 is merged\./);
			assert.match(
				await renderReview({ ...CHECKLIST, isReleaseMerged: true }),
				/- \[x\] The release withastro\/astro#100 is merged\./
			);
		});

		it('should say when no release PR is linked yet', async () => {
			assert.match(
				await renderReview({ ...CHECKLIST, releasePrNumber: null }),
				/- \[ \] An associated release PR is open in `withastro\/astro`\./
			);
		});

		it('should list the open PRs based on the umbrella branch, after the items', async () => {
			assert.doesNotMatch(await renderReview(), /Still open/);
			assert.match(
				await renderReview({ ...CHECKLIST, openPrNumbers: [11, 12] }),
				/\)\.\n\nStill open and based on `umbrella\/main`: #11, #12\. .+\n$/
			);
		});

		it('should always ask to check for translations, with an example Lunaria directive', async () => {
			assert.match(
				await renderReview(),
				/- \[ \] If this PR has the `i18n` label, add a \[Lunaria directive\]\(https:\/\/lunaria\.dev\/.+\) to the commit body when merging \(e\.g\. `@lunaria-track:src\/content\/docs\/en\/\*\*\.mdx`\)\.\n$/
			);
		});
	});
});

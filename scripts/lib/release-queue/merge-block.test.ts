import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { getMergeBlockBody, syncMergeBlockReview } from './merge-block.ts';
import { REPO } from './testing/fixtures.ts';
import { stubGitHub } from './testing/stub-github.ts';
import type { OpenUmbrella } from './umbrella-queries.ts';
import { getUmbrellaBody } from './umbrella.ts';

/** The `main` umbrella #42, linked to release PR #18405. */
const umbrella: OpenUmbrella = {
	number: 42,
	title: '[ci] release astro@7.5.0 docs',
	body: getUmbrellaBody('main', { releasePullRequest: 18405, included: [] }),
	labels: ['merge-on-release', 'minor-release'],
	target: 'main',
	branch: 'release-queue/main',
};

describe('getMergeBlockBody', () => {
	it('checks the linked release PR and the PRs left on the branch', () => {
		assert.equal(
			getMergeBlockBody(umbrella, []),
			[
				'**Before merging**, check:',
				'',
				'- [ ] withastro/astro#18405 is merged.',
				'- [ ] No open PR targets `release-queue/main`.',
				'- [ ] If the umbrella has the `i18n` label, the commit body has a [Lunaria directive](https://lunaria.dev/guides/tracking/#triggering-changes-per-file), for example `@lunaria-track:src/content/docs/en/**.mdx`. The squash commit body is empty by default: add it in the merge dialog.',
				'',
				'Then dismiss this review. The release queue requests changes again if more docs PRs join.',
			].join('\n')
		);
	});

	it('lists the PRs that still target the umbrella branch', () => {
		assert.match(
			getMergeBlockBody(umbrella, [14590, 14591]),
			/- \[ \] These PRs still target `release-queue\/main`: #14590, #14591\. Merge them into the umbrella, or change their base to `main`/
		);
	});

	it('names the release PR generically without a link', () => {
		assert.match(
			getMergeBlockBody({ ...umbrella, body: '' }, []),
			/- \[ \] The `\[ci\] release` PR of `withastro\/astro` this umbrella ships with is merged\./
		);
	});

	it('reminds of the Lunaria directive before the i18n label arrives', () => {
		// `pr-labeler.yml` adds `i18n` after the merge, in a run that doesn't
		// trigger the release queue: the first review is written without it.
		assert.doesNotMatch(umbrella.labels.join(), /i18n/);
		assert.match(
			getMergeBlockBody(umbrella, []),
			/- \[ \] If the umbrella has the `i18n` label, the commit body has a \[Lunaria directive\]/
		);
	});
});

describe('syncMergeBlockReview', () => {
	const reviewsPath = `repos/${REPO}/pulls/42/reviews`;
	const body = getMergeBlockBody(umbrella, []);

	function stub(t: TestContext, reviews: unknown[]) {
		return stubGitHub(t, {
			getResponses: {
				[reviewsPath]: reviews,
				[`repos/${REPO}/pulls?state=open&base=release-queue/main`]: [],
			},
		});
	}

	const review = (id: number, state: string, reviewBody = body, login = 'github-actions[bot]') => ({
		id,
		user: { login },
		state,
		body: reviewBody,
	});

	const submit = {
		method: 'POST',
		path: reviewsPath,
		body: { event: 'REQUEST_CHANGES', body },
	};

	it('requests changes after a join when no review is active', async (t) => {
		const github = stub(t, []);

		await syncMergeBlockReview(github.client(), REPO, umbrella, { shouldBlock: true });

		assert.deepEqual(github.writes, [submit]);
	});

	it('requests changes again after a join once the review was dismissed', async (t) => {
		const github = stub(t, [review(1, 'DISMISSED')]);

		await syncMergeBlockReview(github.client(), REPO, umbrella, { shouldBlock: true });

		assert.deepEqual(github.writes, [submit]);
	});

	it("doesn't block again without a join", async (t) => {
		const github = stub(t, [review(1, 'DISMISSED')]);

		await syncMergeBlockReview(github.client(), REPO, umbrella, { shouldBlock: false });

		assert.deepEqual(github.writes, []);
	});

	it('updates the active review instead of submitting another', async (t) => {
		const github = stub(t, [review(1, 'DISMISSED'), review(2, 'CHANGES_REQUESTED', 'Old')]);

		await syncMergeBlockReview(github.client(), REPO, umbrella, { shouldBlock: true });

		assert.deepEqual(github.writes, [{ method: 'PUT', path: `${reviewsPath}/2`, body: { body } }]);
	});

	it("doesn't write an active review that is up to date", async (t) => {
		// As GitHub may return the body with its line endings changed.
		const github = stub(t, [review(2, 'CHANGES_REQUESTED', body.replaceAll('\n', '\r\n'))]);

		await syncMergeBlockReview(github.client(), REPO, umbrella, { shouldBlock: true });

		assert.deepEqual(github.writes, []);
	});

	it("doesn't count a maintainer's change request as the merge block", async (t) => {
		const github = stub(t, [review(3, 'CHANGES_REQUESTED', 'Fix the typo', 'maintainer')]);

		await syncMergeBlockReview(github.client(), REPO, umbrella, { shouldBlock: true });

		assert.deepEqual(github.writes, [submit]);
	});
});

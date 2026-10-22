import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { refreshOpenUmbrellas, refreshUmbrella } from './refresh.ts';
import { getMainRelease } from './release.ts';
import { pullRequestResponse, REPO, umbrellaResponse } from './testing/fixtures.ts';
import { ACTIONS_TOKEN, BOT_TOKEN, queueOptions } from './testing/queue-options.ts';
import { stubGitHub, type StubOptions, type Write } from './testing/stub-github.ts';
import type { OpenUmbrella } from './umbrella-queries.ts';
import { getUmbrellaBody } from './umbrella.ts';

/** The next release from `main`, with release PR `number` open. */
const releaseWith = (number: number, astroVersion: string) =>
	getMainRelease({
		number,
		versions: [{ name: 'astro', version: astroVersion }],
	});

const noRelease = getMainRelease();

const included = [{ number: 7, title: 'Document the new option' }];

/** The `main` umbrella, up to date with release PR #18405 (`astro@7.5.0`). */
const umbrella: OpenUmbrella = {
	number: 42,
	title: '[ci] release astro@7.5.0 docs',
	body: getUmbrellaBody('main', { releasePullRequest: 18405, included: [] }),
	labels: ['merge-on-release', 'minor-release', 'i18n'],
	target: 'main',
	branch: 'release-queue/main',
};

/** #7 is on the umbrella branch. #3 had the same base in an earlier release. */
const history = (target = 'main') => ({
	[`repos/${REPO}/pulls?state=closed&base=release-queue/${target}`]: [
		pullRequestResponse({ number: 3, title: 'Earlier release', merge_commit_sha: 'old-sha' }),
		pullRequestResponse({ number: 7, title: 'Document the new option', merge_commit_sha: 'sha-7' }),
	],
	[`repos/${REPO}/compare/${target}...release-queue/${target}`]: {
		ahead_by: 1,
		commits: [{ sha: 'sha-7' }],
	},
});

/** No merge-block review on umbrella `number`, and no PR on its branch. */
const reviews = (number: number, target = 'main') => ({
	[`repos/${REPO}/pulls/${number}/reviews`]: [],
	[`repos/${REPO}/pulls?state=open&base=release-queue/${target}`]: [],
});

/** Answers whether release PR `number` of `withastro/astro` is merged. */
const releaseMerged = (number: number, merged: boolean) => ({
	[`repos/withastro/astro/pulls/${number}`]: { number, merged },
});

function stub(t: TestContext, getResponses: StubOptions['getResponses'] = {}) {
	return stubGitHub(t, { getResponses: { ...history(), ...getResponses } });
}

const patchOf = (writes: Write[]) =>
	writes.find(({ method }) => method === 'PATCH')?.body as
		| { title?: string; body?: string }
		| undefined;
const labelWrites = (writes: Write[]) => writes.filter(({ method }) => method !== 'PATCH');

const umbrellaBody = (releasePullRequest?: number) =>
	getUmbrellaBody('main', { releasePullRequest, included });

describe('refreshUmbrella', () => {
	describe('with a release PR open', () => {
		it('links the open release PR of an umbrella without a link', async (t) => {
			const github = stub(t);
			const unlinked = { ...umbrella, body: 'Release umbrella for `main`.' };

			await refreshUmbrella(github.client(), REPO, unlinked, releaseWith(18405, '7.5.0'));

			assert.deepEqual(patchOf(github.writes), { body: umbrellaBody(18405) });
		});

		it('refreshes an umbrella that links the open release PR', async (t) => {
			const github = stub(t);

			await refreshUmbrella(github.client(), REPO, umbrella, releaseWith(18405, '7.5.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
			assert.ok(!github.calls.some(({ path }) => path.startsWith('repos/withastro/astro')));
		});

		it('moves to the open release PR when the linked one is not merged', async (t) => {
			const github = stub(t, releaseMerged(18405, false));

			await refreshUmbrella(github.client(), REPO, umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(patchOf(github.writes), {
				title: '[ci] release astro@7.6.0 docs',
				body: umbrellaBody(18460),
			});
		});

		it('keeps a settled umbrella as it is, but for the list', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refreshUmbrella(github.client(), REPO, umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('follows a release that became a minor', async (t) => {
			const github = stub(t);
			const patchUmbrella = {
				...umbrella,
				title: '[ci] release astro@7.4.2 docs',
				labels: ['merge-on-release', 'patch-release'],
			};

			const refreshed = await refreshUmbrella(
				github.client(),
				REPO,
				patchUmbrella,
				releaseWith(18405, '7.5.0')
			);

			assert.equal(patchOf(github.writes)?.title, '[ci] release astro@7.5.0 docs');
			// The merge-block review reads the umbrella as it is after the refresh.
			assert.deepEqual(refreshed, {
				...patchUmbrella,
				title: '[ci] release astro@7.5.0 docs',
				body: umbrellaBody(18405),
				labels: ['merge-on-release', 'minor-release'],
			});
			assert.deepEqual(labelWrites(github.writes), [
				{
					method: 'POST',
					path: `repos/${REPO}/issues/42/labels`,
					body: { labels: ['minor-release'] },
				},
				{ method: 'DELETE', path: `repos/${REPO}/issues/42/labels/patch-release` },
			]);
		});

		it('treats a link to a release PR that does not exist as not merged', async (t) => {
			// No answer for #18405: GitHub says 404.
			const github = stub(t);

			await refreshUmbrella(github.client(), REPO, umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(patchOf(github.writes), {
				title: '[ci] release astro@7.6.0 docs',
				body: umbrellaBody(18460),
			});
		});

		it('keeps a settled umbrella when the next release is a major', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refreshUmbrella(github.client(), REPO, umbrella, releaseWith(18460, '8.0.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('leaves the main umbrella as it is before a major', async (t) => {
			const github = stub(t);

			const refreshed = await refreshUmbrella(
				github.client(),
				REPO,
				umbrella,
				releaseWith(18405, '8.0.0')
			);

			assert.deepEqual(github.calls, []);
			assert.equal(refreshed, umbrella);
		});
	});

	describe('without a release PR open', () => {
		it('keeps the title, label and link, and rewrites the list', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refreshUmbrella(github.client(), REPO, umbrella, noRelease);

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('keeps an umbrella whose release PR was closed without merging', async (t) => {
			const github = stub(t, releaseMerged(18405, false));

			await refreshUmbrella(github.client(), REPO, umbrella, noRelease);

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('gives a new umbrella its labels and the fallback sentence', async (t) => {
			const github = stub(t);
			const newUmbrella = {
				...umbrella,
				title: '[ci] release main docs',
				body: 'Release umbrella for `main`, managed by the release queue.',
				labels: [],
			};

			await refreshUmbrella(github.client(), REPO, newUmbrella, noRelease);

			assert.deepEqual(patchOf(github.writes), { body: umbrellaBody() });
			assert.deepEqual(labelWrites(github.writes), [
				{
					method: 'POST',
					path: `repos/${REPO}/issues/42/labels`,
					body: { labels: ['merge-on-release', 'patch-release'] },
				},
			]);
		});
	});

	it('refreshes a prerelease umbrella, which always follows', async (t) => {
		const github = stubGitHub(t, { getResponses: history('cloudflare-next') });
		const prerelease: OpenUmbrella = {
			number: 43,
			title: 'Old title',
			body: '',
			labels: [],
			target: 'cloudflare-next',
			branch: 'release-queue/cloudflare-next',
		};

		await refreshUmbrella(github.client(), REPO, prerelease, releaseWith(18405, '7.5.0'));

		assert.deepEqual(patchOf(github.writes), {
			title: '[ci] release cloudflare-next docs',
			body: getUmbrellaBody('cloudflare-next', { included }),
		});
		assert.deepEqual(labelWrites(github.writes), [
			{
				method: 'POST',
				path: `repos/${REPO}/issues/43/labels`,
				body: { labels: ['merge-on-release', 'major-release'] },
			},
		]);
	});

	it("doesn't write an umbrella that is up to date", async (t) => {
		const github = stub(t);
		// As GitHub returns a description edited in the browser.
		const upToDate = { ...umbrella, body: umbrellaBody(18405).replaceAll('\n', '\r\n') };

		await refreshUmbrella(github.client(), REPO, upToDate, releaseWith(18405, '7.5.0'));

		assert.deepEqual(github.writes, []);
	});
});

describe('refreshOpenUmbrellas', () => {
	/**
	 * Open PRs: the `main` and `cloudflare-next` umbrellas, a fork, a PR from an
	 * umbrella branch into another base, and a docs PR.
	 */
	const openPullRequests = {
		[`repos/${REPO}/pulls?state=open`]: [
			umbrellaResponse(),
			umbrellaResponse({ number: 43, target: 'cloudflare-next' }),
			umbrellaResponse({
				number: 44,
				head: { ref: 'release-queue/main', sha: 'fork-sha', repo: { full_name: 'someone/docs' } },
			}),
			umbrellaResponse({ number: 45, base: { ref: 'v6' } }),
			pullRequestResponse(),
		],
		'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/main': [
			{ number: 1, html_url: '', body: '## astro@7.5.0\n' },
		],
		...history(),
		...history('cloudflare-next'),
		...reviews(42),
		...reviews(43, 'cloudflare-next'),
	};

	const refreshedUmbrellas = (writes: Write[]) =>
		[...new Set(writes.map(({ path }) => path.match(/\/(?:pulls|issues)\/(\d+)/)?.[1]))].map(
			Number
		);

	it("doesn't change anything in a dry run", async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(queueOptions(github, 'dry-run'));

		assert.deepEqual(github.writes, []);
	});

	it('refreshes only the main umbrella in main-only mode', async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(queueOptions(github, 'main-only'));

		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42]);
		// Without a join, no merge-block review is requested.
		assert.deepEqual(github.writesBy(ACTIONS_TOKEN), []);
	});

	it('updates an active merge-block review', async (t) => {
		const github = stubGitHub(t, {
			getResponses: {
				...openPullRequests,
				[`repos/${REPO}/pulls/42/reviews`]: [
					{
						id: 1,
						user: { login: 'github-actions[bot]' },
						state: 'CHANGES_REQUESTED',
						body: 'Old',
					},
				],
			},
		});

		await refreshOpenUmbrellas(queueOptions(github, 'main-only'));

		assert.deepEqual(
			github.writesBy(ACTIONS_TOKEN).map(({ method, path }) => `${method} ${path}`),
			[`PUT repos/${REPO}/pulls/42/reviews/1`]
		);
	});

	it('refreshes every umbrella in all mode, but not a fork or another base', async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(queueOptions(github, 'all'));

		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42, 43]);
	});
});

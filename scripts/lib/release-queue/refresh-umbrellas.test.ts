import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { refreshOpenUmbrellas } from './refresh-umbrellas.ts';
import {
	emptyMergeBlockResponses,
	pullRequestResponse,
	REPO,
	umbrellaCommitResponses,
	umbrellaResponse,
} from './testing/fixtures.ts';
import { ACTIONS_TOKEN, BOT_TOKEN, stubRunContext } from './testing/run-context.ts';
import { stubGitHub, type Write } from './testing/stub-github.ts';
import { formatUmbrellaBody } from './umbrella/body.ts';

const included = [7];

describe('refreshOpenUmbrellas', () => {
	/**
	 * Open PRs: the `main` and `cloudflare-next` umbrellas, a fork, a PR from an
	 * umbrella branch into another base, and a docs PR.
	 */
	const openPullRequests = {
		[`repos/${REPO}/pulls?state=open`]: [
			umbrellaResponse(),
			umbrellaResponse({ number: 43, umbrellaBase: 'cloudflare-next' }),
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
		...umbrellaCommitResponses(),
		...umbrellaCommitResponses('cloudflare-next'),
		...emptyMergeBlockResponses(42),
		...emptyMergeBlockResponses(43, 'cloudflare-next'),
	};

	const refreshedUmbrellas = (writes: Write[]) =>
		[...new Set(writes.map(({ path }) => path.match(/\/(?:pulls|issues)\/(\d+)/)?.[1]))].map(
			Number
		);

	it('reads a description edited in the browser as up to date', async (t) => {
		const body = formatUmbrellaBody('main', { releasePrNumber: 1, included });
		const github = stubGitHub(t, {
			getResponses: {
				...openPullRequests,
				[`repos/${REPO}/pulls?state=open`]: [
					umbrellaResponse({
						title: '[ci] release astro@7.5.0 docs',
						labels: [{ name: 'merge-on-release' }, { name: 'minor-release' }],
						// GitHub keeps the line endings of the browser.
						body: body.replaceAll('\n', '\r\n'),
					}),
				],
			},
		});

		await refreshOpenUmbrellas(stubRunContext(github, 'stable-only'));

		assert.deepEqual(github.writes, []);
	});

	it("doesn't change anything in a dry run", async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(stubRunContext(github, 'dry-run'));

		assert.deepEqual(github.writes, []);
	});

	it('refreshes only the main umbrella in stable-only mode', async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(stubRunContext(github, 'stable-only'));

		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42]);
		// Without a join, no merge-block review is requested.
		assert.deepEqual(github.writesBy(ACTIONS_TOKEN), []);
		// The prerelease umbrella is skipped: nothing reads its release PR.
		assert.ok(!github.calls.some(({ path }) => path.includes('.changeset/pre.json')));
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

		await refreshOpenUmbrellas(stubRunContext(github, 'stable-only'));

		assert.deepEqual(
			github.writesBy(ACTIONS_TOKEN).map(({ method, path }) => `${method} ${path}`),
			[`PUT repos/${REPO}/pulls/42/reviews/1`]
		);
	});

	it('refreshes every umbrella in all mode, but not a fork or another base', async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(stubRunContext(github, 'all'));

		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42, 43]);
	});

	it('refreshes the other umbrellas when one fails, then reports it', async (t) => {
		const github = stubGitHub(t, {
			getResponses: openPullRequests,
			writeFailures: { [`PATCH repos/${REPO}/pulls/42`]: { status: 500, message: 'Oops' } },
		});

		await assert.rejects(refreshOpenUmbrellas(stubRunContext(github, 'all')), (error) => {
			assert.ok(error instanceof AggregateError);
			assert.equal(error.message, "Couldn't refresh 1 of 2 umbrella PRs.");
			assert.match(String(error.errors[0]), /Couldn't refresh #42\./);
			return true;
		});
		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42, 43]);
	});
});

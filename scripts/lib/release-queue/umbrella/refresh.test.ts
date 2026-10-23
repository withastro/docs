import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { FRAMEWORK_REPO } from '../config.ts';
import { getStableRelease } from '../release/release.ts';
import { pullRequestResponse, REPO, umbrellaResponse } from '../testing/fixtures.ts';
import { ACTIONS_TOKEN, BOT_TOKEN, createRunContext } from '../testing/run-context.ts';
import { stubGitHub, type StubOptions, type Write } from '../testing/stub-github.ts';
import { formatUmbrellaBody } from './body.ts';
import type { UmbrellaPullRequest } from './queries.ts';
import { refreshOpenUmbrellas, refreshUmbrella } from './refresh.ts';

/** The next release from `main`, with release PR `number` open. */
const releaseWith = (number: number, frameworkVersion: string) =>
	getStableRelease({ number, versions: [{ name: 'astro', version: frameworkVersion }] });

const noRelease = getStableRelease();

const included = [7];

/** The `main` umbrella, up to date with release PR #18405 (`astro@7.5.0`). */
const umbrella: UmbrellaPullRequest = {
	number: 42,
	title: '[ci] release astro@7.5.0 docs',
	body: formatUmbrellaBody('main', { releasePrNumber: 18405, included: [] }),
	labels: ['merge-on-release', 'minor-release', 'i18n'],
	base: 'main',
	branch: 'release-queue/main',
};

/** The squash commit of #7 is on the umbrella branch. */
const history = (umbrellaBase = 'main') => ({
	[`repos/${REPO}/compare/${umbrellaBase}...release-queue/${umbrellaBase}`]: {
		ahead_by: 1,
		commits: [{ commit: { message: 'Document the new option (#7)\n\nDetails.' } }],
	},
});

/** No merge-block review on umbrella `number`, and no PR on its branch. */
const reviews = (number: number, umbrellaBase = 'main') => ({
	[`repos/${REPO}/pulls/${number}/reviews`]: [],
	[`repos/${REPO}/pulls?state=open&base=release-queue/${umbrellaBase}`]: [],
});

/** `next` in prerelease mode, with its release PR `number` open. */
const prereleaseOf = (number: number) => ({
	'repos/withastro/astro/contents/.changeset/pre.json?ref=next': {
		content: Buffer.from('{"mode":"pre"}').toString('base64'),
	},
	'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/next': [
		{ number, body: '' },
	],
});

/** The repositories a refresh reads, from the stub. */
const repositories = (github: ReturnType<typeof stubGitHub>) => ({
	docs: github.repository(),
	framework: github.repository(FRAMEWORK_REPO),
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

const umbrellaBody = (releasePrNumber?: number) =>
	formatUmbrellaBody('main', { releasePrNumber, included });

describe('refreshUmbrella', () => {
	describe('with a release PR open', () => {
		it('links the open release PR of an umbrella without a link', async (t) => {
			const github = stub(t);
			const unlinked = { ...umbrella, body: 'Release umbrella for `main`.' };

			await refreshUmbrella(repositories(github), unlinked, releaseWith(18405, '7.5.0'));

			assert.deepEqual(patchOf(github.writes), { body: umbrellaBody(18405) });
		});

		it('refreshes an umbrella that links the open release PR', async (t) => {
			const github = stub(t);

			await refreshUmbrella(repositories(github), umbrella, releaseWith(18405, '7.5.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
			assert.ok(!github.calls.some(({ path }) => path.startsWith('repos/withastro/astro')));
		});

		it('moves to the open release PR when the linked one is not merged', async (t) => {
			const github = stub(t, releaseMerged(18405, false));

			await refreshUmbrella(repositories(github), umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(patchOf(github.writes), {
				title: '[ci] release astro@7.6.0 docs',
				body: umbrellaBody(18460),
			});
		});

		it('keeps a settled umbrella as it is, but for the list', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refreshUmbrella(repositories(github), umbrella, releaseWith(18460, '7.6.0'));

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
				repositories(github),
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

			await refreshUmbrella(repositories(github), umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(patchOf(github.writes), {
				title: '[ci] release astro@7.6.0 docs',
				body: umbrellaBody(18460),
			});
		});

		it('keeps a settled umbrella when the next release is a major', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refreshUmbrella(repositories(github), umbrella, releaseWith(18460, '8.0.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('leaves the main umbrella as it is before a major', async (t) => {
			const github = stub(t);

			const refreshed = await refreshUmbrella(
				repositories(github),
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

			await refreshUmbrella(repositories(github), umbrella, noRelease);

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('keeps an umbrella whose release PR was closed without merging', async (t) => {
			const github = stub(t, releaseMerged(18405, false));

			await refreshUmbrella(repositories(github), umbrella, noRelease);

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

			await refreshUmbrella(repositories(github), newUmbrella, noRelease);

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
		const github = stubGitHub(t, {
			getResponses: { ...history('cloudflare-next'), ...prereleaseOf(18269) },
		});
		const prerelease: UmbrellaPullRequest = {
			number: 43,
			title: 'Old title',
			body: '',
			labels: [],
			base: 'cloudflare-next',
			branch: 'release-queue/cloudflare-next',
		};

		await refreshUmbrella(repositories(github), prerelease, releaseWith(18405, '7.5.0'));

		assert.deepEqual(patchOf(github.writes), {
			title: '[ci] release cloudflare-next docs',
			body: formatUmbrellaBody('cloudflare-next', { releasePrNumber: 18269, included }),
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
		const upToDate = { ...umbrella, body: umbrellaBody(18405) };

		await refreshUmbrella(repositories(github), upToDate, releaseWith(18405, '7.5.0'));

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
		...history(),
		...history('cloudflare-next'),
		...reviews(42),
		...reviews(43, 'cloudflare-next'),
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

		await refreshOpenUmbrellas(createRunContext(github, 'stable-only'));

		assert.deepEqual(github.writes, []);
	});

	it("doesn't change anything in a dry run", async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(createRunContext(github, 'dry-run'));

		assert.deepEqual(github.writes, []);
	});

	it('refreshes only the main umbrella in stable-only mode', async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(createRunContext(github, 'stable-only'));

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

		await refreshOpenUmbrellas(createRunContext(github, 'stable-only'));

		assert.deepEqual(
			github.writesBy(ACTIONS_TOKEN).map(({ method, path }) => `${method} ${path}`),
			[`PUT repos/${REPO}/pulls/42/reviews/1`]
		);
	});

	it('refreshes every umbrella in all mode, but not a fork or another base', async (t) => {
		const github = stubGitHub(t, { getResponses: openPullRequests });

		await refreshOpenUmbrellas(createRunContext(github, 'all'));

		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42, 43]);
	});

	it('refreshes the other umbrellas when one fails, then reports it', async (t) => {
		const github = stubGitHub(t, {
			getResponses: openPullRequests,
			writeFailures: { [`PATCH repos/${REPO}/pulls/42`]: { status: 500, message: 'Oops' } },
		});

		await assert.rejects(refreshOpenUmbrellas(createRunContext(github, 'all')), (error) => {
			assert.ok(error instanceof AggregateError);
			assert.equal(error.message, "Couldn't refresh 1 of 2 umbrella PRs.");
			assert.match(String(error.errors[0]), /Couldn't refresh #42\./);
			return true;
		});
		assert.deepEqual(refreshedUmbrellas(github.writesBy(BOT_TOKEN)), [42, 43]);
	});
});

import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { FrameworkReleases } from '../release/queries.ts';
import { getStableRelease, type StableRelease } from '../release/release.ts';
import { emptyMergeBlockResponses, REPO, umbrellaCommitResponses } from '../testing/fixtures.ts';
import { ACTIONS_TOKEN, stubRunContext } from '../testing/run-context.ts';
import { readBody, stubGitHub, type StubOptions, type Write } from '../testing/stub-github.ts';
import { formatUmbrellaBody } from './body.ts';
import type { UmbrellaPullRequest } from './queries.ts';
import { refreshUmbrella } from './refresh.ts';

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

/** `next` in prerelease mode, with its release PR `number` open. */
const prereleaseOf = (number: number) => ({
	'repos/withastro/astro/contents/.changeset/pre.json?ref=next': {
		content: Buffer.from('{"mode":"pre"}').toString('base64'),
	},
	'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/next': [
		{ number, body: '' },
	],
});

/** Refreshes an umbrella as a refresh run does: without blocking its merge. */
function refresh(
	github: ReturnType<typeof stubGitHub>,
	umbrellaToRefresh: UmbrellaPullRequest,
	release: StableRelease
) {
	const run = stubRunContext(github, 'all');
	const releases = new FrameworkReleases(run.framework, release);
	return refreshUmbrella(run, umbrellaToRefresh, { releases, shouldBlock: false });
}

/** Answers whether release PR `number` of `withastro/astro` is merged. */
const releaseMerged = (number: number, merged: boolean) => ({
	[`repos/withastro/astro/pulls/${number}`]: { number, merged },
});

function stub(t: TestContext, getResponses: StubOptions['getResponses'] = {}) {
	return stubGitHub(t, {
		getResponses: {
			...umbrellaCommitResponses(),
			...emptyMergeBlockResponses(42),
			...getResponses,
		},
	});
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

			await refresh(github, unlinked, releaseWith(18405, '7.5.0'));

			assert.deepEqual(patchOf(github.writes), { body: umbrellaBody(18405) });
		});

		it('refreshes an umbrella that links the open release PR', async (t) => {
			const github = stub(t);

			await refresh(github, umbrella, releaseWith(18405, '7.5.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
			assert.ok(!github.calls.some(({ path }) => path.startsWith('repos/withastro/astro')));
		});

		it('moves to the open release PR when the linked one is not merged', async (t) => {
			const github = stub(t, releaseMerged(18405, false));

			await refresh(github, umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(patchOf(github.writes), {
				title: '[ci] release astro@7.6.0 docs',
				body: umbrellaBody(18460),
			});
		});

		it('keeps a settled umbrella as it is, but for the list', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refresh(github, umbrella, releaseWith(18460, '7.6.0'));

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

			await refresh(github, patchUmbrella, releaseWith(18405, '7.5.0'));

			assert.equal(patchOf(github.writes)?.title, '[ci] release astro@7.5.0 docs');
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

			await refresh(github, umbrella, releaseWith(18460, '7.6.0'));

			assert.deepEqual(patchOf(github.writes), {
				title: '[ci] release astro@7.6.0 docs',
				body: umbrellaBody(18460),
			});
		});

		it('keeps a settled umbrella when the next release is a major', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refresh(github, umbrella, releaseWith(18460, '8.0.0'));

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('leaves the main umbrella as it is before a major', async (t) => {
			const github = stub(t);

			await refresh(github, umbrella, releaseWith(18405, '8.0.0'));

			assert.deepEqual(github.writes, []);
		});
	});

	describe('without a release PR open', () => {
		it('keeps the title, label and link, and rewrites the list', async (t) => {
			const github = stub(t, releaseMerged(18405, true));

			await refresh(github, umbrella, noRelease);

			assert.deepEqual(github.writes, [
				{ method: 'PATCH', path: `repos/${REPO}/pulls/42`, body: { body: umbrellaBody(18405) } },
			]);
		});

		it('keeps an umbrella whose release PR was closed without merging', async (t) => {
			const github = stub(t, releaseMerged(18405, false));

			await refresh(github, umbrella, noRelease);

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

			await refresh(github, newUmbrella, noRelease);

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
			getResponses: {
				...umbrellaCommitResponses('cloudflare-next'),
				...emptyMergeBlockResponses(43, 'cloudflare-next'),
				...prereleaseOf(18269),
			},
		});
		const prerelease: UmbrellaPullRequest = {
			number: 43,
			title: 'Old title',
			body: '',
			labels: [],
			base: 'cloudflare-next',
			branch: 'release-queue/cloudflare-next',
		};

		await refresh(github, prerelease, releaseWith(18405, '7.5.0'));

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

	it('blocks the merge with a review of the refreshed umbrella', async (t) => {
		const github = stub(t);
		const unlinked = { ...umbrella, body: 'Release umbrella for `main`.' };

		const run = stubRunContext(github, 'all');
		const releases = new FrameworkReleases(run.framework, releaseWith(18405, '7.5.0'));

		await refreshUmbrella(run, unlinked, { releases, shouldBlock: true });

		const [review] = github.writesBy(ACTIONS_TOKEN);
		assert.equal(review?.path, `repos/${REPO}/pulls/42/reviews`);
		// The link the refresh just added.
		assert.match(readBody(review), /withastro\/astro#18405 is merged\./);
	});

	it("doesn't write an umbrella that is up to date", async (t) => {
		const github = stub(t);
		const upToDate = { ...umbrella, body: umbrellaBody(18405) };

		await refresh(github, upToDate, releaseWith(18405, '7.5.0'));

		assert.deepEqual(github.writes, []);
	});
});

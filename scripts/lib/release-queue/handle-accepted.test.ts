import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { GitHubError } from './github/error.ts';
import { handleAcceptedPullRequest } from './handle-accepted.ts';
import type { Mode } from './modes.ts';
import { pullRequestResponse, REPO, umbrellaResponse } from './testing/fixtures.ts';
import { ACTIONS_TOKEN, BOT_TOKEN, stubRunContext } from './testing/run-context.ts';
import { readBody, stubGitHub, type StubOptions, type Write } from './testing/stub-github.ts';
import { formatUmbrellaBody } from './umbrella/body.ts';

const paths = {
	pr: `repos/${REPO}/pulls/7`,
	reviews: `repos/${REPO}/pulls/7/reviews`,
	releasePullRequest:
		'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/main',
	stableUmbrella: `repos/${REPO}/pulls?state=open&head=withastro:release-queue/main`,
};

/**
 * GET responses for PR #7, ready to join the open umbrella #42 of `base`. The
 * umbrella is up to date but for its body.
 */
function readyPullRequest({ base = 'main', label = 'minor-release', umbrellaBody = '' } = {}) {
	const umbrellaBranch = `release-queue/${base}`;
	const umbrella = umbrellaResponse({
		umbrellaBase: base,
		title: base === 'main' ? '[ci] release astro@7.5.0 docs' : `[ci] release ${base} docs`,
		labels: [{ name: 'merge-on-release' }, { name: label }],
		body: umbrellaBody,
	});
	return {
		[paths.pr]: pullRequestResponse({
			base: { ref: base },
			labels: [{ name: 'accepted' }, { name: label }],
		}),
		[paths.reviews]: [{ user: { login: 'maintainer' }, state: 'APPROVED' }],
		[`repos/${REPO}/collaborators/maintainer/permission`]: { permission: 'write' },
		[`repos/${REPO}/collaborators/contributor/permission`]: { permission: 'read' },
		[`repos/${REPO}/commits/head-sha/check-runs`]: {
			check_runs: [{ name: 'eslint', status: 'completed', conclusion: 'success' }],
		},
		[`repos/${REPO}/commits/head-sha/status`]: { statuses: [] },
		[`repos/${REPO}/rules/branches/main`]: [
			{
				type: 'required_status_checks',
				parameters: { required_status_checks: [{ context: 'eslint' }] },
			},
		],
		[paths.releasePullRequest]: [{ number: 1, html_url: '', body: '## astro@7.5.0\n' }],
		[`repos/${REPO}/pulls?state=open&head=withastro:${umbrellaBranch}`]: [umbrella],
		[`repos/${REPO}/pulls/42`]: umbrella,
		[`repos/${REPO}/git/ref/heads/${base}`]: { object: { sha: 'base-sha' } },
		[`repos/${REPO}/compare/${base}...${umbrellaBranch}`]: { ahead_by: 0, commits: [] },
		// No merge-block review yet, and no other PR on the umbrella branch.
		[`repos/${REPO}/pulls/42/reviews`]: [],
		[`repos/${REPO}/pulls?state=open&base=${umbrellaBranch}`]: [],
	};
}

/** Responses for a PR that `decideJoin` refuses: no approval. */
const unapprovedPullRequest = () => ({ ...readyPullRequest(), [paths.reviews]: [] });

/** Responses for a PR that opens the `main` umbrella with its first join. */
const firstJoin = () => ({ ...readyPullRequest(), [paths.stableUmbrella]: [] });

/**
 * Responses where the `main` umbrella #42 is settled: it links release PR
 * #18405, merged, while #1 is the open one.
 */
const settledUmbrella = () => ({
	...readyPullRequest({
		umbrellaBody: formatUmbrellaBody('main', { releasePrNumber: 18405, included: [] }),
	}),
	'repos/withastro/astro/pulls/18405': { number: 18405, merged: true },
});

/** Stubs GitHub with PR #7 ready to join, unless `options` say otherwise. */
const stubReadyPullRequest = (t: TestContext, options: StubOptions = {}) =>
	stubGitHub(t, { getResponses: readyPullRequest(), ...options });

/** Handles PR #7, and returns the writes of each identity. */
async function run(t: TestContext, mode: Mode, options: StubOptions = {}, sender = 'maintainer') {
	const github = stubReadyPullRequest(t, options);
	await handleAcceptedPullRequest(stubRunContext(github, mode), 7, sender);
	return { actionsWrites: github.writesBy(ACTIONS_TOKEN), botWrites: github.writesBy(BOT_TOKEN) };
}

const writtenPaths = (writes: Write[]) => writes.map(({ method, path }) => `${method} ${path}`);

/** The body of the last comment in `writes`. */
function commentBody(writes: Write[]): string {
	const write = writes.findLast(({ path }) => path.endsWith('/comments'));
	return readBody(write);
}

const comment = `POST repos/${REPO}/issues/7/comments`;
const removeAccepted = `DELETE repos/${REPO}/issues/7/labels/accepted`;

describe('handleAcceptedPullRequest', () => {
	it('only comments in a dry run', async (t) => {
		const { actionsWrites, botWrites } = await run(t, 'dry-run');

		assert.deepEqual(writtenPaths(actionsWrites), [comment]);
		assert.match(commentBody(actionsWrites), /would be squash-merged/);
		assert.deepEqual(botWrites, []);
	});

	it('only comments on a refused PR in a dry run', async (t) => {
		const { actionsWrites, botWrites } = await run(t, 'dry-run', {
			getResponses: unapprovedPullRequest(),
		});

		assert.deepEqual(writtenPaths(actionsWrites), [comment]);
		assert.match(commentBody(actionsWrites), /wouldn't join #42 into `main` yet:/);
		assert.deepEqual(botWrites, []);
	});

	it('joins a PR shipping to main in stable-only mode', async (t) => {
		const { actionsWrites, botWrites } = await run(t, 'stable-only');

		// The merge-block review comes from `github-actions[bot]`.
		assert.deepEqual(writtenPaths(actionsWrites), [`POST repos/${REPO}/pulls/42/reviews`]);
		assert.deepEqual(writtenPaths(botWrites), [
			`PATCH repos/${REPO}/pulls/7`,
			`PUT repos/${REPO}/pulls/7/merge`,
			comment,
			// The refresh: only the body of the umbrella is out of date.
			`PATCH repos/${REPO}/pulls/42`,
		]);
	});

	it('lists the PRs still on the umbrella branch in the review', async (t) => {
		const { actionsWrites } = await run(t, 'stable-only', {
			getResponses: {
				...readyPullRequest(),
				[`repos/${REPO}/pulls?state=open&base=release-queue/main`]: [{ number: 14590 }],
			},
		});

		const review = actionsWrites.find(({ path }) => path.endsWith('/reviews'));
		assert.match(readBody(review), /These PRs still target `release-queue\/main`: #14590\./);
	});

	it('opens the umbrella PR with its first join, then labels it', async (t) => {
		const { botWrites } = await run(t, 'stable-only', {
			getResponses: {
				...firstJoin(),
				[`repos/${REPO}/pulls/99/reviews`]: [],
				[`repos/${REPO}/pulls/99`]: umbrellaResponse({
					number: 99,
					title: '[ci] release astro@7.5.0 docs',
					body: 'Release umbrella for `main`, managed by the release queue.',
					labels: [],
				}),
			},
			writeResults: { [`POST repos/${REPO}/pulls`]: { number: 99 } },
		});

		assert.deepEqual(writtenPaths(botWrites), [
			`POST repos/${REPO}/git/refs`,
			`PATCH repos/${REPO}/pulls/7`,
			`PUT repos/${REPO}/pulls/7/merge`,
			`POST repos/${REPO}/pulls`,
			comment,
			`PATCH repos/${REPO}/pulls/99`,
			`POST repos/${REPO}/issues/99/labels`,
		]);
		assert.match(commentBody(botWrites), /the branch of #99 into `main`/);
		assert.deepEqual(botWrites.at(-1)?.body, { labels: ['merge-on-release', 'minor-release'] });
	});

	it('only comments on a PR shipping to a prerelease branch in stable-only mode', async (t) => {
		const getResponses = readyPullRequest({ base: 'cloudflare-next', label: 'major-release' });
		const { actionsWrites, botWrites } = await run(t, 'stable-only', { getResponses });

		assert.deepEqual(writtenPaths(actionsWrites), [comment]);
		assert.deepEqual(botWrites, []);
	});

	it('joins a PR shipping to a prerelease branch in all mode', async (t) => {
		const getResponses = readyPullRequest({ base: 'cloudflare-next', label: 'major-release' });
		const { botWrites } = await run(t, 'all', { getResponses });

		assert.deepEqual(writtenPaths(botWrites), [
			`PATCH repos/${REPO}/pulls/7`,
			`PUT repos/${REPO}/pulls/7/merge`,
			comment,
			// The refresh: only the body of the umbrella is out of date.
			`PATCH repos/${REPO}/pulls/42`,
		]);
	});

	it('links the release PR of next in a prerelease umbrella', async (t) => {
		const { botWrites } = await run(t, 'all', {
			getResponses: {
				...readyPullRequest({ base: 'cloudflare-next', label: 'major-release' }),
				'repos/withastro/astro/contents/.changeset/pre.json?ref=next': {
					content: Buffer.from('{"mode":"pre"}').toString('base64'),
				},
				'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/next': [
					{ number: 18269, body: '' },
				],
			},
		});

		const refresh = botWrites.find(({ path }) => path === `repos/${REPO}/pulls/42`);
		assert.match(readBody(refresh), /^Ships with withastro\/astro#18269\./);
	});

	it("doesn't read the prerelease line for a PR shipping to main", async (t) => {
		const github = stubReadyPullRequest(t);

		await handleAcceptedPullRequest(stubRunContext(github, 'stable-only'), 7, 'maintainer');

		assert.ok(!github.calls.some(({ path }) => path.includes('.changeset/pre.json')));
	});

	for (const [name, mode, getResponses] of [
		[
			'a dry-run comment',
			'dry-run',
			readyPullRequest({ base: 'cloudflare-next', label: 'major-release' }),
		],
		[
			'a refusal',
			'all',
			{
				...readyPullRequest({ base: 'cloudflare-next', label: 'major-release' }),
				[paths.reviews]: [],
			},
		],
	] as const) {
		it(`doesn't read the prerelease line for ${name} of a prerelease PR`, async (t) => {
			const github = stubReadyPullRequest(t, { getResponses });

			await handleAcceptedPullRequest(stubRunContext(github, mode), 7, 'maintainer');

			assert.ok(github.writes.some(({ path }) => path.endsWith('/comments')));
			assert.ok(!github.calls.some(({ path }) => path.includes('.changeset/pre.json')));
		});
	}

	it('keeps the accepted label after a join, and names the umbrella', async (t) => {
		const { botWrites } = await run(t, 'stable-only');

		assert.ok(!writtenPaths(botWrites).includes(removeAccepted));
		assert.match(commentBody(botWrites), /the branch of #42 into `main`/);
	});

	it('removes the label, then comments, when refusing a PR', async (t) => {
		const { botWrites } = await run(t, 'stable-only', { getResponses: unapprovedPullRequest() });

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
		assert.match(commentBody(botWrites), /no approval/);
	});

	it('refuses a PR whose required check is a pending commit status', async (t) => {
		const { botWrites } = await run(t, 'stable-only', {
			getResponses: {
				...readyPullRequest(),
				[`repos/${REPO}/rules/branches/main`]: [
					{
						type: 'required_status_checks',
						parameters: { required_status_checks: [{ context: 'eslint' }, { context: 'deploy' }] },
					},
				],
				[`repos/${REPO}/commits/head-sha/status`]: {
					statuses: [{ context: 'deploy', state: 'pending' }],
				},
			},
		});

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
		assert.match(commentBody(botWrites), /haven't finished yet: `deploy`\./);
	});

	it('still comments when the label is already gone', async (t) => {
		const { botWrites } = await run(t, 'stable-only', {
			getResponses: unapprovedPullRequest(),
			writeFailures: { [removeAccepted]: { status: 404, message: 'Label does not exist' } },
		});

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
	});

	it('names the open main umbrella when the next astro release is a major', async (t) => {
		const { botWrites } = await run(t, 'stable-only', {
			getResponses: {
				...readyPullRequest(),
				[paths.releasePullRequest]: [{ number: 1, html_url: '', body: '## astro@8.0.0\n' }],
			},
		});

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
		assert.match(commentBody(botWrites), /`astro@8.0.0`/);
		assert.match(commentBody(botWrites), /The open `main` umbrella \(#42\)/);
	});

	describe('while the main umbrella is settled', () => {
		it('refuses a PR it would retarget, before changing it', async (t) => {
			const { botWrites } = await run(t, 'stable-only', { getResponses: settledUmbrella() });

			assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
			assert.match(
				commentBody(botWrites),
				/#42 ships with withastro\/astro#18405, which is already merged\. Merge #42 first\./
			);
		});

		it('shows the refusal in a dry run', async (t) => {
			const { actionsWrites } = await run(t, 'dry-run', { getResponses: settledUmbrella() });

			assert.match(commentBody(actionsWrites), /^\*\*Release queue \(dry run\)\*\*/);
			assert.match(commentBody(actionsWrites), /- #42 ships with .*, which is already merged\./);
		});

		it('joins a PR against the umbrella branch', async (t) => {
			const { botWrites } = await run(t, 'stable-only', {
				getResponses: {
					...settledUmbrella(),
					[paths.pr]: pullRequestResponse({
						base: { ref: 'release-queue/main' },
						labels: [{ name: 'accepted' }, { name: 'minor-release' }],
					}),
				},
			});

			assert.deepEqual(writtenPaths(botWrites).slice(0, 2), [
				`PUT repos/${REPO}/pulls/7/merge`,
				comment,
			]);
		});

		const prsThatCantUseIt = {
			'a PR against the umbrella branch': pullRequestResponse({
				base: { ref: 'release-queue/main' },
				labels: [{ name: 'accepted' }, { name: 'minor-release' }],
			}),
			'a closed PR': pullRequestResponse({ state: 'closed' }),
		};
		for (const [name, pr] of Object.entries(prsThatCantUseIt)) {
			it(`doesn't read the state for ${name}`, async (t) => {
				const github = stubReadyPullRequest(t, {
					getResponses: { ...settledUmbrella(), [paths.pr]: pr },
				});

				await handleAcceptedPullRequest(stubRunContext(github, 'dry-run'), 7, 'maintainer');

				assert.equal(github.countReads('repos/withastro/astro/pulls/18405'), 0);
			});
		}

		it("doesn't affect a PR shipping to a prerelease branch", async (t) => {
			const github = stubReadyPullRequest(t, {
				getResponses: {
					...settledUmbrella(),
					...readyPullRequest({ base: 'cloudflare-next', label: 'major-release' }),
				},
			});

			await handleAcceptedPullRequest(stubRunContext(github, 'all'), 7, 'maintainer');

			assert.ok(writtenPaths(github.writes).includes(`PUT repos/${REPO}/pulls/7/merge`));
			assert.equal(github.countReads('repos/withastro/astro/pulls/18405'), 0);
		});
	});

	it('refuses a PR whose join is refused', async (t) => {
		const { botWrites } = await run(t, 'stable-only', {
			getResponses: {
				...firstJoin(),
				[`repos/${REPO}/git/ref/heads/release-queue/main`]: { object: { sha: 'old-sha' } },
				[`repos/${REPO}/compare/main...release-queue/main`]: { ahead_by: 3, commits: [] },
			},
		});

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
		assert.match(commentBody(botWrites), /has commits but no open umbrella/);
	});

	it("comments, then fails, when the umbrella PR couldn't be opened", async (t) => {
		const github = stubReadyPullRequest(t, {
			getResponses: firstJoin(),
			writeFailures: {
				[`POST repos/${REPO}/pulls`]: { status: 422, message: 'Validation Failed' },
			},
		});

		await assert.rejects(
			handleAcceptedPullRequest(stubRunContext(github, 'stable-only'), 7, 'maintainer'),
			(error: unknown) => {
				assert.ok(error instanceof Error);
				assert.match(error.message, /but the umbrella PR couldn't be opened\.$/);
				assert.ok(error.cause instanceof GitHubError);
				assert.equal(error.cause.status, 422);
				return true;
			}
		);
		assert.match(
			commentBody(github.writesBy(BOT_TOKEN)),
			/couldn't be opened: Validation Failed\./
		);
	});

	it('comments on the join, then fails, when the refresh fails', async (t) => {
		const responses: Record<string, unknown> = readyPullRequest();
		delete responses[`repos/${REPO}/compare/main...release-queue/main`];
		const github = stubReadyPullRequest(t, { getResponses: responses });

		await assert.rejects(
			handleAcceptedPullRequest(stubRunContext(github, 'stable-only'), 7, 'maintainer'),
			{ name: 'GitHubError', status: 404 }
		);
		assert.match(commentBody(github.writesBy(BOT_TOKEN)), /squash-merged into/);
	});

	it('ignores a sender without write access', async (t) => {
		const { actionsWrites, botWrites } = await run(t, 'stable-only', {}, 'contributor');

		assert.deepEqual(actionsWrites, []);
		assert.deepEqual(botWrites, []);
	});
});

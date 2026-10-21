import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { GitHubError } from './github.ts';
import {
	handleAcceptedPullRequest,
	needsBotToken,
	type HandleOptions,
	type Mode,
} from './handle-accepted.ts';
import { pullRequestResponse, REPO } from './testing/fixtures.ts';
import { stubGitHub, type StubOptions, type Write } from './testing/stub-github.ts';

const paths = {
	reviews: `repos/${REPO}/pulls/7/reviews`,
	releasePullRequest:
		'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/main',
	mainUmbrella: `repos/${REPO}/pulls?state=open&head=withastro:release-queue/main`,
};

/** GET responses for PR #7, ready to join the umbrella of `base`. */
function readyPullRequest({ base = 'main', label = 'minor-release' } = {}) {
	const umbrellaBranch = `release-queue/${base}`;
	return {
		[`repos/${REPO}/pulls/7`]: pullRequestResponse({
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
		[`repos/${REPO}/pulls?state=open&head=withastro:${umbrellaBranch}`]: [
			{ number: 42, html_url: `https://github.com/${REPO}/pull/42` },
		],
		[`repos/${REPO}/git/ref/heads/${base}`]: { object: { sha: 'base-sha' } },
	};
}

/** Responses for a PR that `decide` refuses: no approval. */
const unapprovedPullRequest = () => ({ ...readyPullRequest(), [paths.reviews]: [] });

/** Responses for a PR that opens the `main` umbrella with its first join. */
const firstJoin = () => ({ ...readyPullRequest(), [paths.mainUmbrella]: [] });

// Distinct tokens tell the writes of each identity apart.
const ACTIONS_TOKEN = 'actions-token';
const BOT_TOKEN = 'bot-token';

type StubbedGitHub = ReturnType<typeof stubGitHub>;

const handleOptions = (github: StubbedGitHub, mode: Mode): HandleOptions => ({
	actionsClient: github.client(ACTIONS_TOKEN),
	botClient: github.client(BOT_TOKEN),
	repo: REPO,
	mode,
});

/** Stubs GitHub with PR #7 ready to join, unless `options` say otherwise. */
const stubReadyPullRequest = (t: TestContext, options: StubOptions = {}) =>
	stubGitHub(t, { getResponses: readyPullRequest(), ...options });

/** Handles PR #7, and returns the writes of each identity. */
async function run(t: TestContext, mode: Mode, options: StubOptions = {}, sender = 'maintainer') {
	const github = stubReadyPullRequest(t, options);
	await handleAcceptedPullRequest(handleOptions(github, mode), 7, sender);
	return { actionsWrites: github.writesBy(ACTIONS_TOKEN), botWrites: github.writesBy(BOT_TOKEN) };
}

const writtenPaths = (writes: Write[]) => writes.map(({ method, path }) => `${method} ${path}`);

/** The body of the last comment in `writes`. */
function commentBody(writes: Write[]): string {
	const write = writes.findLast(({ path }) => path.endsWith('/comments'));
	return (write?.body as { body: string } | undefined)?.body ?? '';
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

	it('joins a PR shipping to main in main-only mode', async (t) => {
		const { actionsWrites, botWrites } = await run(t, 'main-only');

		assert.deepEqual(actionsWrites, []);
		assert.deepEqual(writtenPaths(botWrites), [
			`PATCH repos/${REPO}/pulls/7`,
			`PUT repos/${REPO}/pulls/7/merge`,
			comment,
		]);
	});

	it('only comments on a PR shipping to a prerelease branch in main-only mode', async (t) => {
		const getResponses = readyPullRequest({ base: 'cloudflare-next', label: 'major-release' });
		const { actionsWrites, botWrites } = await run(t, 'main-only', { getResponses });

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
		]);
	});

	it('keeps the accepted label after a join, and names the umbrella', async (t) => {
		const { botWrites } = await run(t, 'main-only');

		assert.ok(!writtenPaths(botWrites).includes(removeAccepted));
		assert.match(commentBody(botWrites), /the branch of #42 into `main`/);
	});

	it('removes the label, then comments, when refusing a PR', async (t) => {
		const { botWrites } = await run(t, 'main-only', { getResponses: unapprovedPullRequest() });

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
		assert.match(commentBody(botWrites), /no approval/);
	});

	it('still comments when the label is already gone', async (t) => {
		const { botWrites } = await run(t, 'main-only', {
			getResponses: unapprovedPullRequest(),
			writeFailures: { [removeAccepted]: { status: 404, message: 'Label does not exist' } },
		});

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
	});

	it('names the open main umbrella when the next astro release is a major', async (t) => {
		const { botWrites } = await run(t, 'main-only', {
			getResponses: {
				...readyPullRequest(),
				[paths.releasePullRequest]: [{ number: 1, html_url: '', body: '## astro@8.0.0\n' }],
			},
		});

		assert.deepEqual(writtenPaths(botWrites), [removeAccepted, comment]);
		assert.match(commentBody(botWrites), /`astro@8.0.0`/);
		assert.match(commentBody(botWrites), /The open `main` umbrella \(#42\)/);
	});

	it('refuses a PR whose join is refused', async (t) => {
		const { botWrites } = await run(t, 'main-only', {
			getResponses: {
				...firstJoin(),
				[`repos/${REPO}/git/ref/heads/release-queue/main`]: { object: { sha: 'old-sha' } },
				[`repos/${REPO}/compare/main...release-queue/main`]: { ahead_by: 3 },
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
			handleAcceptedPullRequest(handleOptions(github, 'main-only'), 7, 'maintainer'),
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

	it("comments, then fails, when the umbrella labels couldn't be set", async (t) => {
		const github = stubReadyPullRequest(t, {
			getResponses: firstJoin(),
			writeResults: { [`POST repos/${REPO}/pulls`]: { number: 99 } },
			writeFailures: {
				[`POST repos/${REPO}/issues/99/labels`]: { status: 500, message: 'Server Error' },
			},
		});

		await assert.rejects(
			handleAcceptedPullRequest(handleOptions(github, 'main-only'), 7, 'maintainer'),
			/but the labels of the umbrella PR couldn't be set\.$/
		);
		assert.match(
			commentBody(github.writesBy(BOT_TOKEN)),
			/the branch of #99 into `main`, but its labels/
		);
	});

	it('ignores a sender without write access', async (t) => {
		const { actionsWrites, botWrites } = await run(t, 'main-only', {}, 'contributor');

		assert.deepEqual(actionsWrites, []);
		assert.deepEqual(botWrites, []);
	});
});

describe('needsBotToken', () => {
	it('is required to write in a live mode', () => {
		assert.equal(needsBotToken('main-only', true), true);
		assert.equal(needsBotToken('all', true), true);
	});

	it('is not required in a dry run, or when writes are only printed', () => {
		assert.equal(needsBotToken('dry-run', true), false);
		assert.equal(needsBotToken('all', false), false);
	});
});

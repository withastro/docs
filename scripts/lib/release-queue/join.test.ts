import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GitHubError } from './github-error.ts';
import { joinUmbrella } from './join.ts';
import type { PullRequest } from './queries.ts';
import type { Route } from './routing.ts';
import { pullRequestResponse, REPO, umbrellaResponse } from './testing/fixtures.ts';
import { stubGitHub, type Write } from './testing/stub-github.ts';

const pr: PullRequest = {
	number: 7,
	title: 'Document the new option',
	url: `https://github.com/${REPO}/pull/7`,
	state: 'open',
	isDraft: false,
	base: 'main',
	head: 'feat/option',
	headSha: 'head-sha',
	labels: ['accepted', 'minor-release'],
	isMergeable: true,
};

const route: Route = {
	umbrellaBase: 'main',
	umbrellaBranch: 'release-queue/main',
	label: 'minor-release',
	shouldRetarget: true,
};

const umbrellaTitle = '[ci] release astro@7.5.0 docs';

const paths = {
	openUmbrella: `repos/${REPO}/pulls?state=open&head=withastro:release-queue/main`,
	stableRef: `repos/${REPO}/git/ref/heads/main`,
	umbrellaRef: `repos/${REPO}/git/ref/heads/release-queue/main`,
	compare: `repos/${REPO}/compare/main...release-queue/main`,
	pr: `repos/${REPO}/pulls/7`,
};

const prResponse = (mergeable: boolean | null) =>
	pullRequestResponse({ mergeable, base: { ref: 'release-queue/main' } });

/** Responses without an open umbrella, for a PR that merges cleanly. */
const withoutUmbrella = {
	[paths.openUmbrella]: [],
	[paths.stableRef]: { object: { sha: 'main-sha' } },
	[paths.pr]: prResponse(true),
};

const withUmbrella = {
	...withoutUmbrella,
	[paths.openUmbrella]: [umbrellaResponse()],
};

const createBranch: Write = {
	method: 'POST',
	path: `repos/${REPO}/git/refs`,
	body: { ref: 'refs/heads/release-queue/main', sha: 'main-sha' },
};

const setBase = (base: string): Write => ({
	method: 'PATCH',
	path: `repos/${REPO}/pulls/7`,
	body: { base },
});

const merge: Write = {
	method: 'PUT',
	path: `repos/${REPO}/pulls/7/merge`,
	body: {
		merge_method: 'squash',
		sha: 'head-sha',
		commit_title: 'Document the new option (#7)',
	},
};

const openUmbrella: Write = {
	method: 'POST',
	path: `repos/${REPO}/pulls`,
	body: {
		title: '[ci] release astro@7.5.0 docs',
		head: 'release-queue/main',
		base: 'main',
		body: 'Release umbrella for `main`, managed by the release queue.',
	},
};

const createdUmbrella = { [`POST repos/${REPO}/pulls`]: { number: 99 } };

describe('joinUmbrella', () => {
	it('creates the branch, merges the PR, then opens the umbrella PR', async (t) => {
		const github = stubGitHub(t, { getResponses: withoutUmbrella, writeResults: createdUmbrella });

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, { status: 'joined', umbrella: { status: 'open', number: 99 } });
		assert.deepEqual(github.writes, [
			createBranch,
			setBase('release-queue/main'),
			merge,
			openUmbrella,
		]);
	});

	it('joins the open umbrella PR', async (t) => {
		const github = stubGitHub(t, { getResponses: withUmbrella });

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, { status: 'joined', umbrella: { status: 'open', number: 42 } });
		assert.deepEqual(github.writes, [setBase('release-queue/main'), merge]);
	});

	it('ignores a PR from the umbrella branch into another base', async (t) => {
		const github = stubGitHub(t, {
			getResponses: {
				...withoutUmbrella,
				[paths.openUmbrella]: [umbrellaResponse({ base: { ref: 'v6' } })],
			},
			writeResults: createdUmbrella,
		});

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, { status: 'joined', umbrella: { status: 'open', number: 99 } });
		assert.deepEqual(github.writes[0], createBranch);
	});

	it("doesn't change the base of a PR against the umbrella branch", async (t) => {
		const github = stubGitHub(t, { getResponses: withUmbrella });
		const umbrellaPr = { ...pr, base: 'release-queue/main' };

		await joinUmbrella(github.repository(), {
			pr: umbrellaPr,
			route: { ...route, shouldRetarget: false },
			umbrellaTitle,
		});

		assert.deepEqual(github.writes, [merge]);
	});

	it('prepares the branch for a PR against it when no umbrella PR is open', async (t) => {
		const github = stubGitHub(t, { getResponses: withoutUmbrella, writeResults: createdUmbrella });
		const umbrellaPr = { ...pr, base: 'release-queue/main' };

		await joinUmbrella(github.repository(), {
			pr: umbrellaPr,
			route: { ...route, shouldRetarget: false },
			umbrellaTitle,
		});

		assert.deepEqual(github.writes, [createBranch, merge, openUmbrella]);
	});

	it('resets a leftover umbrella branch without commits', async (t) => {
		const github = stubGitHub(t, {
			getResponses: {
				...withoutUmbrella,
				[paths.umbrellaRef]: { object: { sha: 'old-sha' } },
				[paths.compare]: { ahead_by: 0 },
			},
			writeResults: createdUmbrella,
		});

		await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(github.writes, [
			{
				method: 'PATCH',
				path: `repos/${REPO}/git/refs/heads/release-queue/main`,
				body: { sha: 'main-sha', force: true },
			},
			setBase('release-queue/main'),
			merge,
			openUmbrella,
		]);
	});

	it('refuses a leftover umbrella branch with commits, without touching the PR', async (t) => {
		const github = stubGitHub(t, {
			getResponses: {
				...withoutUmbrella,
				[paths.umbrellaRef]: { object: { sha: 'old-sha' } },
				[paths.compare]: { ahead_by: 3 },
			},
		});

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, {
			status: 'refused',
			refusal: { code: 'stale-umbrella-branch', branch: 'release-queue/main' },
		});
		assert.deepEqual(github.writes, []);
	});

	it('throws when the target branch is missing, without touching the PR', async (t) => {
		const withoutStable: Record<string, unknown> = { ...withoutUmbrella };
		delete withoutStable[paths.stableRef];
		const github = stubGitHub(t, { getResponses: withoutStable });

		await assert.rejects(
			joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle }),
			/doesn't exist/
		);
		assert.deepEqual(github.writes, []);
	});

	it('merges while GitHub still computes the mergeability', async (t) => {
		const github = stubGitHub(t, {
			getResponses: { ...withUmbrella, [paths.pr]: prResponse(null) },
		});

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.equal(result.status, 'joined');
		assert.deepEqual(github.writes, [setBase('release-queue/main'), merge]);
	});

	it('restores the base when the PR conflicts with the umbrella branch', async (t) => {
		const github = stubGitHub(t, {
			getResponses: { ...withUmbrella, [paths.pr]: prResponse(false) },
		});

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, {
			status: 'refused',
			refusal: { code: 'umbrella-conflict', branch: 'release-queue/main' },
		});
		assert.deepEqual(github.writes, [setBase('release-queue/main'), setBase('main')]);
	});

	it('restores the base when GitHub refuses the merge', async (t) => {
		const github = stubGitHub(t, {
			getResponses: withUmbrella,
			writeFailures: {
				[`PUT repos/${REPO}/pulls/7/merge`]: {
					status: 405,
					message: 'Pull Request is not mergeable',
				},
			},
		});

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, {
			status: 'refused',
			refusal: { code: 'merge-failed', reason: 'Pull Request is not mergeable' },
		});
		assert.deepEqual(github.writes, [setBase('release-queue/main'), merge, setBase('main')]);
	});

	it('restores the base, then rethrows an unexpected error', async (t) => {
		const github = stubGitHub(t, {
			getResponses: withUmbrella,
			writeFailures: { [`PUT repos/${REPO}/pulls/7/merge`]: new TypeError('fetch failed') },
		});

		await assert.rejects(
			joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle }),
			TypeError
		);
		assert.deepEqual(github.writes, [setBase('release-queue/main'), merge, setBase('main')]);
	});

	it('keeps the reason for restoring when restoring the base fails', async (t) => {
		const restoreError = new TypeError('fetch failed');
		const github = stubGitHub(t, {
			getResponses: { ...withUmbrella, [paths.pr]: prResponse(false) },
			writeFailures: { [`PATCH repos/${REPO}/pulls/7 {"base":"main"}`]: restoreError },
		});

		await assert.rejects(
			joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle }),
			(error: unknown) => {
				assert.ok(error instanceof AggregateError);
				assert.deepEqual(error.errors, [restoreError]);
				assert.deepEqual(error.cause, { code: 'umbrella-conflict', branch: 'release-queue/main' });
				return true;
			}
		);
	});

	it("reports a merged PR whose umbrella PR couldn't be opened", async (t) => {
		const github = stubGitHub(t, {
			getResponses: withoutUmbrella,
			writeFailures: {
				[`POST repos/${REPO}/pulls`]: {
					status: 422,
					message: 'Validation Failed',
					errors: [{ message: 'A pull request already exists' }],
				},
			},
		});

		const result = await joinUmbrella(github.repository(), { pr: pr, route: route, umbrellaTitle });

		assert.equal(result.status, 'unopened');
		assert.ok(result.error instanceof GitHubError);
		assert.equal(result.error.githubReason, 'Validation Failed: A pull request already exists');
		assert.deepEqual(github.writes, [
			createBranch,
			setBase('release-queue/main'),
			merge,
			openUmbrella,
		]);
	});

	it('names the umbrella by its title when writes are only printed', async (t) => {
		const github = stubGitHub(t, { getResponses: withoutUmbrella });
		t.mock.method(console, 'info', () => {});
		const printingClient = github.repository(REPO, { shouldPrintWrites: true });

		const result = await joinUmbrella(printingClient, { pr: pr, route: route, umbrellaTitle });

		assert.deepEqual(result, {
			status: 'joined',
			umbrella: { status: 'planned', title: '[ci] release astro@7.5.0 docs' },
		});
		assert.deepEqual(github.writes, []);
	});
});

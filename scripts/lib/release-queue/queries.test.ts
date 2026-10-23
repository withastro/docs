import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { FRAMEWORK_REPO } from './config.ts';
import { GitHubClient } from './github.ts';
import { getPrereleasePullRequest, getPullRequest } from './queries.ts';
import { Repository } from './repository.ts';
import { pullRequestResponse, REPO } from './testing/fixtures.ts';
import { stubGitHub } from './testing/stub-github.ts';

const PR_PATH = `repos/${REPO}/pulls/7`;

describe('getPullRequest', () => {
	it('polls until GitHub knows the mergeability', async (t) => {
		let requests = 0;
		const github = stubGitHub(t, {
			getResponses: {
				[PR_PATH]: () => pullRequestResponse({ mergeable: ++requests < 3 ? null : true }),
			},
		});

		const pr = await getPullRequest(github.repository(), 7);

		assert.equal(pr.isMergeable, true);
		assert.equal(github.countReads(PR_PATH), 3);
	});

	it('stops after the last attempt, with the mergeability still unknown', async (t) => {
		const github = stubGitHub(t, {
			getResponses: { [PR_PATH]: pullRequestResponse({ mergeable: null }) },
		});

		const pr = await getPullRequest(github.repository(), 7);

		assert.equal(pr.isMergeable, null);
		assert.equal(github.countReads(PR_PATH), 5);
	});

	it("doesn't poll for a closed PR", async (t) => {
		const github = stubGitHub(t, {
			getResponses: { [PR_PATH]: pullRequestResponse({ state: 'closed', mergeable: null }) },
		});

		await getPullRequest(github.repository(), 7);

		assert.equal(github.countReads(PR_PATH), 1);
	});
});

describe('getPrereleasePullRequest', () => {
	const preJson = 'repos/withastro/astro/contents/.changeset/pre.json?ref=next';
	const nextPullRequests =
		'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/next';
	const stablePullRequest = { number: 18405, versions: [] };
	const preMode = (mode: string) => ({
		content: Buffer.from(JSON.stringify({ mode, tag: 'beta' })).toString('base64'),
	});

	it('links the release PR of next while it is in prerelease mode', async (t) => {
		const github = stubGitHub(t, {
			getResponses: {
				[preJson]: preMode('pre'),
				[nextPullRequests]: [{ number: 18269, body: '## @astrojs/cloudflare@15.0.0-beta.2\n' }],
			},
		});

		const pr = await getPrereleasePullRequest(github.repository(FRAMEWORK_REPO), stablePullRequest);

		assert.deepEqual(pr, {
			number: 18269,
			versions: [{ name: '@astrojs/cloudflare', version: '15.0.0-beta.2' }],
		});
	});

	it('finds no release PR while next has none open', async (t) => {
		const github = stubGitHub(t, {
			getResponses: { [preJson]: preMode('pre'), [nextPullRequests]: [] },
		});

		assert.equal(
			await getPrereleasePullRequest(github.repository(FRAMEWORK_REPO), stablePullRequest),
			undefined
		);
	});

	it('fails on an error other than a missing pre.json', async (t) => {
		t.mock.method(globalThis, 'fetch', async () => new Response('{}', { status: 500 }));

		await assert.rejects(
			getPrereleasePullRequest(
				new Repository(new GitHubClient('token'), FRAMEWORK_REPO),
				stablePullRequest
			),
			{
				name: 'GitHubError',
				status: 500,
			}
		);
	});

	it('fails on a pre.json that is not JSON', async (t) => {
		const github = stubGitHub(t, {
			getResponses: { [preJson]: { content: Buffer.from('{ mode: pre').toString('base64') } },
		});

		await assert.rejects(
			getPrereleasePullRequest(github.repository(FRAMEWORK_REPO), stablePullRequest),
			(error: unknown) => {
				assert.ok(error instanceof Error);
				assert.match(error.message, /`\.changeset\/pre\.json` of `next` isn't valid JSON/);
				assert.ok(error.cause instanceof SyntaxError);
				return true;
			}
		);
	});

	for (const preState of ['null', '{"tag":"beta"}', '{"mode":1}']) {
		it(`fails on a pre.json without a mode: ${preState}`, async (t) => {
			const github = stubGitHub(t, {
				getResponses: { [preJson]: { content: Buffer.from(preState).toString('base64') } },
			});

			await assert.rejects(
				getPrereleasePullRequest(github.repository(FRAMEWORK_REPO), stablePullRequest),
				/`\.changeset\/pre\.json` of `next` has no `mode`/
			);
		});
	}

	it('links the release PR of main once next left prerelease mode', async (t) => {
		for (const getResponses of [{ [preJson]: preMode('exit') }, {}]) {
			const github = stubGitHub(t, { getResponses });

			assert.equal(
				await getPrereleasePullRequest(github.repository(FRAMEWORK_REPO), stablePullRequest),
				stablePullRequest
			);
			assert.equal(github.countReads(nextPullRequests), 0);
		}
	});
});

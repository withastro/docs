import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { pullRequestResponse, REPO } from '../testing/fixtures.ts';
import { stubGitHub } from '../testing/stub-github.ts';
import { getPullRequest } from './queries.ts';

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

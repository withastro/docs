import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { REPO } from '../testing/fixtures.ts';
import { stubGitHub } from '../testing/stub-github.ts';
import { listIncludedPullRequests, type UmbrellaPullRequest } from './queries.ts';

const umbrella: UmbrellaPullRequest = {
	number: 42,
	title: '[ci] release astro@7.5.0 docs',
	body: '',
	labels: [],
	base: 'main',
	branch: 'release-queue/main',
};

describe('listIncludedPullRequests', () => {
	it('reads the PR number of each squash commit, in commit order', async (t) => {
		const messages = [
			'Document the new option (#7)\n\nDetails.',
			"Merge branch 'main' into release-queue/main",
			'Fix (a typo) in the guide (#3)',
			'Revert the option (#12) (#15)',
		];
		const github = stubGitHub(t, {
			getResponses: {
				[`repos/${REPO}/compare/main...release-queue/main`]: {
					ahead_by: messages.length,
					commits: messages.map((message) => ({ commit: { message } })),
				},
			},
		});

		assert.deepEqual(await listIncludedPullRequests(github.repository(), umbrella), [7, 3, 15]);
	});
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	buildPullRequest,
	buildRelease,
	createContext,
	FakeRepository,
} from './fake-repository.ts';
import { startRun } from './run-state.ts';
import { renderUmbrella } from './umbrella-content.ts';
import { getUmbrellaBranches } from './umbrella.ts';

function buildUmbrella(number: number, baseBranch: string, releasePrNumber: number | null) {
	const branches = getUmbrellaBranches(baseBranch);
	return buildPullRequest({
		number,
		baseBranch,
		headBranch: branches.head,
		body: renderUmbrella({
			branches,
			release: releasePrNumber === null ? null : buildRelease({ prNumber: releasePrNumber }),
			includedPrNumbers: [],
		}).body,
	});
}

describe('startRun', () => {
	it('should read the releases of the framework', async () => {
		const releasePullRequest = buildPullRequest({
			number: 100,
			headBranch: 'changeset-release/main',
			body: '## astro@7.4.1\n',
		});
		const docs = new FakeRepository({});
		const astro = new FakeRepository({ pullRequests: [releasePullRequest] });

		const { releases } = (await startRun(createContext(docs, astro).context)).state;

		assert.equal(releases.stable?.prNumber, 100);
	});

	it('should find the umbrellas whose release PR is merged', async () => {
		const docs = new FakeRepository({
			pullRequests: [
				buildUmbrella(50, 'main', 100),
				buildUmbrella(60, 'cloudflare-next', 200),
				buildUmbrella(70, 'v8', null),
				{
					...buildPullRequest({ number: 7 }),
					body: renderUmbrella({
						branches: { head: 'release-queue/v9', base: 'v9' },
						release: buildRelease({ prNumber: 100 }),
						includedPrNumbers: [],
					}).body,
				},
			],
		});
		const astro = new FakeRepository({
			pullRequests: [
				buildPullRequest({ number: 100, isMerged: true }),
				buildPullRequest({ number: 200 }),
			],
		});

		const { settledBaseBranches } = (await startRun(createContext(docs, astro).context)).state;

		assert.deepEqual(settledBaseBranches, ['main']);
	});

	it('should not count an umbrella whose marker names a release PR that does not exist', async () => {
		const docs = new FakeRepository({ pullRequests: [buildUmbrella(50, 'main', 404)] });
		const astro = new FakeRepository({});

		const { settledBaseBranches } = (await startRun(createContext(docs, astro).context)).state;

		assert.deepEqual(settledBaseBranches, []);
	});

	it('should keep the open PRs of the docs repository', async () => {
		const pullRequest = buildPullRequest({ number: 7 });
		const docs = new FakeRepository({ pullRequests: [pullRequest] });
		const astro = new FakeRepository({});

		const { openPullRequests } = (await startRun(createContext(docs, astro).context)).state;

		assert.deepEqual(openPullRequests, [pullRequest]);
	});
});

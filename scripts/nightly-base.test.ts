import assert from 'node:assert/strict';
import { describe, it, mock } from 'node:test';
import { prepareNightlyBase } from './nightly-base.ts';
import { createFakeOctokit } from './release-assistant/github/fake-octokit.ts';
import { buildPullRequest } from './release-assistant/github/fake-repository.ts';
import type { PullRequestDetails } from './release-assistant/github/repository.ts';

const REPOSITORY = { owner: 'example-org', repo: 'docs' };
const PULLS_PATH = `/repos/${REPOSITORY.owner}/${REPOSITORY.repo}/pulls`;
const TARGET_BRANCH = 'main';
const OTHER_BRANCH = 'v7';
const UMBRELLA_BRANCH = `umbrella/${TARGET_BRANCH}`;
const NIGHTLY_BRANCH = 'ci/docgen';
const NIGHTLY_PR_NUMBER = 20;

function getLookupRoute(branch: string) {
	const head = encodeURIComponent(`${REPOSITORY.owner}:${branch}`);
	return `GET ${PULLS_PATH}?state=open&head=${head}&per_page=100`;
}

function buildUmbrella(baseBranch = TARGET_BRANCH) {
	return buildPullRequest({ number: 10, headBranch: UMBRELLA_BRANCH, baseBranch });
}

function buildNightlyPr(baseBranch = TARGET_BRANCH) {
	return buildPullRequest({ number: NIGHTLY_PR_NUMBER, headBranch: NIGHTLY_BRANCH, baseBranch });
}

async function prepare({
	umbrellaPrs = [],
	nightlyPrs = [],
}: {
	umbrellaPrs?: PullRequestDetails[];
	nightlyPrs?: PullRequestDetails[];
}) {
	const { octokit, requests } = createFakeOctokit({
		[getLookupRoute(UMBRELLA_BRANCH)]: { status: 200, body: umbrellaPrs },
		[getLookupRoute(NIGHTLY_BRANCH)]: { status: 200, body: nightlyPrs },
		[`PATCH ${PULLS_PATH}/${NIGHTLY_PR_NUMBER}`]: { status: 200, body: {} },
	});
	const info = mock.method(console, 'info', () => {});
	try {
		const base = await prepareNightlyBase({
			github: octokit,
			context: { repo: REPOSITORY },
			targetBranch: TARGET_BRANCH,
			prBranch: NIGHTLY_BRANCH,
		});
		return {
			base,
			reads: requests.filter(({ route }) => route.startsWith('GET ')).map(({ route }) => route),
			writes: requests.filter(({ route }) => !route.startsWith('GET ')),
			logs: info.mock.calls.map(({ arguments: [message] }) => message),
		};
	} finally {
		info.mock.restore();
	}
}

describe('prepareNightlyBase', () => {
	it('should build on the umbrella of the target branch when one is open', async () => {
		const { base } = await prepare({ umbrellaPrs: [buildUmbrella()] });

		assert.equal(base, UMBRELLA_BRANCH);
	});

	it('should build on the target branch when no umbrella is open', async () => {
		const { base } = await prepare({});

		assert.equal(base, TARGET_BRANCH);
	});

	it('should build on the target branch when its umbrella PR was retargeted to another branch', async () => {
		const { base } = await prepare({ umbrellaPrs: [buildUmbrella(OTHER_BRANCH)] });

		assert.equal(base, TARGET_BRANCH);
	});

	it('should look up only the branches of the repository owner', async () => {
		const { reads } = await prepare({});

		assert.deepEqual(reads, [getLookupRoute(UMBRELLA_BRANCH), getLookupRoute(NIGHTLY_BRANCH)]);
	});

	it('should retarget the nightly PR to the umbrella that opened since its last run', async () => {
		const { writes, logs } = await prepare({
			umbrellaPrs: [buildUmbrella()],
			nightlyPrs: [buildNightlyPr()],
		});

		assert.deepEqual(writes, [
			{ route: `PATCH ${PULLS_PATH}/${NIGHTLY_PR_NUMBER}`, body: { base: UMBRELLA_BRANCH } },
		]);
		assert.ok(
			logs.includes(`Retargeted #${NIGHTLY_PR_NUMBER} from ${TARGET_BRANCH} to ${UMBRELLA_BRANCH}.`)
		);
	});

	it('should retarget the nightly PR to the target branch when its umbrella is no longer open', async () => {
		const { writes } = await prepare({ nightlyPrs: [buildNightlyPr(UMBRELLA_BRANCH)] });

		assert.deepEqual(writes, [
			{ route: `PATCH ${PULLS_PATH}/${NIGHTLY_PR_NUMBER}`, body: { base: TARGET_BRANCH } },
		]);
	});

	it('should leave the nightly PR as it is when it targets the base', async () => {
		const { writes } = await prepare({
			umbrellaPrs: [buildUmbrella()],
			nightlyPrs: [buildNightlyPr(UMBRELLA_BRANCH)],
		});

		assert.deepEqual(writes, []);
	});

	it('should leave a nightly PR with another base as it is', async () => {
		const { writes } = await prepare({
			umbrellaPrs: [buildUmbrella()],
			nightlyPrs: [buildNightlyPr(OTHER_BRANCH)],
		});

		assert.deepEqual(writes, []);
	});
});

import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, type TestContext } from 'node:test';
import { runReleaseQueue } from './main.ts';
import { REPO } from './testing/fixtures.ts';
import { stubGitHub } from './testing/stub-github.ts';

const noFlags = { refresh: false, write: false };
const env = { GITHUB_TOKEN: 'actions-token', GITHUB_REPOSITORY: REPO };

/** Writes `event` to a temporary file, as GitHub Actions does. */
async function writeEvent(event: unknown): Promise<string> {
	const path = join(await mkdtemp(join(tmpdir(), 'release-queue-')), 'event.json');
	await writeFile(path, JSON.stringify(event));
	return path;
}

const silence = (t: TestContext) => t.mock.method(console, 'info', () => {});

describe('runReleaseQueue', () => {
	it('refreshes the open umbrellas with --refresh', async (t) => {
		silence(t);
		const github = stubGitHub(t, {
			getResponses: {
				[`repos/${REPO}/pulls?state=open`]: [],
				'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/main': [],
			},
		});

		await runReleaseQueue({ flags: { ...noFlags, refresh: true }, env });

		assert.equal(github.countReads(`repos/${REPO}/pulls?state=open`), 1);
		assert.deepEqual(github.writes, []);
	});

	it('handles the PR and the sender of the event', async (t) => {
		silence(t);
		const github = stubGitHub(t, {
			getResponses: {
				[`repos/${REPO}/collaborators/contributor/permission`]: { permission: 'read' },
			},
		});
		const path = await writeEvent({
			pull_request: { number: 7 },
			sender: { login: 'contributor' },
		});

		await runReleaseQueue({
			flags: noFlags,
			env: { ...env, GITHUB_ACTIONS: 'true', GITHUB_EVENT_PATH: path },
		});

		// The sender can't write: the run stops after checking it.
		assert.deepEqual(
			github.calls.map(({ path: called }) => called),
			[`repos/${REPO}/collaborators/contributor/permission`]
		);
	});

	it('requires the bot token to write outside a dry run', async () => {
		await assert.rejects(
			runReleaseQueue({
				flags: { ...noFlags, refresh: true },
				env: { ...env, GITHUB_ACTIONS: 'true', MODE: 'all' },
			}),
			/^Error: BOT_TOKEN is required in all mode\.$/
		);
	});
});

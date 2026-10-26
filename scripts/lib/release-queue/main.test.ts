import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it, type TestContext } from 'node:test';
import { runReleaseQueue } from './main.ts';
import { REPO, umbrellaResponse } from './testing/fixtures.ts';
import { stubGitHub } from './testing/stub-github.ts';

const noFlags = { refresh: false };
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

	it('refuses an event without a sender in GitHub Actions', async (t) => {
		const github = stubGitHub(t, {});
		const path = await writeEvent({ pull_request: { number: 7 } });

		await assert.rejects(
			runReleaseQueue({
				flags: noFlags,
				env: { ...env, GITHUB_ACTIONS: 'true', GITHUB_EVENT_PATH: path },
			}),
			/^Error: The event has no sender: the write access check needs one\.$/
		);
		assert.deepEqual(github.calls, []);
	});

	it('only prints the writes of a local run, without the bot token', async (t) => {
		silence(t);
		const github = stubGitHub(t, {
			getResponses: {
				[`repos/${REPO}/pulls?state=open`]: [umbrellaResponse()],
				'repos/withastro/astro/pulls?state=open&head=withastro:changeset-release/main': [],
				[`repos/${REPO}/compare/main...release-queue/main`]: { ahead_by: 0, commits: [] },
				[`repos/${REPO}/pulls/42/reviews`]: [],
				[`repos/${REPO}/pulls?state=open&base=release-queue/main`]: [],
			},
		});

		await runReleaseQueue({ flags: { refresh: true }, env: { ...env, MODE: 'all' } });

		assert.ok(github.calls.length > 0);
		assert.deepEqual(github.writes, []);
	});

	it('requires the bot token to write outside a dry run', async () => {
		await assert.rejects(
			runReleaseQueue({
				flags: { ...noFlags, refresh: true },
				env: { ...env, GITHUB_ACTIONS: 'true', MODE: 'all' },
			}),
			/^Error: BOT_TOKEN is required when MODE is all\.$/
		);
	});
});

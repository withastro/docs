import assert from 'node:assert/strict';
import { describe, it, type TestContext } from 'node:test';
import { GitHubClient } from './github.ts';
import { GitHubError } from './github-error.ts';
import { PrintingGitHubClient } from './printing-github-client.ts';
import { json, stubGitHub } from './testing/stub-github.ts';

/** Replaces `fetch` with one answering `response` to every request. */
function answer(t: TestContext, response: Response) {
	return t.mock.method(globalThis, 'fetch', async () => response);
}

describe('GitHubClient', () => {
	it('answers with the JSON body', async (t) => {
		const fetch = answer(t, json({ number: 7 }));

		const data = await new GitHubClient('token').get('repos/withastro/docs/pulls/7');

		assert.deepEqual(data, { number: 7 });
		const [url, init] = fetch.mock.calls[0].arguments;
		assert.equal(url, 'https://api.github.com/repos/withastro/docs/pulls/7');
		assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer token');
	});

	it('answers `undefined` without a body', async (t) => {
		answer(t, new Response(null, { status: 204 }));

		const data = await new GitHubClient('token').write('DELETE', 'repos/withastro/docs/x');

		assert.equal(data, undefined);
	});

	it('adds the details of a validation error to its reason', async (t) => {
		answer(
			t,
			json(
				{
					message: 'Validation Failed',
					errors: [{ resource: 'PullRequest', message: 'No commits between main and x' }],
				},
				422
			)
		);

		await assert.rejects(
			new GitHubClient('token').write('POST', 'repos/withastro/docs/pulls', {}),
			(error: unknown) => {
				assert.ok(error instanceof GitHubError);
				assert.equal(error.status, 422);
				assert.equal(error.githubReason, 'Validation Failed: No commits between main and x');
				return true;
			}
		);
	});

	it('names the request when a JSON answer is malformed', async (t) => {
		answer(t, new Response('{', { headers: { 'content-type': 'application/json' } }));

		await assert.rejects(
			new GitHubClient('token').get('repos/withastro/docs/pulls/7'),
			/^Error: GET repos\/withastro\/docs\/pulls\/7 isn't valid JSON\.$/
		);
	});

	it('keeps the message alone when an error has no details', async (t) => {
		answer(t, json({ message: 'Not Found' }, 404));

		await assert.rejects(new GitHubClient('token').get('repos/withastro/docs/pulls/0'), {
			githubReason: 'Not Found',
		});
	});

	for (const body of [null, 'Bad gateway']) {
		it(`uses the status text of a JSON error body that is ${JSON.stringify(body)}`, async (t) => {
			answer(
				t,
				new Response(JSON.stringify(body), {
					status: 502,
					statusText: 'Bad Gateway',
					headers: { 'content-type': 'application/json' },
				})
			);

			await assert.rejects(new GitHubClient('token').get('repos/withastro/docs/pulls/7'), {
				name: 'GitHubError',
				status: 502,
				githubReason: 'Bad Gateway',
			});
		});
	}

	it('uses the status text of an error page that is not JSON', async (t) => {
		answer(t, new Response('<html>Bad gateway</html>', { status: 502, statusText: 'Bad Gateway' }));

		await assert.rejects(new GitHubClient('token').get('repos/withastro/docs/pulls/7'), {
			githubReason: 'Bad Gateway',
		});
	});

	it('refuses a successful answer that is not JSON', async (t) => {
		answer(t, new Response('<html>Hello</html>', { status: 200 }));

		await assert.rejects(
			new GitHubClient('token').get('repos/withastro/docs/pulls/7'),
			/^Error: GET repos\/withastro\/docs\/pulls\/7 answered 200 without JSON\.$/
		);
	});

	it('prints writes without sending them when asked to', async (t) => {
		const fetch = answer(t, json({}));
		t.mock.method(console, 'info', () => {});

		const data = await new PrintingGitHubClient('token').write(
			'POST',
			'repos/withastro/docs/issues/7/comments',
			{ body: 'Hello' }
		);

		assert.equal(data, undefined);
		assert.equal(fetch.mock.callCount(), 0);
	});

	it('gets every page of a list', async (t) => {
		const items = Array.from({ length: 130 }, (_, index) => index);
		const fetch = t.mock.method(globalThis, 'fetch', async (url: string) => {
			const page = Number(new URL(url).searchParams.get('page'));
			return json(items.slice((page - 1) * 100, page * 100));
		});

		const all = await new GitHubClient('token').getAll('repos/withastro/docs/labels');

		assert.deepEqual(all, items);
		assert.deepEqual(
			fetch.mock.calls.map(({ arguments: [url] }) => url),
			[
				'https://api.github.com/repos/withastro/docs/labels?per_page=100&page=1',
				'https://api.github.com/repos/withastro/docs/labels?per_page=100&page=2',
			]
		);
	});

	describe('poll', () => {
		const path = 'repos/withastro/docs/pulls/7';
		const isReady = (data: { isReady: boolean }) => data.isReady;

		it('gets the path until the answer is ready', async (t) => {
			let requests = 0;
			const github = stubGitHub(t, {
				getResponses: { [path]: () => ({ isReady: ++requests === 3 }) },
			});

			assert.deepEqual(await github.client().poll(path, { isReady, attempts: 5 }), {
				isReady: true,
			});
			assert.equal(github.countReads(path), 3);
		});

		it('answers with the last answer once the attempts run out', async (t) => {
			const github = stubGitHub(t, { getResponses: { [path]: { isReady: false } } });

			assert.deepEqual(await github.client().poll(path, { isReady, attempts: 2 }), {
				isReady: false,
			});
			assert.equal(github.countReads(path), 2);
		});
	});
});

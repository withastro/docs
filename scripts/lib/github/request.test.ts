import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { jsonResponse, mockFetch } from './fetch-mock.ts';
import { getAllPages, GitHubError, sendRequest } from './request.ts';

const TOKEN = 'test-token';

describe('sendRequest', () => {
	it('should send the request with the GitHub headers', async (t) => {
		const fetchMock = mockFetch(t, jsonResponse({ id: 1 }));

		await sendRequest({ token: TOKEN, method: 'POST', path: '/repos/a/b/issues', body: { x: 1 } });
		const [url, init] = fetchMock.mock.calls[0].arguments;
		const headers = new Headers(init?.headers);

		assert.equal(url, 'https://api.github.com/repos/a/b/issues');
		assert.equal(init?.method, 'POST');
		assert.equal(init?.body, '{"x":1}');
		assert.equal(headers.get('Authorization'), `Bearer ${TOKEN}`);
		assert.equal(headers.get('Accept'), 'application/vnd.github+json');
		assert.equal(headers.get('Content-Type'), 'application/json');
		assert.ok(headers.get('User-Agent'));
		assert.ok(headers.get('X-GitHub-Api-Version'));
	});

	it('should send no body when none is given', async (t) => {
		const fetchMock = mockFetch(t, jsonResponse({}));

		await sendRequest({ token: TOKEN, method: 'GET', path: '/repos/a/b' });
		const [, init] = fetchMock.mock.calls[0].arguments;

		assert.equal(init?.body, undefined);
	});

	it('should return the parsed JSON body', async (t) => {
		mockFetch(t, jsonResponse({ number: 7 }));

		const result = await sendRequest({ token: TOKEN, method: 'GET', path: '/repos/a/b/pulls/7' });

		assert.deepEqual(result, { number: 7 });
	});

	it('should return undefined for a response without content', async (t) => {
		mockFetch(t, new Response(null, { status: 204 }));

		const result = await sendRequest({ token: TOKEN, method: 'DELETE', path: '/x' });

		assert.equal(result, undefined);
	});

	it('should throw a GitHubError with the status and the message from GitHub', async (t) => {
		mockFetch(
			t,
			jsonResponse(
				{
					message: 'Validation Failed',
					errors: [{ resource: 'PullRequest', code: 'custom', message: 'No commits between' }],
				},
				{ status: 422, statusText: 'Unprocessable Entity' }
			)
		);

		const request = sendRequest({ token: TOKEN, method: 'POST', path: '/repos/a/b/pulls' });

		await assert.rejects(request, (error) => {
			assert.ok(error instanceof GitHubError);
			assert.equal(error.status, 422);
			assert.equal(error.apiMessage, 'Validation Failed');
			assert.equal(error.isNotFound, false);
			assert.match(error.message, /POST \/repos\/a\/b\/pulls/);
			assert.match(error.message, /Validation Failed/);
			assert.match(error.message, /No commits between/);
			return true;
		});
	});

	it('should throw a GitHubError that tells a "Not Found" answer', async (t) => {
		mockFetch(t, jsonResponse({ message: 'Not Found' }, { status: 404 }));

		const request = sendRequest({ token: TOKEN, method: 'GET', path: '/repos/a/b' });

		await assert.rejects(request, (error) => {
			assert.ok(error instanceof GitHubError);
			assert.equal(error.isNotFound, true);
			return true;
		});
	});

	it('should throw a GitHubError with the status text when the error has no JSON body', async (t) => {
		mockFetch(t, new Response('<html>', { status: 502, statusText: 'Bad Gateway' }));

		const request = sendRequest({ token: TOKEN, method: 'GET', path: '/x' });

		await assert.rejects(request, (error) => {
			assert.ok(error instanceof GitHubError);
			assert.equal(error.status, 502);
			assert.equal(error.apiMessage, 'Bad Gateway');
			assert.match(error.message, /Bad Gateway/);
			return true;
		});
	});

	it('should throw when a successful response is not JSON', async (t) => {
		mockFetch(t, new Response('<html>', { status: 200, headers: { 'Content-Type': 'text/html' } }));

		const request = sendRequest({ token: TOKEN, method: 'GET', path: '/x' });

		await assert.rejects(request, /from GET \/x, got text\/html/);
	});
});

describe('getAllPages', () => {
	it('should request the largest page size and keep the existing query', async (t) => {
		const fetchMock = mockFetch(t, jsonResponse([]));

		await getAllPages({ token: TOKEN, path: '/repos/a/b/pulls?state=open' });
		const [url] = fetchMock.mock.calls[0].arguments;

		assert.equal(url, 'https://api.github.com/repos/a/b/pulls?state=open&per_page=100');
	});

	it('should follow the next links and join the pages', async (t) => {
		const nextUrl = 'https://api.github.com/repositories/1/pulls?state=open&per_page=100&page=2';
		const fetchMock = mockFetch(
			t,
			jsonResponse([1, 2], {
				headers: { Link: `<${nextUrl}>; rel="next", <${nextUrl}>; rel="last"` },
			}),
			jsonResponse([3], {
				headers: { Link: '<https://api.github.com/repositories/1/pulls?page=1>; rel="prev"' },
			})
		);

		const items = await getAllPages({ token: TOKEN, path: '/repos/a/b/pulls?state=open' });

		assert.deepEqual(items, [1, 2, 3]);
		assert.equal(fetchMock.mock.callCount(), 2);
		assert.equal(fetchMock.mock.calls[1].arguments[0], nextUrl);
	});

	it('should find the next link after the previous one', async (t) => {
		const nextUrl = 'https://api.github.com/repositories/1/pulls?page=3';
		mockFetch(
			t,
			jsonResponse([2], {
				headers: {
					Link: `<https://api.github.com/repositories/1/pulls?page=1>; rel="prev", <${nextUrl}>; rel="next"`,
				},
			}),
			jsonResponse([3])
		);

		const items = await getAllPages({ token: TOKEN, path: '/repositories/1/pulls?page=2' });

		assert.deepEqual(items, [2, 3]);
	});

	it('should throw when a page is not a list', async (t) => {
		mockFetch(t, jsonResponse({ total_count: 0 }));

		const request = getAllPages({ token: TOKEN, path: '/repos/a/b/pulls' });

		await assert.rejects(
			request,
			/Unexpected response from GET \/repos\/a\/b\/pulls: the body should be a list, got object\./
		);
	});
});

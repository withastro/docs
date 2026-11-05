import assert from 'node:assert/strict';
import type { TestContext } from 'node:test';

/**
 * Replaces `fetch` with one answering the given responses in order.
 *
 * The test fails when it sends more requests than there are responses, or fewer.
 */
export function mockFetch(t: TestContext, ...responses: Response[]) {
	const queue = [...responses];
	t.after(() => assert.equal(queue.length, 0, 'Unused mocked responses.'));
	return t.mock.method(globalThis, 'fetch', async () => {
		const response = queue.shift();
		if (!response) throw new Error('Unexpected request.');
		return response;
	});
}

/** Creates a response with a JSON body and the matching `Content-Type`. */
export function jsonResponse(body: unknown, init: ResponseInit = {}) {
	const headers = new Headers(init.headers);
	headers.set('Content-Type', 'application/json; charset=utf-8');
	return new Response(JSON.stringify(body), { ...init, headers });
}

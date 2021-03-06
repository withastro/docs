import fetch from 'node-fetch';

/**
 * Fetch a URL from the GitHub API and resolve its JSON response.
 * @param {{ url: string; githubToken?: string }} options
 * @returns {Promise<any>}
 */
export async function githubGet({ url, githubToken = undefined }) {
	const headers = {
		Accept: 'application/vnd.github.v3+json',
	};
	if (githubToken) {
		headers.Authorization = `token ${githubToken}`;
	}
	const response = await fetch(url, {
		headers,
	});
	const json = await response.json();

	if (!response.ok) {
		throw new Error(`GitHub API call failed: GET "${url}" returned status ${response.status}: ${JSON.stringify(json)}`);
	}

	return json;
}

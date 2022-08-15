import fetch from 'node-fetch';

const MAX_RETRIES = 5;

/**
 * Fetch a URL from the GitHub API and resolve its JSON response.
 * @param {{ url: string; githubToken?: string; attempt?: number; }} options
 * @returns {Promise<any>}
 */
export async function githubGet({ url, githubToken = undefined, attempt = 0 }) {
	const headers = {
		Accept: 'application/vnd.github.v3+json',
	};
	if (githubToken) {
		headers.Authorization = `token ${githubToken}`;
	}
	try {
		const response = await fetch(url, { headers });
		const json = await response.json();
		if (!response.ok) {
			throw new Error(`GitHub API call failed: GET "${url}" returned status ${response.status}: ${JSON.stringify(json)}`);
		}
		return json;
	} catch (error) {
		if (attempt >= MAX_RETRIES) throw error;
		return await githubGet({ url, githubToken, attempt: attempt + 1 });
	}
}

import fs from 'node:fs/promises';

await run();

async function run() {
	const repo = 'withastro/docs';
	console.info(`Fetching contributors for ${repo}…`);

	const contributors = await getAllContributors(repo);
	await fs.writeFile('./src/data/contributors.json', JSON.stringify(contributors, null, 2) + '\n');

	console.info(`Saved ${contributors.length} contributors.`);
}

async function getAllContributors(repo: string) {
	const endpoint = `repos/${repo}/contributors`;
	const contributors = await recursiveFetch(endpoint);

	return contributors;
}

async function recursiveFetch(endpoint: string, page = 1): Promise<Contributor[]> {
	const contributors: Contributor[] = [];
	try {
		const queryParam = endpoint.includes('?') ? '&' : '?';
		const pageSize = 100;
		const url = `https://api.github.com/${endpoint}${queryParam}per_page=${pageSize}&page=${page}`;

		const token = process.env.GITHUB_TOKEN ?? '';

		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: token && `Basic ${Buffer.from(token, 'binary').toString('base64')}`,
				'User-Agent': 'astro-docs/1.0',
			},
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(
				`Request to fetch endpoint failed. Reason: ${res.statusText}
         Message: ${data?.message}`
			);
		}

		contributors.push(
			...data.map((contributor: Contributor) => ({
				id: contributor.id,
				login: contributor.login,
			}))
		);

		// Fetch more data recursively if there are more than GitHub’s per-page response limit.
		if (data.length === pageSize) {
			const rest = await recursiveFetch(endpoint, page + 1);
			contributors.push(...rest);
		}

		return contributors;
	} catch (error) {
		console.error(
			`[error]  /scripts/weekly-contributors.ts\n         ${error instanceof Error ? error.message : String(error)}`
		);
		return [];
	}
}

interface Contributor {
	id: number;
	login: string;
}

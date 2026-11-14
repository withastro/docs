// Runs the release assistant locally. It logs its writes to GitHub instead of
// sending them.
// GITHUB_TOKEN=<token> node scripts/release-assistant/preview.ts [--mode live]

import { getOctokit } from '@actions/github';
import { parseArgs } from 'node:util';
import { runReleaseAssistant } from '../release-assistant.ts';
import { DOCS_REPOSITORY, MODES } from './config.ts';
import { addReadOnlyHook } from './github/read-only.ts';

async function preview() {
	const { values: flags } = parseArgs({
		options: {
			mode: { type: 'string', default: MODES.dryRun },
		},
	});
	// Any token that can read the repositories.
	const token = process.env.GITHUB_TOKEN;
	if (!token) throw new Error('The GITHUB_TOKEN environment variable is required.');

	console.info('Read-only run: the writes are logged, not sent.');
	const github = getOctokit(token);
	addReadOnlyHook(github, console.info);
	const context = {
		repo: DOCS_REPOSITORY,
	};
	// Locally, one token serves both clients.
	await runReleaseAssistant({ github, workflowGithub: github, context, mode: flags.mode });
}

await preview();

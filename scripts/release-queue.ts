// Routes docs PRs labeled as accepted to the umbrella PR of their release.
// Locally: `GITHUB_TOKEN=$(gh auth token) node --experimental-transform-types ./scripts/release-queue.ts --pr <number>`.

import { parseArgs } from 'node:util';
import { runReleaseQueue } from './lib/release-queue/main.ts';

// The flags are for local runs, which only print what they would write. In
// GitHub Actions, the PR and the sender come from the event, and a
// `workflow_dispatch` refreshes every open umbrella PR.
const { values: flags } = parseArgs({
	options: {
		// The docs PR to route.
		pr: { type: 'string' },
		// Print what a refresh of every open umbrella PR would change, instead of
		// routing `--pr`.
		'preview-refresh': { type: 'boolean', default: false },
		// Who added the label, for the write access check.
		sender: { type: 'string' },
	},
});

await runReleaseQueue({ flags, env: process.env });

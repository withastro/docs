// Routes docs PRs labeled as accepted to the umbrella PR of their release.
// Locally: `GITHUB_TOKEN=$(gh auth token) node --experimental-transform-types ./scripts/release-queue.ts --pr <number>`.

import { parseArgs } from 'node:util';
import { runReleaseQueue } from './lib/release-queue/main.ts';

// In GitHub Actions, the PR and the sender come from the event, and a
// `workflow_dispatch` refreshes every open umbrella PR.
const { values: flags } = parseArgs({
	options: {
		// The docs PR to route.
		pr: { type: 'string' },
		// Refresh every open umbrella PR, instead of routing `--pr`.
		refresh: { type: 'boolean', default: false },
		// Who added the label, for the write access check.
		sender: { type: 'string' },
	},
});

await runReleaseQueue({ flags, env: process.env });

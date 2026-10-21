// Routes docs PRs labeled `accepted` to the umbrella PR of their release.
// Locally: `GITHUB_TOKEN=$(gh auth token) node --experimental-transform-types ./scripts/release-queue.ts --pr <number>`.

import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { GitHubClient } from './lib/release-queue/github.ts';
import {
	MODES,
	handleAcceptedPullRequest,
	needsBotToken,
} from './lib/release-queue/handle-accepted.ts';

// In GitHub Actions, the PR and the sender come from the event.
// `--sender`: who added the label, for the write access check.
// `--write`: send the writes instead of printing them, outside GitHub Actions.
const { values } = parseArgs({
	options: {
		pr: { type: 'string' },
		sender: { type: 'string' },
		write: { type: 'boolean', default: false },
	},
});

const repo = process.env.GITHUB_REPOSITORY ?? 'withastro/docs';
const mode = MODES.find((value) => value === (process.env.MODE ?? 'dry-run'));
if (!mode) throw new Error(`Unknown MODE: ${process.env.MODE}. Expected one of: ${MODES}.`);

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN is required.');
const shouldWrite = process.env.GITHUB_ACTIONS === 'true' || values.write;
// Changes go through the bot account: unlike `GITHUB_TOKEN`, its merges into
// an umbrella branch trigger the checks of the umbrella PR.
const botToken = process.env.BOT_TOKEN;
if (needsBotToken(mode, shouldWrite) && !botToken) {
	throw new Error(`BOT_TOKEN is required in ${mode} mode.`);
}

const clientOptions = { shouldPrintWrites: !shouldWrite };
const actionsClient = new GitHubClient(token, clientOptions);
const botClient = new GitHubClient(botToken ?? token, clientOptions);

const event = process.env.GITHUB_EVENT_PATH
	? JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf-8'))
	: undefined;
const prNumber = Number(values.pr ?? event?.pull_request?.number);
if (!prNumber) throw new Error('No PR to process: pass --pr <number>.');

await handleAcceptedPullRequest(
	{ actionsClient, botClient, repo, mode },
	prNumber,
	values.sender ?? event?.sender?.login
);

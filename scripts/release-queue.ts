// Routes docs PRs labeled `accepted` to the umbrella PR of their release.
// Locally: `GITHUB_TOKEN=$(gh auth token) node --experimental-transform-types ./scripts/release-queue.ts --pr <number>`.

import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { chooseAction } from './lib/release-queue/cli.ts';
import { GitHubClient } from './lib/release-queue/github.ts';
import { handleAcceptedPullRequest } from './lib/release-queue/handle-accepted.ts';
import { needsBotToken, parseMode, type QueueOptions } from './lib/release-queue/modes.ts';
import { refreshOpenUmbrellas } from './lib/release-queue/refresh.ts';

// In GitHub Actions, the PR and the sender come from the event, and a
// `workflow_dispatch` refreshes every open umbrella PR.
// `--refresh`: refresh every open umbrella PR, instead of handling `--pr`.
// `--sender`: who added the label, for the write access check.
// `--write`: send the writes instead of printing them, outside GitHub Actions.
const { values } = parseArgs({
	options: {
		pr: { type: 'string' },
		refresh: { type: 'boolean', default: false },
		sender: { type: 'string' },
		write: { type: 'boolean', default: false },
	},
});

const repo = process.env.GITHUB_REPOSITORY ?? 'withastro/docs';
const mode = parseMode(process.env.MODE);

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
const options: QueueOptions = { actionsClient, botClient, repo, mode };

const event = process.env.GITHUB_EVENT_PATH
	? JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf-8'))
	: undefined;
const action = chooseAction({
	pr: values.pr,
	refresh: values.refresh,
	eventName: process.env.GITHUB_EVENT_NAME,
	eventPullRequest: event?.pull_request?.number,
});

if (action.type === 'refresh') {
	await refreshOpenUmbrellas(options);
} else {
	await handleAcceptedPullRequest(options, action.number, values.sender ?? event?.sender?.login);
}

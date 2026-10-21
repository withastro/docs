// Routes docs PRs labeled `accepted` to the umbrella PR of their release.
// Locally: `GITHUB_TOKEN=$(gh auth token) node --experimental-transform-types ./scripts/release-queue.ts --pr <number>`.

import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { GitHubClient } from './lib/release-queue/github.ts';
import { formatDryRunComment, type MessageContext } from './lib/release-queue/messages.ts';
import {
	canWrite,
	findOpenPullRequest,
	getPullRequest,
	getReadiness,
	getReleasePullRequest,
} from './lib/release-queue/queries.ts';
import { getMainRelease } from './lib/release-queue/release.ts';
import { decide, UMBRELLA_PREFIX } from './lib/release-queue/routing.ts';
import { getUmbrellaTitle } from './lib/release-queue/umbrella.ts';

// `dry-run`: only comments with the umbrella a PR would join, or why not.
const MODES = ['dry-run'];

const { values } = parseArgs({
	options: {
		pr: { type: 'string' },
		sender: { type: 'string' },
		write: { type: 'boolean', default: false },
	},
});

const repo = process.env.GITHUB_REPOSITORY ?? 'withastro/docs';
const mode = process.env.MODE ?? 'dry-run';
if (!MODES.includes(mode)) throw new Error(`Unknown MODE: ${mode}. Expected one of: ${MODES}.`);

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN is required.');
// Outside GitHub Actions, only print the writes, unless `--write` is passed.
const shouldWrite = process.env.GITHUB_ACTIONS === 'true' || values.write;
const gh = new GitHubClient(token, { shouldPrintWrites: !shouldWrite });

const event = process.env.GITHUB_EVENT_PATH
	? JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf-8'))
	: undefined;
const prNumber = Number(values.pr ?? event?.pull_request?.number);
if (!prNumber) throw new Error('No PR to process: pass --pr <number>.');

await processPullRequest(prNumber, values.sender ?? event?.sender?.login);

async function processPullRequest(number: number, sender: string | undefined) {
	if (sender === undefined) {
		console.info('No sender: skipping the write access check.');
	} else if (!(await canWrite(gh, repo, sender))) {
		console.info(`Ignored: ${sender} can't write to ${repo}.`);
		return;
	}

	const pr = await getPullRequest(gh, repo, number);
	const [readiness, releasePullRequest] = await Promise.all([
		getReadiness(gh, repo, pr),
		getReleasePullRequest(gh),
	]);
	const mainRelease = getMainRelease(releasePullRequest?.versions);
	const decision = decide(pr, readiness, mainRelease);
	console.info(JSON.stringify({ pr: pr.url, readiness, mainRelease, decision }, null, 2));

	const context: MessageContext = {};
	if (decision.route) {
		const { umbrellaBranch, target } = decision.route;
		context.umbrella = (await findOpenPullRequest(gh, repo, umbrellaBranch)) ?? {
			title: getUmbrellaTitle(target, mainRelease.astroVersion),
		};
	}
	if (decision.refusals.some((refusal) => refusal.code === 'major-on-main')) {
		context.mainUmbrella = await findOpenPullRequest(gh, repo, `${UMBRELLA_PREFIX}main`);
	}

	await gh.write('POST', `repos/${repo}/issues/${number}/comments`, {
		body: formatDryRunComment(decision, context),
	});
}

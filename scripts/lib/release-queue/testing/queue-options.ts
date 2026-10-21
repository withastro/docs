import type { Mode, QueueOptions } from '../modes.ts';
import { REPO } from './fixtures.ts';
import type { stubGitHub } from './stub-github.ts';

// Distinct tokens tell the writes of each identity apart.
export const ACTIONS_TOKEN = 'actions-token';
export const BOT_TOKEN = 'bot-token';

/** Options for both entry points, with a client per identity of the stub. */
export function queueOptions(github: ReturnType<typeof stubGitHub>, mode: Mode): QueueOptions {
	return {
		actionsClient: github.client(ACTIONS_TOKEN),
		botClient: github.client(BOT_TOKEN),
		repo: REPO,
		mode,
	};
}

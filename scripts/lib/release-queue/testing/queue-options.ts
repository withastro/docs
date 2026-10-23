import { FRAMEWORK_REPO } from '../config.ts';
import type { Mode } from '../modes.ts';
import type { QueueOptions } from '../options.ts';
import { REPO } from './fixtures.ts';
import type { stubGitHub } from './stub-github.ts';

// Distinct tokens tell the writes of each identity apart.
export const ACTIONS_TOKEN = 'actions-token';
export const BOT_TOKEN = 'bot-token';

/** Options for both entry points, with a repository per identity. */
export function queueOptions(github: ReturnType<typeof stubGitHub>, mode: Mode): QueueOptions {
	return {
		actions: github.repository(REPO, { token: ACTIONS_TOKEN }),
		bot: github.repository(REPO, { token: BOT_TOKEN }),
		framework: github.repository(FRAMEWORK_REPO, { token: ACTIONS_TOKEN }),
		mode,
	};
}

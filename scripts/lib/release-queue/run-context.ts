import type { Repository } from './github/repository.ts';
import type { Mode } from './modes.ts';

/** The docs repository, and the framework repository for its release PRs. */
export interface Repositories {
	docs: Repository;
	framework: Repository;
}

/**
 * What a run works with, whether it handles a PR or refreshes umbrellas: the
 * repositories it acts through, and the mode.
 */
export interface RunContext {
	/**
	 * The docs repository through `GITHUB_TOKEN`: reads the PR, posts dry-run
	 * comments, and submits merge-block reviews.
	 */
	actions: Repository;
	/** The docs repository as the bot account: joins, refuses, and refreshes. */
	bot: Repository;
	/** The framework repository, read for its release PRs. */
	framework: Repository;
	mode: Mode;
}

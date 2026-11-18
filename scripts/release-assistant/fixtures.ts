import { CHECK_STATES } from './github/checks.ts';
import { FakeRepository, MAINTAINER, type FakeRepositoryState } from './github/fake-repository.ts';
import type { PullRequestDetails } from './github/repository.ts';
import { REVIEW_STATES } from './github/reviews.ts';
import type { ReleaseAssistantContext } from './run.ts';

/** The branches of the umbrella of the stable docs branch. */
export const MAIN_BRANCHES = { head: 'umbrella/main', base: 'main' };

/**
 * Builds the state of a docs PR that can join its umbrella.
 *
 * @param {PullRequestDetails} pullRequest - The pull request.
 * @returns {FakeRepositoryState} The state of the repository holding it.
 */
export function buildReadyState(pullRequest: PullRequestDetails): FakeRepositoryState {
	return {
		pullRequests: [pullRequest],
		reviewStatesByPrNumber: { [pullRequest.number]: { [MAINTAINER]: REVIEW_STATES.approved } },
		checksByRef: { [pullRequest.head.sha]: [{ name: 'build', state: CHECK_STATES.success }] },
	};
}

/**
 * Creates the context of a run on fake repositories.
 *
 * @param {FakeRepository} docs - The docs repository.
 * @param {FakeRepository} [astro] - The framework repository.
 * @returns {{ context: ReleaseAssistantContext; logs: string[] }} The context, and the lines it logged.
 */
export function createContext(
	docs: FakeRepository,
	astro = new FakeRepository({})
): { context: ReleaseAssistantContext; logs: string[] } {
	const logs: string[] = [];
	const log = (message: string) => {
		logs.push(message);
	};
	return { context: { docs, astro, log }, logs };
}

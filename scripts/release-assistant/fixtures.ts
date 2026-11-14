import { FakeRepository } from './github/fake-repository.ts';
import type { ReleaseAssistantContext } from './run.ts';

/** The branches of the umbrella of the stable docs branch. */
export const MAIN_BRANCHES = { head: 'umbrella/main', base: 'main' };

/**
 * Creates the context of a run on a fake repository.
 *
 * @param {FakeRepository} docs - The docs repository.
 * @returns {{ context: ReleaseAssistantContext; logs: string[] }} The context, and the lines it logged.
 */
export function createContext(docs: FakeRepository): {
	context: ReleaseAssistantContext;
	logs: string[];
} {
	const logs: string[] = [];
	const log = (message: string) => {
		logs.push(message);
	};
	return { context: { docs, log }, logs };
}

import type {
	GitHubRepository,
	PullRequest,
	PullRequestChanges,
} from '../lib/github/repository.ts';
import type { FrameworkReleases } from './release.ts';
import { getIncludedPrNumbers, getUmbrellaBranch, planUmbrellaUpdate } from './umbrella.ts';

type UmbrellaRepository = Pick<
	GitHubRepository,
	'compare' | 'updatePullRequest' | 'addLabels' | 'removeLabel'
>;

type RefreshContext = {
	docs: UmbrellaRepository;
	log: (message: string) => void;
};

export type Umbrella = Pick<PullRequest, 'number' | 'title' | 'body' | 'labels' | 'base'>;

/**
 * Updates the title, the description, and the labels of an umbrella PR from the release it ships
 * with and the PRs merged into its branch.
 *
 * Sends nothing for what is already up to date.
 *
 * @param {RefreshContext} context - The docs repository, and where to log.
 * @param {Umbrella} umbrella - The umbrella PR.
 * @param {FrameworkReleases} releases - The open releases of the framework.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function refreshUmbrella(
	{ docs, log }: RefreshContext,
	umbrella: Umbrella,
	releases: FrameworkReleases
): Promise<void> {
	const baseBranch = umbrella.base.ref;
	const comparison = await docs.compare(baseBranch, getUmbrellaBranch(baseBranch));
	const update = planUmbrellaUpdate(umbrella, releases, getIncludedPrNumbers(comparison));
	const changes = getChangedFields(umbrella, update);
	const hasChanges = Object.keys(changes).length > 0;
	if (hasChanges) await docs.updatePullRequest(umbrella.number, changes);
	if (update.labelsToAdd.length > 0) await docs.addLabels(umbrella.number, update.labelsToAdd);
	for (const label of update.labelsToRemove) await docs.removeLabel(umbrella.number, label);

	const isChanged = hasChanges || update.labelsToAdd.length > 0 || update.labelsToRemove.length > 0;
	log(
		isChanged
			? `Umbrella #${umbrella.number} refreshed.`
			: `Umbrella #${umbrella.number} is up to date.`
	);
}

function getChangedFields(
	umbrella: Pick<Umbrella, 'title' | 'body'>,
	{ title, body }: Pick<PullRequestChanges, 'title' | 'body'>
): PullRequestChanges {
	return {
		...(title !== umbrella.title && { title }),
		...(body !== umbrella.body && { body }),
	};
}

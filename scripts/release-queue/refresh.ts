import type { GitHubRepository, PullRequest } from '../lib/github/repository.ts';
import type { FrameworkReleases } from './release.ts';
import { planUmbrellaUpdate } from './umbrella.ts';

type UmbrellaRepository = Pick<GitHubRepository, 'updatePullRequest' | 'addLabels' | 'removeLabel'>;

type RefreshContext = {
	docs: UmbrellaRepository;
	log: (message: string) => void;
};

export type Umbrella = Pick<PullRequest, 'number' | 'title' | 'labels' | 'base'>;

/**
 * Updates the title and the labels of an umbrella PR from the release it ships with.
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
	const { title, labelsToAdd, labelsToRemove } = planUmbrellaUpdate(umbrella, releases);
	const isTitleChanged = title !== umbrella.title;
	if (isTitleChanged) await docs.updatePullRequest(umbrella.number, { title });
	if (labelsToAdd.length > 0) await docs.addLabels(umbrella.number, labelsToAdd);
	for (const label of labelsToRemove) await docs.removeLabel(umbrella.number, label);

	const isChanged = isTitleChanged || labelsToAdd.length > 0 || labelsToRemove.length > 0;
	log(
		isChanged
			? `Umbrella #${umbrella.number} refreshed.`
			: `Umbrella #${umbrella.number} is up to date.`
	);
}

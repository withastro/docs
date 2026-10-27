import {
	GitHubRepository,
	type CreatedPullRequest,
	type MergeOptions,
	type NewPullRequest,
	type PullRequestChanges,
	type RepositoryOptions,
} from './repository.ts';

type ReadOnlyRepositoryOptions = RepositoryOptions & {
	/** Receives one line for each write, instead of sending it. */
	log: (message: string) => void;
};

/**
 * A GitHub repository for local runs that sends reads, and logs writes instead
 * of sending them.
 *
 * Each write is logged as `Read-only: <method> <arguments>`, with the
 * arguments in JSON.
 */
export class ReadOnlyRepository extends GitHubRepository {
	#log: (message: string) => void;

	/**
	 * @param {ReadOnlyRepositoryOptions} options - How to reach the repository, and where to log.
	 * @throws {Error} When the name is not `owner/repo`.
	 * @throws {Error} When the token is empty.
	 */
	constructor({ log, ...repositoryOptions }: ReadOnlyRepositoryOptions) {
		super(repositoryOptions);
		this.#log = log;
	}

	/**
	 * Logs the pull request instead of opening it.
	 *
	 * @param {NewPullRequest} pullRequest - The pull request to log.
	 * @returns {Promise<CreatedPullRequest>} A pull request numbered 0, with an empty URL, since none is created.
	 */
	override async createPullRequest(pullRequest: NewPullRequest): Promise<CreatedPullRequest> {
		this.#logWrite('createPullRequest', [pullRequest]);
		return { number: 0, html_url: '' };
	}

	override async addLabels(prNumber: number, labels: readonly string[]): Promise<void> {
		this.#logWrite('addLabels', [prNumber, labels]);
	}

	override async removeLabel(prNumber: number, label: string): Promise<void> {
		this.#logWrite('removeLabel', [prNumber, label]);
	}

	override async updatePullRequest(prNumber: number, changes: PullRequestChanges): Promise<void> {
		this.#logWrite('updatePullRequest', [prNumber, changes]);
	}

	override async mergePullRequest(prNumber: number, options: MergeOptions): Promise<void> {
		this.#logWrite('mergePullRequest', [prNumber, options]);
	}

	override async createComment(prNumber: number, body: string): Promise<void> {
		this.#logWrite('createComment', [prNumber, body]);
	}

	override async requestChanges(prNumber: number, body: string): Promise<void> {
		this.#logWrite('requestChanges', [prNumber, body]);
	}

	#logWrite(method: string, args: unknown[]) {
		this.#log(`Read-only: ${method} ${JSON.stringify(args)}`);
	}
}

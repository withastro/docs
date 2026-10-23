// The fields the bot reads from GitHub API responses.

export type PullRequestState = 'open' | 'closed';

export interface PullRequestResponse {
	number: number;
	title: string;
	html_url: string;
	state: PullRequestState;
	draft: boolean;
	mergeable: boolean | null;
	base: { ref: string };
	/** `repo` is `null` when the fork was deleted. */
	head: { ref: string; sha: string; repo?: { full_name: string } | null };
	labels: { name: string }[];
	body: string | null;
	merged?: boolean;
}

export interface CompareResponse {
	ahead_by: number;
	/** At most 250 commits, oldest first. */
	commits: { commit: { message: string } }[];
}

export type ReviewResponseState =
	| 'APPROVED'
	| 'CHANGES_REQUESTED'
	| 'COMMENTED'
	| 'DISMISSED'
	| 'PENDING';

export interface ReviewResponse {
	/** `null` for a deleted account. */
	user: { login: string } | null;
	state: ReviewResponseState;
}

export interface CheckRunResponse {
	name: string;
	status: 'queued' | 'in_progress' | 'completed' | 'waiting' | 'requested' | 'pending';
	conclusion: CheckConclusion | null;
}

export type CheckConclusion =
	| 'action_required'
	| 'cancelled'
	| 'failure'
	| 'neutral'
	| 'skipped'
	| 'stale'
	| 'success'
	| 'timed_out';

export interface CommitStatusResponse {
	context: string;
	state: 'error' | 'failure' | 'pending' | 'success';
}

/** A rule of a ruleset. GitHub adds rule types over time. */
export interface RuleResponse {
	type: string;
	parameters?: { required_status_checks?: { context: string }[] };
}

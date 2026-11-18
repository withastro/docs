export const REVIEW_STATES = {
	approved: 'APPROVED',
	changesRequested: 'CHANGES_REQUESTED',
	commented: 'COMMENTED',
	dismissed: 'DISMISSED',
	pending: 'PENDING',
} as const;

export type ReviewState = (typeof REVIEW_STATES)[keyof typeof REVIEW_STATES];

const DECISIVE_REVIEW_STATES: string[] = [
	REVIEW_STATES.approved,
	REVIEW_STATES.changesRequested,
	REVIEW_STATES.dismissed,
];

/** The fields of a review the release assistant reads, as GitHub names them. */
export type Review = {
	id: number;
	/** `null` when the account was deleted. */
	user: { login: string } | null;
	/** One of `REVIEW_STATES`. */
	state: string;
	/** The text of the review, in Markdown. Empty when the reviewer wrote none. */
	body: string;
};

export type ReviewUpdate = {
	reviewId: number;
	/** The new text, in Markdown. */
	body: string;
};

/**
 * Tells whether a review state replaces the reviewer's earlier ones.
 *
 * @param {string} state - The state of a review, as GitHub sends it.
 * @returns {boolean} `true` for an approval, a change request, or a dismissal.
 */
export function isDecisiveReviewState(state: string): state is ReviewState {
	return DECISIVE_REVIEW_STATES.includes(state);
}

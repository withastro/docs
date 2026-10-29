import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	renderDryRunComment,
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import { MAIN_BRANCHES } from './fake-repository.ts';
import { OUTCOMES, REFUSAL_REASONS } from './join-decision.ts';

describe('renderRefusalComment', () => {
	it('should give the reason, then how to retry', () => {
		const comment = renderRefusalComment({
			reasons: [REFUSAL_REASONS.missingReleaseLabel],
			branches: MAIN_BRANCHES,
		});

		assert.match(comment, /^This PR has no release label\./);
		assert.match(comment, /add `accepted` again\.$/);
	});

	it('should list several reasons', () => {
		const comment = renderRefusalComment({
			reasons: [REFUSAL_REASONS.missingApproval, REFUSAL_REASONS.failingChecks],
			branches: MAIN_BRANCHES,
		});

		assert.match(comment, /^This PR can't join its umbrella yet:\n\n- .+\n- .+\n\n/);
	});
});

describe('renderDryRunComment', () => {
	it('should name the umbrella branch a PR would join, and its base branch', () => {
		const comment = renderDryRunComment({
			outcome: OUTCOMES.join,
			branches: MAIN_BRANCHES,
		});

		assert.match(comment, /^\*\*Dry run\*\*/);
		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /into `main`/);
	});

	it('should quote the comment a refused PR would get', () => {
		const comment = renderDryRunComment({
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
			branches: MAIN_BRANCHES,
		});
		const refusalComment = renderRefusalComment({
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
			branches: MAIN_BRANCHES,
		});
		const quotedRefusalComment = refusalComment.replaceAll(/^/gm, '> ').replaceAll('> \n', '>\n');

		assert.match(comment, /^\*\*Dry run\*\*/);
		assert.ok(comment.includes(quotedRefusalComment));
	});
});

describe('renderJoinedComment', () => {
	it('should name the umbrella branch and link the umbrella PR', () => {
		const comment = renderJoinedComment(MAIN_BRANCHES, 1000);

		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /#1000/);
	});
});

describe('renderMergeFailureComment', () => {
	it("should give GitHub's reason, then how to retry", () => {
		const comment = renderMergeFailureComment(MAIN_BRANCHES, 'Merge conflict');

		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /Merge conflict/);
		assert.match(comment, /add `accepted` again\.$/);
	});
});

describe('renderUmbrellaFailureComment', () => {
	it("should say the PR is merged, give GitHub's reason, and ask for the umbrella by hand", () => {
		const comment = renderUmbrellaFailureComment(MAIN_BRANCHES, 'Validation Failed');

		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /Validation Failed/);
		assert.match(comment, /into `main`/);
	});
});

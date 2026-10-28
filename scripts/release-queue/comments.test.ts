import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	renderDryRunComment,
	renderJoinedComment,
	renderMergeFailureComment,
	renderRefusalComment,
	renderUmbrellaFailureComment,
} from './comments.ts';
import { OUTCOMES, REFUSAL_REASONS } from './decision.ts';

describe('renderRefusalComment', () => {
	it('should give the reason, then how to retry', () => {
		const comment = renderRefusalComment([REFUSAL_REASONS.missingReleaseLabel]);

		assert.match(comment, /^This PR has no release label\./);
		assert.match(comment, /add `accepted` again\.$/);
	});

	it('should list several reasons', () => {
		const comment = renderRefusalComment([
			REFUSAL_REASONS.missingApproval,
			REFUSAL_REASONS.failingChecks,
		]);

		assert.match(comment, /^This PR can't join its umbrella yet:\n\n- .+\n- .+\n\n/);
	});
});

describe('renderDryRunComment', () => {
	it('should name the umbrella branch a PR would join, and its base branch', () => {
		const comment = renderDryRunComment({
			outcome: OUTCOMES.join,
			route: { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' },
		});

		assert.match(comment, /^\*\*Dry run\*\*/);
		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /into `main`/);
	});

	it('should quote the comment a refused PR would get', () => {
		const comment = renderDryRunComment({
			outcome: OUTCOMES.refuse,
			reasons: [REFUSAL_REASONS.severalReleaseLabels],
		});
		const refusalComment = renderRefusalComment([REFUSAL_REASONS.severalReleaseLabels]);
		const quotedRefusalComment = refusalComment.replaceAll(/^/gm, '> ').replaceAll('> \n', '>\n');

		assert.match(comment, /^\*\*Dry run\*\*/);
		assert.ok(comment.includes(quotedRefusalComment));
	});
});

const ROUTE = { umbrellaBranch: 'release-queue/main', umbrellaBaseBranch: 'main' };

describe('renderJoinedComment', () => {
	it('should name the umbrella branch and link the umbrella PR', () => {
		const comment = renderJoinedComment(ROUTE, 1000);

		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /#1000/);
	});
});

describe('renderMergeFailureComment', () => {
	it("should give GitHub's reason, then how to retry", () => {
		const comment = renderMergeFailureComment(ROUTE, 'Merge conflict');

		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /Merge conflict/);
		assert.match(comment, /add `accepted` again\.$/);
	});
});

describe('renderUmbrellaFailureComment', () => {
	it("should say the PR is merged, give GitHub's reason, and ask for the umbrella by hand", () => {
		const comment = renderUmbrellaFailureComment(ROUTE, 'Validation Failed');

		assert.match(comment, /`release-queue\/main`/);
		assert.match(comment, /Validation Failed/);
		assert.match(comment, /into `main`/);
	});
});

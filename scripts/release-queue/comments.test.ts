import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderDryRunComment, renderRefusalComment } from './comments.ts';
import { OUTCOMES, REFUSAL_REASONS } from './decision.ts';

describe('renderRefusalComment', () => {
	it('should give the reason, then how to retry', () => {
		const comment = renderRefusalComment(REFUSAL_REASONS.missingReleaseLabel);

		assert.match(comment, /^This PR has no release label\./);
		assert.match(comment, /add `accepted` again\.$/);
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
			reason: REFUSAL_REASONS.severalReleaseLabels,
		});
		const refusalComment = renderRefusalComment(REFUSAL_REASONS.severalReleaseLabels);
		const quotedRefusalComment = refusalComment.replaceAll(/^/gm, '> ').replaceAll('> \n', '>\n');

		assert.match(comment, /^\*\*Dry run\*\*/);
		assert.ok(comment.includes(quotedRefusalComment));
	});
});

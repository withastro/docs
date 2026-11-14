import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MAIN_BRANCHES } from '../fixtures.ts';
import { renderDryRunComment, renderRefusalComment } from './comments.ts';
import { OUTCOMES, REFUSAL_REASONS } from './decision.ts';

describe('renderRefusalComment', () => {
	it('should give the reason, then how to retry', () => {
		const comment = renderRefusalComment({
			reasons: [REFUSAL_REASONS.missingReleaseLabel],
			branches: MAIN_BRANCHES,
		});

		assert.match(
			comment,
			/^`accepted` was removed\. This PR can't join its umbrella PR yet:\n\n- It has no release label\./
		);
		assert.match(comment, /a maintainer can add `accepted` again\.$/);
	});

	it('should list several reasons', () => {
		const comment = renderRefusalComment({
			reasons: [REFUSAL_REASONS.missingApproval, REFUSAL_REASONS.failingChecks],
			branches: MAIN_BRANCHES,
		});

		assert.match(
			comment,
			/^`accepted` was removed\. This PR can't join its umbrella PR yet:\n\n- .+\n- .+\n\n/
		);
	});
});

describe('renderDryRunComment', () => {
	it('should name the umbrella branch a PR would join, and its base branch', () => {
		const comment = renderDryRunComment({
			outcome: OUTCOMES.join,
			branches: MAIN_BRANCHES,
		});

		assert.match(comment, /^\*\*Dry run\*\*/);
		assert.match(comment, /`umbrella\/main`/);
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

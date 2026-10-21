import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { describeRefusal, formatDryRunComment } from './messages.ts';
import type { Refusal, Route } from './routing.ts';

const route: Route = {
	target: 'main',
	umbrellaBranch: 'release-queue/main',
	label: 'patch-release',
	shouldRetarget: true,
};

describe('describeRefusal', () => {
	it('describes every refusal', () => {
		const refusals: Refusal[] = [
			{ code: 'closed' },
			{ code: 'umbrella' },
			{ code: 'draft' },
			{ code: 'no-release-label' },
			{ code: 'several-release-labels', labels: ['patch-release', 'minor-release'] },
			{ code: 'mismatch', base: 'main', label: 'major-release' },
			{ code: 'mismatch', base: 'v8', label: 'minor-release' },
			{ code: 'major-on-main', astroVersion: '8.0.0' },
			{ code: 'not-approved' },
			{ code: 'changes-requested', reviewers: ['alice'] },
			{ code: 'failing-checks', checks: ['Check Links'] },
			{ code: 'pending-checks', checks: ['zizmor'] },
			{ code: 'missing-checks', checks: ['zizmor'] },
			{ code: 'conflict' },
		];
		for (const refusal of refusals) {
			assert.match(describeRefusal(refusal), /\.$/, refusal.code);
		}
	});

	it('suggests the fix matching a mismatched label', () => {
		assert.match(
			describeRefusal({ code: 'mismatch', base: 'main', label: 'major-release' }),
			/this one targets `main`.*the label to `patch-release` or `minor-release`/
		);
		assert.match(
			describeRefusal({ code: 'mismatch', base: 'v8', label: 'minor-release' }),
			/`minor-release` PRs target `main`, but this one targets `v8`.*`major-release`/
		);
	});

	it('mentions the open main umbrella when the next astro release is a major', () => {
		const refusal: Refusal = { code: 'major-on-main', astroVersion: '8.0.0' };
		assert.match(describeRefusal(refusal), /`astro@8.0.0`/);
		assert.doesNotMatch(describeRefusal(refusal), /umbrella/);
		assert.match(describeRefusal(refusal, { mainUmbrella: { number: 42 } }), /umbrella \(#42\)/);
	});
});

describe('formatDryRunComment', () => {
	it('names the open umbrella a ready PR would join', () => {
		const comment = formatDryRunComment({ route, refusals: [] }, { umbrella: { number: 42 } });
		assert.match(comment, /^\*\*Release queue \(dry run\)\*\*/);
		assert.match(
			comment,
			/squash-merged into `release-queue\/main`, the branch of #42 into `main`/
		);
		assert.match(comment, /Its base would change to `release-queue\/main`/);
	});

	it('names the umbrella PR that would be created', () => {
		const comment = formatDryRunComment(
			{ route: { ...route, shouldRetarget: false }, refusals: [] },
			{ umbrella: { title: '[ci] release astro@7.4.1 docs' } }
		);
		assert.match(comment, /a new umbrella PR \(`\[ci\] release astro@7.4.1 docs`\)/);
		assert.doesNotMatch(comment, /base would change/);
	});

	it('lists every reason a PR would be refused, and the umbrella it would join', () => {
		const comment = formatDryRunComment(
			{ route, refusals: [{ code: 'draft' }, { code: 'not-approved' }] },
			{ umbrella: { number: 42 } }
		);
		assert.match(comment, /wouldn't join #42 into `main` yet:\n\n- .*draft.*\n- .*approval/);
		assert.match(comment, /`accepted` label would be removed/);
	});

	it("doesn't name an umbrella when the PR has none", () => {
		const comment = formatDryRunComment({ refusals: [{ code: 'no-release-label' }] });
		assert.match(comment, /wouldn't join its release umbrella yet:/);
	});

	it('throws when a PR without refusals has no umbrella', () => {
		assert.throws(() => formatDryRunComment({ route, refusals: [] }));
	});
});

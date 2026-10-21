import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { GitHubError } from './github.ts';
import {
	describeRefusal,
	formatDryRunJoinComment,
	formatDryRunRefusalComment,
	formatIncompleteJoinComment,
	formatJoinComment,
	formatRefusalComment,
} from './messages.ts';
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
			{ code: 'umbrella-conflict', branch: 'release-queue/main' },
			{ code: 'stale-umbrella-branch', branch: 'release-queue/main' },
			{ code: 'merge-failed', reason: 'Pull Request is not mergeable' },
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

	it("doesn't add a period after a reason that ends with one", () => {
		const reason = 'Head branch was modified. Review and try the merge again.';
		assert.equal(
			describeRefusal({ code: 'merge-failed', reason }),
			`GitHub refused the merge: ${reason}`
		);
	});

	it('mentions the open main umbrella when the next astro release is a major', () => {
		const refusal: Refusal = { code: 'major-on-main', astroVersion: '8.0.0' };
		assert.match(describeRefusal(refusal), /`astro@8.0.0`/);
		assert.doesNotMatch(describeRefusal(refusal), /umbrella/);
		assert.match(describeRefusal(refusal, { mainUmbrella: { number: 42 } }), /umbrella \(#42\)/);
	});
});

describe('formatDryRunJoinComment', () => {
	it('names the open umbrella a ready PR would join', () => {
		const comment = formatDryRunJoinComment(route, { number: 42 });
		assert.match(comment, /^\*\*Release queue \(dry run\)\*\*/);
		assert.match(
			comment,
			/squash-merged into `release-queue\/main`, the branch of #42 into `main`/
		);
		assert.match(comment, /Its base would change to `release-queue\/main`/);
	});

	it('names the umbrella PR that would be created', () => {
		const comment = formatDryRunJoinComment(
			{ ...route, shouldRetarget: false },
			{ title: '[ci] release astro@7.4.1 docs' }
		);
		assert.match(comment, /a new umbrella PR \(`\[ci\] release astro@7.4.1 docs`\)/);
		assert.doesNotMatch(comment, /base would change/);
	});
});

describe('formatDryRunRefusalComment', () => {
	it('lists every reason a PR would be refused, and the umbrella it would join', () => {
		const comment = formatDryRunRefusalComment(
			{ status: 'refuse', route, refusals: [{ code: 'draft' }, { code: 'not-approved' }] },
			{ umbrella: { number: 42 } }
		);
		assert.match(comment, /wouldn't join #42 into `main` yet:\n\n- .*draft.*\n- .*approval/);
		assert.match(comment, /`accepted` label would be removed/);
	});

	it("doesn't name an umbrella when the PR has none", () => {
		const comment = formatDryRunRefusalComment({
			status: 'refuse',
			refusals: [{ code: 'no-release-label' }],
		});
		assert.match(comment, /wouldn't join its release umbrella yet:/);
	});
});

describe('formatRefusalComment', () => {
	it('lists every reason, and says the label was removed', () => {
		const comment = formatRefusalComment(
			{ status: 'refuse', route, refusals: [{ code: 'not-approved' }] },
			{ umbrella: { number: 42 } }
		);
		assert.match(comment, /^\*\*Release queue\*\*: this PR didn't join #42 into `main`:/);
		assert.match(comment, /- .*approval/);
		assert.match(comment, /The `accepted` label was removed\. Add it again after fixing\.$/);
	});

	it('names the umbrella to create by its title', () => {
		const comment = formatRefusalComment(
			{ status: 'refuse', route, refusals: [{ code: 'not-approved' }] },
			{ umbrella: { title: '[ci] release astro@7.4.1 docs' } }
		);
		assert.match(comment, /didn't join a new umbrella PR \(`\[ci\] release astro@7.4.1 docs`\)/);
	});

	it("doesn't name an umbrella when the PR has none", () => {
		const comment = formatRefusalComment({
			status: 'refuse',
			refusals: [{ code: 'no-release-label' }],
		});
		assert.match(comment, /didn't join its release umbrella:/);
	});
});

describe('formatJoinComment', () => {
	it('names the umbrella the PR joined', () => {
		assert.equal(
			formatJoinComment(route, { number: 42 }),
			'**Release queue**: squash-merged into `release-queue/main`, the branch of #42 into `main`. It ships when the umbrella PR is merged.'
		);
	});
});

describe('formatIncompleteJoinComment', () => {
	const error = new GitHubError({ status: 422, reason: 'Validation Failed', request: 'POST' });

	it("asks a maintainer to open the umbrella PR that couldn't be opened", () => {
		assert.equal(
			formatIncompleteJoinComment(route, { status: 'unopened', error }),
			"**Release queue**: squash-merged into `release-queue/main`, but the umbrella PR into `main` couldn't be opened: Validation Failed. A maintainer needs to open it from `release-queue/main`."
		);
	});

	it("asks a maintainer to add the labels that couldn't be set", () => {
		const comment = formatIncompleteJoinComment(route, {
			status: 'unlabeled',
			umbrella: { number: 99 },
			labels: ['merge-on-release', 'patch-release'],
			error,
		});
		assert.match(comment, /the branch of #99 into `main`, but its labels couldn't be set/);
		assert.match(comment, /add `merge-on-release`, `patch-release`\.$/);
	});

	it('describes an error that is not from GitHub', () => {
		const comment = formatIncompleteJoinComment(route, {
			status: 'unopened',
			error: new TypeError('fetch failed'),
		});
		assert.match(comment, /couldn't be opened: fetch failed\./);
	});
});

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { RELEASE_TYPES } from './config.ts';
import { buildRelease, MAIN_BRANCHES } from './fake-repository.ts';
import {
	getIncludedPrNumbers,
	getUmbrellaReleasePrNumber,
	hasUmbrellaChanges,
	planUmbrellaUpdate,
	renderUmbrella,
} from './umbrella-content.ts';
import { getUmbrellaBranches, type Umbrella } from './umbrella.ts';

function buildUmbrella(baseBranch: string, labels: string[], changes: Partial<Umbrella> = {}) {
	return {
		number: 50,
		title: 'Umbrella',
		body: null,
		labels: labels.map((name) => ({ name })),
		branches: getUmbrellaBranches(baseBranch),
		releasePrNumber: null,
		...changes,
	};
}

describe('renderUmbrella', () => {
	function renderTitle(baseBranch: string, versions: string[] | null) {
		const release = versions ? buildRelease({ versions }) : null;
		const branches = getUmbrellaBranches(baseBranch);
		return renderUmbrella({ branches, release, includedPrNumbers: [] }).title;
	}

	it('should name the astro version when astro is in the release', () => {
		const title = renderTitle('main', ['@astrojs/node@10.0.1', 'astro@7.4.1']);

		assert.equal(title, '[ci] release astro@7.4.1 docs');
	});

	it('should name the only package of a release without astro', () => {
		assert.equal(
			renderTitle('main', ['@astrojs/vercel@11.0.14']),
			'[ci] release @astrojs/vercel@11.0.14 docs'
		);
	});

	it('should name the base branch for several packages without astro', () => {
		const title = renderTitle('cloudflare-next', [
			'@astrojs/cloudflare@15.0.0-beta.2',
			'@astrojs/vercel@11.0.15-beta.0',
		]);

		assert.equal(title, '[ci] release cloudflare-next docs');
	});

	it('should name the base branch without a release', () => {
		assert.equal(renderTitle('main', null), '[ci] release main docs');
	});

	it('should mark and link the release, then list the included PRs', () => {
		const { body } = renderUmbrella({
			branches: MAIN_BRANCHES,
			release: buildRelease({ prNumber: 100 }),
			includedPrNumbers: [7, 9],
		});

		assert.match(body, /^<!-- release-queue:release-pr=100 -->\n/);
		assert.match(body, /withastro\/astro#100/);
		assert.match(body, /This includes:\n\n- #7\n- #9\n\n/);
	});

	it('should say when no release PR is open, without a marker', () => {
		const { body } = renderUmbrella({
			branches: MAIN_BRANCHES,
			release: null,
			includedPrNumbers: [],
		});

		assert.doesNotMatch(body, /release-queue:release-pr/);
		assert.match(body, /No release PR is open in `withastro\/astro` yet\./);
		assert.match(body, /This includes no docs PRs yet\./);
	});
});

describe('getUmbrellaReleasePrNumber', () => {
	it("should take the release's PR, or else the recorded one", () => {
		const umbrella = { releasePrNumber: 90 };

		assert.equal(getUmbrellaReleasePrNumber(umbrella, buildRelease({ prNumber: 100 })), 100);
		assert.equal(getUmbrellaReleasePrNumber(umbrella, null), 90);
		assert.equal(getUmbrellaReleasePrNumber({ releasePrNumber: null }, null), null);
	});
});

describe('planUmbrellaUpdate', () => {
	const stable = buildRelease({ versions: ['astro@7.5.0'], type: RELEASE_TYPES.minor });
	const prerelease = buildRelease({ prNumber: 200, versions: ['astro@8.0.0-beta.1'] });

	function planTitleAndLabels(...args: Parameters<typeof planUmbrellaUpdate>) {
		const { fields, labelsToAdd, labelsToRemove } = planUmbrellaUpdate(...args);
		return { title: fields.title, labelsToAdd, labelsToRemove };
	}

	it('should title and label the stable umbrella after the stable release', () => {
		const umbrella = buildUmbrella('main', ['patch-release', 'i18n']);

		assert.deepEqual(planTitleAndLabels(umbrella, { release: stable, includedPrNumbers: [] }), {
			title: '[ci] release astro@7.5.0 docs',
			labelsToAdd: ['merge-on-release', 'minor-release'],
			labelsToRemove: ['patch-release'],
		});
	});

	it('should keep the title and the release label of the stable umbrella without a release', () => {
		const umbrella = buildUmbrella('main', ['merge-on-release', 'patch-release']);

		assert.deepEqual(planTitleAndLabels(umbrella, { release: null, includedPrNumbers: [] }), {
			title: undefined,
			labelsToAdd: [],
			labelsToRemove: [],
		});
	});

	it('should title a prerelease umbrella after the prerelease, and label it as a major', () => {
		const umbrella = buildUmbrella('v8', ['minor-release']);

		assert.deepEqual(planTitleAndLabels(umbrella, { release: prerelease, includedPrNumbers: [] }), {
			title: '[ci] release astro@8.0.0-beta.1 docs',
			labelsToAdd: ['merge-on-release', 'major-release'],
			labelsToRemove: ['minor-release'],
		});
	});

	it('should label a prerelease umbrella as a major without a release', () => {
		const umbrella = buildUmbrella('v8', ['merge-on-release']);

		assert.deepEqual(planTitleAndLabels(umbrella, { release: null, includedPrNumbers: [] }), {
			title: undefined,
			labelsToAdd: ['major-release'],
			labelsToRemove: [],
		});
	});

	it('should list the included PRs and link the release in the description', () => {
		const umbrella = buildUmbrella('main', []);

		const { fields } = planUmbrellaUpdate(umbrella, { release: stable, includedPrNumbers: [7, 9] });

		assert.equal(
			fields.body,
			renderUmbrella({ branches: MAIN_BRANCHES, release: stable, includedPrNumbers: [7, 9] }).body
		);
	});

	it('should keep the recorded release PR without a release', () => {
		const umbrella = buildUmbrella('main', [], { releasePrNumber: 100 });

		const { fields } = planUmbrellaUpdate(umbrella, { release: null, includedPrNumbers: [7] });

		assert.match(fields.body ?? '', /^<!-- release-queue:release-pr=100 -->\n/);
	});

	it('should change nothing on an umbrella that is up to date', () => {
		const content = { branches: MAIN_BRANCHES, release: stable, includedPrNumbers: [7] };
		const umbrella = buildUmbrella('main', ['merge-on-release', 'minor-release'], {
			...renderUmbrella(content),
		});

		const changes = planUmbrellaUpdate(umbrella, content);

		assert.deepEqual(changes, { prNumber: 50, fields: {}, labelsToAdd: [], labelsToRemove: [] });
		assert.equal(hasUmbrellaChanges(changes), false);
	});
});

describe('getIncludedPrNumbers', () => {
	function buildCommit(message: string) {
		return { sha: 'abc123', commit: { message } };
	}

	it('should read the PR number at the end of each commit subject, once each', () => {
		const prNumbers = getIncludedPrNumbers({
			commits: [
				buildCommit('Document feature 7 (#7)'),
				buildCommit("Merge branch 'main' into release-queue/main"),
				buildCommit('Fix a typo (#9)\n\nFollows #7 (#7)'),
				buildCommit('Document feature 7 again (#7)'),
			],
		});

		assert.deepEqual(prNumbers, [7, 9]);
	});
});

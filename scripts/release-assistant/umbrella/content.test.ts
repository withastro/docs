import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildRelease, MAIN_BRANCHES } from '../fixtures.ts';
import { renderSquashCommitTitle, renderUmbrella } from './content.ts';
import { getUmbrellaBranches } from './umbrella.ts';

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

		assert.match(body, /^<!-- release-assistant:release-pr=100 -->\n/);
		assert.match(body, /withastro\/astro#100/);
		assert.match(body, /This includes:\n\n- #7\n- #9\n\n/);
	});

	it('should say when no release PR is open, without a marker', () => {
		const { body } = renderUmbrella({
			branches: MAIN_BRANCHES,
			release: null,
			includedPrNumbers: [],
		});

		assert.doesNotMatch(body, /release-assistant:release-pr/);
		assert.match(body, /No release PR is open in `withastro\/astro` yet\./);
		assert.match(body, /This includes no docs PRs yet\./);
	});
});

describe('renderSquashCommitTitle', () => {
	it('should end the title with the PR number', () => {
		assert.equal(
			renderSquashCommitTitle({ number: 7, title: 'Document feature 7' }),
			'Document feature 7 (#7)'
		);
	});
});

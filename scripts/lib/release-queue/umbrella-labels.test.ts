import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getKeptLabelChanges, getLabelChanges } from './umbrella-labels.ts';

describe('getLabelChanges', () => {
	it('adds merge-on-release and the release label', () => {
		assert.deepEqual(getLabelChanges(['i18n'], 'patch-release'), {
			toAdd: ['merge-on-release', 'patch-release'],
			toRemove: [],
		});
	});

	it('replaces another release label, and keeps the other labels', () => {
		assert.deepEqual(
			getLabelChanges(['merge-on-release', 'patch-release', 'i18n'], 'minor-release'),
			{ toAdd: ['minor-release'], toRemove: ['patch-release'] }
		);
	});

	it('changes nothing on an up-to-date umbrella', () => {
		assert.deepEqual(getLabelChanges(['merge-on-release', 'minor-release'], 'minor-release'), {
			toAdd: [],
			toRemove: [],
		});
	});
});

describe('getKeptLabelChanges', () => {
	it('keeps the release label an umbrella has', () => {
		assert.deepEqual(getKeptLabelChanges(['merge-on-release', 'minor-release']), {
			toAdd: [],
			toRemove: [],
		});
	});

	it('gives a new umbrella merge-on-release and the fallback release label', () => {
		assert.deepEqual(getKeptLabelChanges(['i18n']), {
			toAdd: ['merge-on-release', 'patch-release'],
			toRemove: [],
		});
	});
});

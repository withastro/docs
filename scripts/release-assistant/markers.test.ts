import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readMarker, renderMarker } from './markers.ts';

describe('renderMarker', () => {
	it('should render a hidden line of Markdown', () => {
		assert.equal(renderMarker('example:count', '7'), '<!-- example:count=7 -->');
	});
});

describe('readMarker', () => {
	it('should read the value of a marker on its own line', () => {
		const markdown = `Some text.\n${renderMarker('example:count', '7')}\nMore text.`;

		assert.equal(readMarker('example:count', markdown), '7');
	});

	it('should read an empty value', () => {
		assert.equal(readMarker('example:list', renderMarker('example:list', '')), '');
	});

	it('should return null without the marker', () => {
		assert.equal(readMarker('example:count', 'Some text.'), null);
		assert.equal(readMarker('example:count', renderMarker('example:other', '7')), null);
		assert.equal(readMarker('example:count', null), null);
	});

	it('should read a name with characters that regular expressions treat as special', () => {
		assert.equal(readMarker('example.count+', renderMarker('example.count+', '7')), '7');
		assert.equal(readMarker('example.count+', renderMarker('exampleXcount', '7')), null);
	});
});

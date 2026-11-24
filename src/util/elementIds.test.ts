import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DuplicateElementIdError, assignElementIds, pageKey, slug } from './elementIds';

const ids = (html: string): string[] =>
	[...html.matchAll(/<(?:a|button)\b[^>]*\sdata-el="([^"]*)"/g)].map((m: RegExpMatchArray): string => m[1] ?? '');

describe('slug and pageKey', () => {
	it('slugs labels and keys pages', () => {
		assert.equal(slug(' Get &amp; Start! '), 'get-start');
		assert.equal(pageKey('/en/basics/index.html'), 'en/basics');
		assert.equal(pageKey('/index.html'), 'home');
	});
});

describe('assignElementIds', () => {
	it('gives every link and button a unique id, suffixing repeats', () => {
		const out = assignElementIds(
			'<a href="/p">Pricing</a><button>Pricing</button><button aria-label="Close"></button><a href="/x/y"><svg></svg></a><button></button>',
			'/en/index.html'
		);
		assert.deepEqual(ids(out), ['en.pricing', 'en.pricing-2', 'en.close', 'en.x-y', 'en.button']);
	});

	it('keeps hand-written ids and derives around them', () => {
		const out = assignElementIds('<button>Save</button><a data-el="en.save" href="/">Save</a>', '/en/');
		assert.deepEqual(ids(out), ['en.save-2', 'en.save']);
	});

	it('leaves script contents alone', () => {
		const html = '<script>const s = "<a href=x>y</a>";</script>';
		assert.equal(assignElementIds(html, '/'), html);
	});

	it('ignores markup quoted inside an attribute value', () => {
		const html = '<button data-code="<a href=\'/section-a/\'>A</a>">Copy</button>';
		assert.equal(
			assignElementIds(html, '/x/'),
			'<button data-el="x.copy" data-code="<a href=\'/section-a/\'>A</a>">Copy</button>'
		);
	});

	it('throws on a repeated or invalid hand-written id', () => {
		assert.throws(
			() => assignElementIds('<a data-el="x">a</a><button data-el="x">b</button>', '/'),
			DuplicateElementIdError
		);
		assert.throws(() => assignElementIds('<a data-el="Bad Id">a</a>', '/'), DuplicateElementIdError);
	});
});

export const ELEMENT_ATTRIBUTE = 'data-el';

const SCRIPT_BLOCK = /(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/gi;
// Whole tags with quoted values consumed, so markup quoted inside an attribute (code-copy buttons) is never taken for a real tag.
const OPEN_TAG = /<([a-zA-Z][\w-]*)(?:\s+[^\s=>"'/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>"']+))?)*\s*\/?>/g;
const isClickable = (tagName: string): boolean => /^(a|button)$/i.test(tagName);
const EXPLICIT = /\sdata-el="([^"]*)"/;
const VALID = /^[a-z0-9][a-z0-9_.:/-]{0,127}$/;
const MAX_SLUG = 40;
const MAX_ID = 120;
const CLOSE_A = /<\/a\s*>/i;
const CLOSE_BUTTON = /<\/button\s*>/i;

export class DuplicateElementIdError extends Error {
	override name = 'DuplicateElementIdError';
}

export const slug = (text: string): string =>
	text
		.toLowerCase()
		.replace(/&[a-z#0-9]+;/g, ' ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, MAX_SLUG)
		.replace(/-+$/, '');

/** `/en/basics/intro/` → `en/basics/intro`, `/` → `home`. */
export const pageKey = (url: string): string =>
	url.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '') || 'home';

const labelOf = (openTag: string, rest: string, tagName: string): string => {
	const close = rest.search(tagName.toLowerCase() === 'a' ? CLOSE_A : CLOSE_BUTTON);
	const inner = close >= 0 ? rest.slice(0, close) : '';
	const text = slug(inner.replace(/<[^>]*>/g, ' '));
	if (text) return text;
	const aria = slug(openTag.match(/\saria-label="([^"]*)"/)?.[1] ?? '');
	if (aria) return aria;
	const href = slug(openTag.match(/\shref="([^"]*)"/)?.[1] ?? '');
	return href || tagName.toLowerCase();
};

/**
 * Gives every link and button a page-unique `data-el` id built from the page
 * and the element's text, in the same `page.label[-n]` form as the marketing
 * website and portal, so clicks can be told apart for usage analysis and A/B
 * tests. A hand-written `data-el` is kept; an invalid or repeated one throws so
 * the build fails rather than merging two elements' clicks.
 */
export const assignElementIds = (html: string, url: string): string => {
	const page = pageKey(url);
	const used = new Set<string>();
	const parts = html.split(SCRIPT_BLOCK);
	for (const [i, part] of parts.entries()) {
		if (i % 2 === 1) continue;
		for (const match of part.matchAll(OPEN_TAG)) {
			if (!isClickable(match[1] ?? '')) continue;
			const explicit = match[0].match(EXPLICIT)?.[1];
			if (explicit === undefined) continue;
			if (!VALID.test(explicit) || used.has(explicit)) {
				throw new DuplicateElementIdError(`${url}: data-el "${explicit}" is invalid or used twice`);
			}
			used.add(explicit);
		}
	}
	const unique = (base: string): string => {
		let id = base;
		for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
		used.add(id);
		return id;
	};
	return parts
		.map((part: string, i: number): string =>
			i % 2 === 1
				? part
				: part.replace(OPEN_TAG, (tag: string, tagName: string, offset: number): string => {
						if (!isClickable(tagName) || EXPLICIT.test(tag)) return tag;
						const rest = part.slice(offset + tag.length);
						const id = unique(`${page}.${labelOf(tag, rest, tagName)}`.slice(0, MAX_ID));
						const at = 1 + tagName.length;
						return `${tag.slice(0, at)} ${ELEMENT_ATTRIBUTE}="${id}"${tag.slice(at)}`;
					})
		)
		.join('');
};

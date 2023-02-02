import type { Document, Element } from 'domhandler';
import htmlparser2 from 'htmlparser2';

export interface AllPagesByPathname {
	[key: string]: HtmlPage;
}

export class HtmlPage {
	/**
	 * The full page URL.
	 *
	 * Example: `https://docs.astro.build/en/getting-started/`
	 */
	readonly href: string;
	/**
	 * The `pathname` part of the page's URL.
	 *
	 * Example: `/en/getting-started/`
	 */
	readonly pathname: string;

	readonly dom: Document;

	readonly anchors: Element[];
	/**
	 * A list of unique link hrefs on the page.
	 */
	readonly uniqueLinkHrefs: string[];
	/**
	 * A list of hashes that can be used as URL fragments to jump to specific parts of the page.
	 */
	readonly hashes: string[];
	/**
	 * Contains the unique absolute page URL as declared by the
	 * `<link rel="canonical" href="...">` element (if any).
	 */
	readonly canonicalUrl: URL | null;
	/**
	 * The target URL of a `<meta http-equiv="refresh" content="...">` element
	 * contained on the page (if any).
	 */
	readonly redirectTargetUrl: URL | null;
	/**
	 * Determines if the page redirects to another URL because it contains a
	 * meta refresh element with a valid URL.
	 */
	readonly isRedirect: boolean;
	/**
	 * The element containing the page's main content.
	 *
	 * Prefers the first `<article>` element, with a fallback to `<body>` if no article was found,
	 * and finally `null` if the page even doesn't have a body.
	 */
	readonly mainContent: Element | null;
	/**
	 * The language of the page's main content.
	 *
	 * Searches for the first `lang` attribute in the tree, starting at `mainContent` (if any)
	 * and traversing its parents. Can be `null` if no such attribute is found.
	 */
	readonly mainContentLang: string | null;
	/**
	 * The language defined by the page's pathname prefix (if any).
	 */
	readonly pathnameLang: string | null;
	/**
	 * Determines if the page is a language fallback page
	 * for content that has not been translated yet.
	 */
	readonly isLanguageFallback: boolean;

	constructor({ html, href, pathname }: { html: string; href: string; pathname: string }) {
		// Attempt to read the HTML file and parse its DOM
		this.dom = htmlparser2.parseDocument(html);
		this.href = href;
		this.pathname = pathname;

		// Provide commonly used data as properties
		this.anchors = htmlparser2.DomUtils.getElementsByTagName('a', this.dom, true);

		// Build a list of unique link hrefs on the page
		this.uniqueLinkHrefs = [...new Set(this.anchors.map((el) => decodeURI(el.attribs.href)))];

		// Build a list of hashes that can be used as URL fragments to jump to parts of the page
		const anchorNames = this.anchors
			.map((el) => el.attribs.name)
			.filter((name) => name !== undefined);
		const ids = this.findAll((el) => Boolean(el.attribs.id)).map((el) => el.attribs.id);
		this.hashes = [...anchorNames, ...ids].map((name) => `#${name}`);

		// Check if the page redirects somewhere else using meta refresh
		const metaRefreshElement = this.findFirst(
			(el) =>
				el.tagName.toLowerCase() === 'meta' && el.attribs['http-equiv']?.toLowerCase() === 'refresh'
		);
		const metaRefreshContent = metaRefreshElement?.attribs['content'];
		const metaRefreshMatches = metaRefreshContent?.match(/^([0-9]+)\s*;\s*url\s*=\s*(.+)$/i);
		this.redirectTargetUrl = metaRefreshMatches ? new URL(metaRefreshMatches[2], this.href) : null;
		this.isRedirect = Boolean(this.redirectTargetUrl);

		// Get the page's canonical URL (if any)
		const linkCanonicalElement = this.findFirst(
			(el) =>
				el.tagName.toLowerCase() === 'link' && el.attribs['rel']?.toLowerCase() === 'canonical'
		);
		this.canonicalUrl =
			(linkCanonicalElement && new URL(linkCanonicalElement.attribs['href'])) || null;

		// Attempt to find the page's main content element
		this.mainContent =
			this.findFirst((el) => el.tagName.toLowerCase() === 'article') ||
			this.findFirst((el) => el.tagName.toLowerCase() === 'body');

		// Attempt to determine the main content language by traversing the tree upwards
		// until we find an element with a `lang` attribute
		const mainContentParentWithLang =
			this.mainContent && this.findParent(this.mainContent, (el) => Boolean(el.attribs?.lang));
		this.mainContentLang = mainContentParentWithLang?.attribs.lang || null;

		// Attempt to determine the page's pathname-based language
		this.pathnameLang = this.getLanguageCodeFromPathname(this.pathname) || null;

		// Detect if this is a language fallback page
		this.isLanguageFallback =
			Boolean(this.pathnameLang) && this.pathnameLang !== 'en' && this.mainContentLang === 'en';
	}

	findFirst(test: (elem: Element) => boolean) {
		return htmlparser2.DomUtils.findOne(test, this.dom.children);
	}

	findAll(test: (elem: Element) => boolean) {
		return htmlparser2.DomUtils.findAll(test, this.dom.children);
	}

	findParent(start: Element, test: (elem: Element) => boolean) {
		let el: Element | null = start;
		while (el) {
			if (test(el)) return el;
			el = htmlparser2.DomUtils.getParent(el);
		}
		return null;
	}

	/**
	 * Determines the URL pathname that should be used to link to this page
	 * from a page with the given source language.
	 */
	getExpectedLinkPathname(sourceLang: string | null) {
		let pathname = this.canonicalUrl?.pathname || this.pathname;
		if (sourceLang && (this.isLanguageFallback || pathname.startsWith('/en/'))) {
			pathname = pathname.replace(/^\/en\//, `/${sourceLang}/`);
		}
		return pathname;
	}

	private getLanguageCodeFromPathname(pathname: string) {
		// Assuming that `pathname` always starts with a `/`, retrieve the first path part,
		// which is usually the language code
		const firstPathPart = pathname.split('/')[1];
		// Only return parts that look like a two-letter language code
		// with optional two-letter country code
		if (firstPathPart.match(/^[a-z]{2}(-[a-zA-Z]{2})?$/)) return firstPathPart;
	}
}

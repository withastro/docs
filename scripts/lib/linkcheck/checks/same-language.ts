import kleur from 'kleur';
import { dedentMd } from '../../output.mjs';
import { CheckBase, CheckHtmlPageContext } from '../base/check';
import { IssueType } from '../base/issue';

export interface SameLanguageOptions {
	/**
	 * A list of link pathnames that are allowed to point to a different language
	 * than the page that the link was found on.
	 *
	 * Subpaths of the given pathnames are automatically ignored as well,
	 * so adding `/example/` will also ignore `/example/some-subpath/`.
	 * */
	ignoredLinkPathnames?: string[];
}

export class SameLanguage extends CheckBase {
	private static readonly UnexpectedLanguageLink = new IssueType({
		title: 'link(s) to unexpected language(s)',
		prefix: kleur.gray(`[${kleur.cyan().bold('lng')}]`),
		sortOrder: 300,
	});

	readonly ignoredLinkPathnames: string[];

	constructor({ ignoredLinkPathnames }: SameLanguageOptions = {}) {
		super();

		this.ignoredLinkPathnames = ignoredLinkPathnames || [];
	}

	checkHtmlPage(context: CheckHtmlPageContext) {
		// Skip all checks if the current page is a language fallback page
		// to avoid reporting duplicates for all missing translations
		if (context.page.isLanguageFallback) return;

		// Also skip checking if the current page does not have a language prefix
		if (!context.page.pathnameLang) return;

		this.forEachLocalLink(context, (linkHref, url) => {
			const linkedPage = this.findPageByPathname(context, url.pathname);
			if (!linkedPage) return;

			// Skip paths found in the ignore list
			if (this.ignoredLinkPathnames.some((ignoredPath) => url.pathname.startsWith(ignoredPath)))
				return;

			// Skip links to redirect pages
			if (linkedPage.isRedirect) return;

			// It's an error if the pathname-based language of the target page
			// does not match the current page's pathname-based language
			const linkedLang = linkedPage.pathnameLang;
			if (linkedLang !== context.page.pathnameLang) {
				const expectedPathname = linkedPage.getExpectedLinkPathname(context.page.pathnameLang);
				const autofixHref = expectedPathname + decodeURIComponent(url.hash);
				context.report({
					type: SameLanguage.UnexpectedLanguageLink,
					linkHref,
					autofixHref,
					annotationText: dedentMd`Expected link path to start with
						"/${context.page.pathnameLang}/", but found
						${linkedLang ? `"/${linkedLang}/"` : 'no language prefix'}.
						The correct prefix is required to ensure that users stay on their
						selected language version of the docs.`,
				});
			}
		});
	}
}

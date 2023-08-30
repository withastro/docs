import kleur from 'kleur';
import { CheckBase, CheckHtmlPageContext } from '../base/check';
import { IssueType } from '../base/issue';

export class RelativeUrl extends CheckBase {
	private static readonly AbsoluteLink = new IssueType({
		title: 'unwanted absolute link(s)',
		prefix: kleur.gray(`[${kleur.magenta().bold('abs')}]`),
		sortOrder: 600,
	});

	checkHtmlPage(context: CheckHtmlPageContext) {
		// Skip all checks if the current page is a language fallback page
		// to avoid reporting duplicates for all missing translations
		if (context.page.isLanguageFallback) return;

		this.forEachLocalLink(context, (linkHref, url) => {
			const linkedPage = this.findPageByPathname(context, url.pathname);
			if (!linkedPage) return;

			// Skip relative links
			const rawUrl = new URL(linkHref, 'https://example.com/');
			if (rawUrl.host === 'example.com') return;

			// Report the unwanted absolute link
			const expectedPathname = linkedPage.getExpectedLinkPathname(context.page.pathnameLang);
			const autofixHref = expectedPathname + decodeURIComponent(url.hash);
			context.report({
				type: RelativeUrl.AbsoluteLink,
				linkHref,
				autofixHref,
			});
		});
	}
}

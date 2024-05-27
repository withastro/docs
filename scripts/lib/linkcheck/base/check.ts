import type { LinkIssue } from './issue';
import type { AllPagesByPathname, HtmlPage } from './page';

export interface CheckHtmlPageContext {
	allPages: AllPagesByPathname;
	page: HtmlPage;
	baseUrl: string;
	checkSingleLinkHref?: string;
	report: (issueData: Omit<LinkIssue, 'page' | 'check' | 'sourceFileAnnotations'>) => void;
}

export abstract class CheckBase {
	abstract checkHtmlPage(context: CheckHtmlPageContext): void;

	protected forEachLocalLink(
		context: CheckHtmlPageContext,
		fn: (linkHref: string, url: URL) => void
	) {
		// If requested, only check a single link href (used to validate autofix suggestions),
		// or perform the default behavior and check all unique link hrefs on the page
		const hrefsToCheck = context.checkSingleLinkHref
			? [context.checkSingleLinkHref]
			: context.page.uniqueLinkHrefs;

		hrefsToCheck.forEach((linkHref) => {
			const url = new URL(linkHref, context.page.href);

			// Ignore external links
			if (!url.href.startsWith(context.baseUrl)) return;

			// If we arrive here, call the given callback for the current link
			fn(linkHref, url);
		});
	}

	protected findPageByPathname(context: CheckHtmlPageContext, pathname: string) {
		if (!pathname.endsWith('/')) {
			pathname += '/';
		}

		return context.allPages[pathname];
	}
}

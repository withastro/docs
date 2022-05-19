import { AllPagesByPathname, HtmlPage } from "./page";
import { LinkIssue } from "./issue";

export interface CheckHtmlPageContext {
	allPages: AllPagesByPathname;
	page: HtmlPage;
	baseUrl: string;
	report: (issueData: Omit<LinkIssue, 'page' | 'check' | 'sourceFileAnnotations'>) => void;
}

export abstract class CheckBase {
	abstract checkHtmlPage (context: CheckHtmlPageContext): void;

	protected forEachLocalLink (context: CheckHtmlPageContext, fn: (linkHref: string, url: URL) => void) {
		context.page.uniqueLinkHrefs.forEach(linkHref => {
			const url = new URL(linkHref, context.page.href);

			// Ignore external links
			if (!url.href.startsWith(context.baseUrl))
				return;
			
			// If we arrive here, call the given callback for the current link
			fn(linkHref, url);
		});
	}

	protected findPageByPathname (context: CheckHtmlPageContext, pathname: string) {
		if (!pathname.endsWith('/')) {
			pathname += '/';
		}

		return context.allPages[pathname];
	}
}

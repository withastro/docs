import kleur from 'kleur';
import { dedentMd } from '../../output.mjs';
import { CheckBase, CheckHtmlPageContext } from '../base/check';
import { IssueType } from '../base/issue';

export class TargetExists extends CheckBase {
	private static readonly BrokenPageLink = new IssueType({
		title: 'broken page link(s)',
		prefix: kleur.gray(`[${kleur.red().bold('404')}]`),
		sortOrder: 100,
	});
	private static readonly BrokenFragmentLink = new IssueType({
		title: 'broken fragment link(s)',
		prefix: kleur.gray(`[${kleur.yellow().bold(' # ')}]`),
		sortOrder: 101,
	});

	checkHtmlPage(context: CheckHtmlPageContext) {
		this.forEachLocalLink(context, (linkHref, url) => {
			const linkedPage = this.findPageByPathname(context, url.pathname);

			// Report links to missing pages
			if (!linkedPage) {
				context.report({
					type: TargetExists.BrokenPageLink,
					linkHref,
				});
				return;
			}

			// Skip hash validation on redirect pages
			if (linkedPage.isRedirect) return;

			// Report links to missing page fragments (unknown URL hashes)
			const decodedHash = url.hash && decodeURIComponent(url.hash);
			if (decodedHash && !linkedPage.hashes.includes(decodedHash)) {
				context.report({
					type: TargetExists.BrokenFragmentLink,
					linkHref,
					annotationText: dedentMd`The linked page does not contain a fragment with
						the name "${decodedHash}".
						Available fragments: ${linkedPage.hashes.length ? linkedPage.hashes.join(', ') : 'none'}`,
				});
			}
		});
	}
}

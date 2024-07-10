import { CheckBase, type CheckHtmlPageContext } from '../base/check';
import { DomUtils } from 'htmlparser2';
import { IssueType } from '../base/issue';
import { dedentMd } from '../../output.mjs';
import kleur from 'kleur';

/** List of labels that are insufficiently descriptive for a link. */
const blocklist = new Set(['read more', 'click here', 'here', 'more']);

export class GoodLabels extends CheckBase {
	private static readonly BadLabel = new IssueType({
		title: 'link(s) with vague or nondescript labels',
		prefix: kleur.gray(`[${kleur.yellow().bold('lbl')}]`),
		sortOrder: 1000,
	});

	checkHtmlPage(context: CheckHtmlPageContext) {
		// Skip all checks if the current page is a language fallback page
		// to avoid reporting duplicates for all missing translations
		if (context.page.isLanguageFallback) return;

		context.page.anchors.forEach((anchor) => {
			const linkLabel = DomUtils.innerText(anchor)
				.replace(/\s+/g, ' ')
				.trim();

			if (!blocklist.has(linkLabel.toLowerCase())) return;

			context.report({
				type: GoodLabels.BadLabel,
				linkHref: anchor.attribs.href,
				annotationText: dedentMd`Found link label “${linkLabel}”.
						Please use descriptive accessible text for labels instead
						of short undescriptive labels like “here” or “read more”.`,
			});
		});
	}
}

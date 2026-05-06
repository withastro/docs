import { h } from 'hastscript';
import { defineHastPlugin } from 'satteri';

import type { Element, Nodes } from 'hast';
import type { RemarkRehypePluginOptions } from './remark-rehype';

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'sl-anchor-icon' },
	h(
		'svg',
		{ width: 16, height: 16, viewBox: '0 0 24 24' },
		h('path', {
			fill: 'currentcolor',
			d: 'm12.11 15.39-3.88 3.88a2.52 2.52 0 0 1-3.5 0 2.47 2.47 0 0 1 0-3.5l3.88-3.88a1 1 0 0 0-1.42-1.42l-3.88 3.89a4.48 4.48 0 0 0 6.33 6.33l3.89-3.88a1 1 0 1 0-1.42-1.42Zm8.58-12.08a4.49 4.49 0 0 0-6.33 0l-3.89 3.88a1 1 0 0 0 1.42 1.42l3.88-3.88a2.52 2.52 0 0 1 3.5 0 2.47 2.47 0 0 1 0 3.5l-3.88 3.88a1 1 0 1 0 1.42 1.42l3.88-3.89a4.49 4.49 0 0 0 0-6.33ZM8.83 15.17a1 1 0 0 0 1.1.22 1 1 0 0 0 .32-.22l4.92-4.92a1 1 0 0 0-1.42-1.42l-4.92 4.92a1 1 0 0 0 0 1.42Z',
		})
	)
);

/** Add anchor links to headings. */
export function autolinkHeadingsPlugin(options?: RemarkRehypePluginOptions) {
	return defineHastPlugin({
		name: 'autolink-headings',
		element: {
			filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
			visit(node, ctx) {
				if (!node.properties?.id || !headingRank(node)) return;

				const titleText = ctx.textContent(node);
				const accessibleLabel = options
					? options.useTranslations(options.absolutePathToLang(ctx.filename))(
							'heading.anchorLabel',
							{ title: titleText, interpolation: { escapeValue: false } }
						)
					: `Section titled ${titleText}`;

				return h(
					'div',
					{ class: `sl-heading-wrapper level-${node.tagName}` },
					node as Element,
					h(
						'a',
						{ class: 'sl-anchor-link', href: '#' + String(node.properties.id) },
						AnchorLinkIcon,
						h('span', { class: 'sr-only', 'data-pagefind-ignore': true }, accessibleLabel)
					)
				);
			},
		},
	});
}

// Inlined from https://github.com/syntax-tree/hast-util-heading-rank
// Copyright (c) 2020 Titus Wormer <tituswormer@gmail.com>
// MIT License: https://github.com/syntax-tree/hast-util-heading-rank/blob/main/license
function headingRank(node: Nodes): number | undefined {
	const name = node.type === 'element' ? node.tagName.toLowerCase() : '';
	const code = name.length === 2 && name.charCodeAt(0) === 104 /* `h` */ ? name.charCodeAt(1) : 0;
	return code > 48 /* `0` */ && code < 55 /* `7` */ ? code - 48 /* `0` */ : undefined;
}

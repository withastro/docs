import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';
import { makeComponentNode } from './utils/makeComponentNode';

const AsideTagname = 'AutoImportedAside';
export const asideAutoImport: Record<string, [string, string][]> = {
	'~/components/Aside.astro': [['default', AsideTagname]],
};

/**
 * remark plugin that converts blocks delimited with `:::` into instances of
 * the `<Aside>` component. Depends on the `remark-directive` module for the
 * core parsing logic.
 *
 * For example, this Markdown
 *
 * ```md
 * :::tip[Did you know?]
 * Astro helps you build faster websites with “Islands Architecture”.
 * :::
 * ```
 *
 * will produce this output
 *
 * ```astro
 * <Aside type="tip" title="Did you know?">
 *   <p>Astro helps you build faster websites with “Islands Architecture”.</p>
 * </Aside>
 * ```
 */
function remarkAsides(): unified.Plugin<[], mdast.Root> {
	const variants = new Set(['note', 'tip', 'caution', 'danger']);

	const transformer: unified.Transformer<mdast.Root> = (tree) => {
		// @ts-expect-error Possibly infinite type instantiation we can’t do anything about.
		visit(tree, (node, index, parent) => {
			if (!parent || index === null || node.type !== 'containerDirective') return;
			const type = node.name;
			if (!variants.has(type)) return;

			// remark-directive converts a container’s “label” to a paragraph in
			// its children, but we want to pass it as the title prop to <Aside>, so
			// we iterate over the children, find a directive label, store it for the
			// title prop, and remove the paragraph from children.
			let title: string | undefined;
			remove(node, (child) => {
				if (child.data?.directiveLabel) {
					if ('children' in child && 'value' in child.children[0]) {
						title = child.children[0].value;
					}
					return true;
				}
			});

			// Replace this node with the aside component it represents.
			parent.children[index] = makeComponentNode(
				AsideTagname,
				{ attributes: { type, title } },
				...node.children
			);
		});
	};

	return function attacher() {
		return transformer;
	};
}

/**
 * Astro integration that sets up the remark plugin and auto-imports the `<Aside>` component everywhere.
 */
export function astroAsides(): AstroIntegration {
	return {
		name: '@astrojs/asides',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [remarkDirective, remarkAsides()],
					},
				});
			},
		},
	};
}

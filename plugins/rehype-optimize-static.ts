import type { Root } from 'hast';
import type { Transformer } from 'unified';
import { walk } from 'unist-util-walker';
import { toHtml } from 'hast-util-to-html';

// accessing untyped hast and mdx types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

const headingRe = /h([0-6])/;

export function rehypeOptimizeStatic(): Transformer<Root, Root> {
	return (tree) => {
		const allPossibleElements = new Set<Node>();
		const elementStack: Node[] = [];

		walk(tree, {
			enter(node) {
				// @ts-expect-error test tagName naively
				const isHeading = node.tagName && headingRe.test(node.tagName);
				if (node.type.startsWith('mdx') || isHeading) {
					for (const el of elementStack) {
						allPossibleElements.delete(el);
					}
				}
				if (isHeading) {
					this.skip();
					return;
				}
				if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
					elementStack.push(node);
					allPossibleElements.add(node);
				}
			},
			leave(node, parent) {
				if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
					elementStack.pop();
					if (allPossibleElements.has(parent)) {
						allPossibleElements.delete(node);
					}
				}
			},
		});

		for (const el of allPossibleElements) {
			if (el.type === 'mdxJsxFlowElement') {
				el.attributes.push({
					type: 'mdxJsxAttribute',
					name: 'set:html',
					value: toHtml(el.children),
				});
			} else {
				el.properties['set:html'] = toHtml(el.children);
			}
			el.children = [];
		}

		return tree;
	};
}

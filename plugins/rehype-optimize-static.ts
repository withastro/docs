import type { Root } from 'hast';
import type { Transformer } from 'unified';
import { walk } from 'unist-util-walker';
import { toHtml } from 'hast-util-to-html';

export function rehypeOptimizeStatic(): () => Transformer<Root, Root> {
	return () => {
		return (tree) => {
			const allPossibleElements = new Set<any>();
			const elementStack: any[] = [];

			walk(tree, {
				enter(node) {
					if (node.type.startsWith('mdx')) {
						for (const el of elementStack) {
							allPossibleElements.delete(el);
						}
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
	};
}

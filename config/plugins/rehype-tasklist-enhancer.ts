import type { Root } from 'hast';
import { h } from 'hastscript';
import type { Plugin, Transformer } from 'unified';
import { CONTINUE, EXIT, SKIP, visit } from 'unist-util-visit';

/**
 * Rehype plugin to enhance the output of GitHub-Flavored Markdown’s task lists.
 * This improves possibilities for our `<Checklist>` component.
 *
 * 1. Wraps checkboxes and siblings in a `<label>` to associate them.
 * 2. Wraps sibling nodes after checkboxes in `<span>` to ease styling `:checked ~ *`.
 */
export function rehypeTasklistEnhancer(): Plugin<[], Root> {
	const transformer: Transformer<Root> = (tree) => {
		// Find task list items.
		visit(tree, 'element', (node) => {
			if (
				!node.properties ||
				!Array.isArray(node.properties.className) ||
				!node.properties.className.includes('task-list-item')
			) {
				return CONTINUE;
			}
			// Find checkboxes inside task list items.
			visit(node, 'element', (child, index, parent) => {
				if (child.tagName !== 'input' || typeof index !== 'number' || !parent) {
					return CONTINUE;
				}
				// Split children after checkbox.
				const [head, tail] = [
					parent.children.slice(0, index + 1),
					parent.children.slice(index + 1),
				];
				parent.children = [h('label', {}, ...head, h('span', {}, ...tail))];
				return EXIT;
			});
			return SKIP;
		});
	};

	return function attacher() {
		return transformer;
	};
}

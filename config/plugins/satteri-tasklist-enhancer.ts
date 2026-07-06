import { defineHastPlugin } from 'satteri';
import type { Element, ElementContent } from 'hast';

/**
 * Sätteri plugin to enhance the output of GitHub-Flavored Markdown’s task lists.
 * This improves possibilities for our `<Checklist>` component.
 *
 * 1. Wraps checkboxes and siblings in a `<label>` to associate them.
 * 2. Wraps sibling nodes after checkboxes in `<span>` to ease styling `:checked ~ *`.
 */
export function tasklistEnhancerPlugin() {
	return defineHastPlugin({
		name: 'tasklist-enhancer',
		element: [
			{
				filter: ['li'],
				visit(node, ctx) {
					if (
						!Array.isArray(node.properties.className) ||
						!node.properties.className.includes('task-list-item')
					) {
						return;
					}

					const result = findCheckboxInSubtree(node);
					if (!result) return;

					const { parent, index } = result;

					// Split children after checkbox.
					const head = parent.children.slice(0, index + 1);
					const tail = parent.children.slice(index + 1);
					const label = h('label', {}, [...head, h('span', {}, tail)]);

					ctx.replaceNode(parent, { ...parent, children: [label] });
				},
			},
		],
	});
}

/** Depth-first search for a checkbox `<input>`, returning its direct parent and index. */
function findCheckboxInSubtree(node: Element): { parent: Element; index: number } | undefined {
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];
		if (
			child.type === 'element' &&
			child.tagName === 'input' &&
			child.properties?.['type'] === 'checkbox'
		) {
			return { parent: node, index: i };
		}
	}

	for (const child of node.children) {
		if (child.type === 'element') {
			const result = findCheckboxInSubtree(child);
			if (result) return result;
		}
	}
}

function h(tag: string, properties: Element['properties'], children: ElementContent[]): Element {
	return {
		type: 'element',
		tagName: tag,
		properties,
		children,
	};
}

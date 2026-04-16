import { defineHastPlugin } from 'satteri';

import type { Element, ElementContent } from 'hast';

/**
 * Satteri HAST plugin to enhance the output of GitHub-Flavored Markdown's task lists.
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
				filter: ['ul'],
				visit(node, ctx) {
					if (hasCheckboxChild(node)) {
						ctx.setProperty(node, 'className', ['contains-task-list']);
					}
				},
			},
			{
				filter: ['li'],
				visit(node) {
					const children = node.children;

					const result = findCheckboxInSubtree(node);
					if (!result) return;

					const { parent, index } = result;
					const parentChildren = parent.children;

					const head = parentChildren.slice(0, index + 1);
					const tail = parentChildren.slice(index + 1);
					const label = h('label', {}, [...head, h('span', {}, tail)]);

					// Build new li with restructured children
					let newChildren: ElementContent[];
					if (parent === node) {
						// Input was a direct child of the li
						newChildren = [label];
					} else {
						// Input was inside a child element (e.g. <p>) — clone that child
						newChildren = children.map((child) =>
							child === parent ? h(parent.tagName, parent.properties ?? {}, [label]) : child
						);
					}

					return {
						type: 'element',
						tagName: node.tagName,
						properties: {
							...node.properties,
							className: ['task-list-item'],
						},
						children: newChildren,
					};
				},
			},
		],
	});
}

/** Check if a <ul> has any direct <li> children containing a checkbox. */
function hasCheckboxChild(ul: Element): boolean {
	return ul.children.some(
		(li) => li.type === 'element' && li.tagName === 'li' && findCheckboxInSubtree(li) !== undefined
	);
}

/** Depth-first search for a checkbox `<input>`, returning its direct parent and index. */
function findCheckboxInSubtree(node: Element): { parent: Element; index: number } | undefined {
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i]!;
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

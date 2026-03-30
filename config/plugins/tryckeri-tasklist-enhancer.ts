import { defineHastPlugin } from 'tryckeri';
import type { HastNode } from 'tryckeri';

/**
 * Tryckeri HAST plugin to enhance the output of GitHub-Flavored Markdown's task lists.
 * This improves possibilities for our `<Checklist>` component.
 *
 * 1. Wraps checkboxes and siblings in a `<label>` to associate them.
 * 2. Wraps sibling nodes after checkboxes in `<span>` to ease styling `:checked ~ *`.
 */
export function tasklistEnhancerPlugin() {
	return defineHastPlugin({
		name: 'tasklist-enhancer',
		createOnce() {
			return {
				element(node: HastNode, ctx: any): HastNode | void {
					// Add contains-task-list class to <ul> parents of task list items
					if (node.tagName === 'ul' && hasCheckboxChild(node)) {
						ctx.setProperty(node, 'className', ['contains-task-list']);
						return;
					}

					// Match <li> elements containing a checkbox input
					if (node.tagName !== 'li') return;

					const children = node.children;
					if (!children) return;

					const result = findCheckboxInSubtree(node);
					if (!result) return;

					const { parent, index } = result;
					const parentChildren = parent.children!;

					const head = parentChildren.slice(0, index + 1);
					const tail = parentChildren.slice(index + 1);
					const label = h('label', {}, [...head, h('span', {}, tail)]);

					// Build new li with restructured children
					let newChildren: HastNode[];
					if (parent === node) {
						// Input was a direct child of the li
						newChildren = [label];
					} else {
						// Input was inside a child element (e.g. <p>) — clone that child
						newChildren = children.map((child) =>
							child === parent ? h(parent.tagName!, parent.properties ?? {}, [label]) : child
						);
					}

					return {
						type: 'element',
						tagName: node.tagName,
						properties: {
							...(node.properties ?? {}),
							className: ['task-list-item'],
						},
						children: newChildren,
						data: null,
					};
				},
			};
		},
	});
}

/** Check if a <ul> has any direct <li> children containing a checkbox. */
function hasCheckboxChild(ul: HastNode): boolean {
	if (!ul.children) return false;
	return ul.children.some(
		(li) => li.type === 'element' && li.tagName === 'li' && findCheckboxInSubtree(li) !== undefined
	);
}

/** Depth-first search for a checkbox `<input>`, returning its direct parent and index. */
function findCheckboxInSubtree(node: HastNode): { parent: HastNode; index: number } | undefined {
	const children = node.children;
	if (!children) return;

	for (let i = 0; i < children.length; i++) {
		const child = children[i]!;
		if (
			child.type === 'element' &&
			child.tagName === 'input' &&
			child.properties?.['type'] === 'checkbox'
		) {
			return { parent: node, index: i };
		}
	}

	for (const child of children) {
		const result = findCheckboxInSubtree(child);
		if (result) return result;
	}
}

function h(tag: string, properties: Record<string, unknown>, children: HastNode[]): HastNode {
	return {
		type: 'element',
		tagName: tag,
		properties,
		children,
		data: null,
	} as HastNode;
}

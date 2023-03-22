import type { BlockContent } from 'mdast';
import type { MdxJsxAttribute, MdxJsxFlowElement } from 'mdast-util-mdx-jsx';

interface NodeProps {
	attributes?: Record<string, string | boolean | number | undefined | null>;
}

/**
 * Create AST node for a custom component injection.
 *
 * @example
 * makeComponentNode('MyComponent', { prop: 'val' }, h('p', 'Paragraph inside component'))
 *
 */
export function makeComponentNode(
	name: string,
	{ attributes = {} }: NodeProps = {},
	...children: BlockContent[]
): MdxJsxFlowElement {
	return {
		type: 'mdxJsxFlowElement',
		name,
		attributes: Object.entries(attributes)
			// Filter out non-truthy attributes to avoid empty attrs being parsed as `true`.
			.filter(([_k, v]) => v !== false && Boolean(v))
			.map(([name, value]) => ({
				type: 'mdxJsxAttribute',
				name,
				value: value as MdxJsxAttribute['value'],
			})),
		children,
	};
}

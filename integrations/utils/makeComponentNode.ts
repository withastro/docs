import type { BlockContent } from 'mdast';

interface NodeProps {
	attributes?: Record<string, string | boolean | number | undefined | null>;
}

function makeAFMDComponentNode(
	hName: string,
	{ attributes }: NodeProps,
	...children: BlockContent[]
) {
	return {
		type: 'afmdJsxFlowElement',
		data: { hName, hProperties: attributes },
		children,
	};
}

export function makeMDXComponentNode(
	name: string,
	{ attributes = {} }: NodeProps = {},
	...children: BlockContent[]
) {
	return {
		type: 'mdxJsxFlowElement',
		name,
		attributes: Object.entries(attributes)
			// Filter out non-truthy attributes to avoid empty attrs being parsed as `true`.
			.filter(([_k, v]) => v !== false && Boolean(v))
			.map(([name, value]) => ({ type: 'mdxJsxAttribute', name, value })),
		children,
	};
}

interface ComponentNodeProps extends NodeProps {
	mdx: boolean;
}

/**
 * Create AST node for a custom component injection. The data type differs
 * depending on if you need to inject into a MDX or Astro-flavored Markdown
 * context.
 *
 * @example
 * makeComponentNode('MyComponent', { mdx: true }, h('p', 'Paragraph inside component'))
 *
 */
export function makeComponentNode(
	tagName: string,
	{ mdx, ...opts }: ComponentNodeProps,
	...children: BlockContent[]
) {
	const factory = mdx ? makeMDXComponentNode : makeAFMDComponentNode;
	return factory(tagName, opts, ...children);
}

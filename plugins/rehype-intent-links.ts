import { visit } from 'unist-util-visit';
import type { Plugin, Transformer } from 'unified';
import type { Root } from 'hast';
import { linkIntent } from '../src/util/intent';

/** Adds `data-intent` to links that leave the docs for pricing, sales or sign-up. */
export const tagIntentLinks = (tree: Root): void => {
	visit(tree, 'element', (node) => {
		const href = node.properties?.href;
		if (node.tagName !== 'a' || typeof href !== 'string') return;
		const intent = linkIntent(href);
		if (intent) node.properties.dataIntent = intent;
	});
};

export function rehypeIntentLinks(): Plugin<[], Root> {
	const transformer: Transformer<Root> = (tree) => tagIntentLinks(tree);
	return function attacher() {
		return transformer;
	};
}

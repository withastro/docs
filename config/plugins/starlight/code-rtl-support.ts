import { defineHastPlugin } from 'satteri';

import type { RemarkRehypePluginOptions } from './remark-rehype';

/**
 * Sätteri HAST plugin that adds `dir` attributes to `<code>` and `<pre>`
 * elements that don’t already have them.
 *
 * `<code>` will become `<code dir="auto">`
 * `<pre>` will become `<pre dir="ltr">`
 *
 * Reasoning:
 * - `<pre>` is usually a code block and code should be LTR even in an RTL document
 * - `<code>` is often LTR, but could also be RTL. `dir="auto"` ensures the bidirectional
 *   algorithm treats the contents of `<code>` in isolation and gives its best guess.
 *
 * Unlike the upstream rehype version, Sätteri's filtered element visitors don't
 * expose ancestors, so a `<code>` inside `<pre>` also receives `dir="auto"`
 * instead of inheriting `ltr` from its parent. In practice this is harmless —
 * `dir="auto"` on code that's already LTR resolves the same way.
 */
export function rtlCodeSupportPlugin(_options?: RemarkRehypePluginOptions) {
	return defineHastPlugin({
		name: 'rtl-code-support',
		element: [
			{
				filter: ['pre'],
				visit(node, ctx) {
					if (node.properties && 'dir' in node.properties) return;
					ctx.setProperty(node, 'dir', 'ltr');
				},
			},
			{
				filter: ['code'],
				visit(node, ctx) {
					if (node.properties && 'dir' in node.properties) return;
					ctx.setProperty(node, 'dir', 'auto');
				},
			},
		],
	});
}

import type { AstroIntegration } from 'astro';
import type { BlockContent, Root, Parent } from 'mdast';
import type { Plugin, Transformer } from 'unified';
import { visit } from 'unist-util-visit';

const CodeSnippetTagname = 'AutoImportedCodeSnippet';

export interface CodeSnippetWrapper extends Parent {
	type: 'codeSnippetWrapper'
	children: BlockContent[]
}

declare module 'mdast' {
	interface BlockContentMap {
		codeSnippetWrapper: CodeSnippetWrapper
	}
}

export function remarkCodeSnippets(): Plugin<[], Root> {
	const transformer: Transformer<Root> = (tree) => {
		visit(tree, 'code', (code, index, parent) => {
			if (index === null || parent === null)
				return;
			
			// console.log(JSON.stringify(code, null, 2));

			// const renderedContent: HTML = {
			// 	type: 'html',
			// 	value: `<pre>This is a code snippet (lang=${JSON.stringify(code.lang)}, meta=${JSON.stringify(code.meta)})\n${code.value}</pre>`
			// }

			const codeSnippetWrapper: CodeSnippetWrapper = {
				type: 'codeSnippetWrapper',
				data: {
					hName: CodeSnippetTagname,
					hProperties: {
						lang: code.lang,
						meta: code.meta,
					},
				},
				children: [code],
			};
			
			parent.children.splice(index, 1, codeSnippetWrapper);
		});
	};

	return function attacher() {
		return transformer;
	};
}

/**
 * Astro integration that adds our code snippets remark plugin
 * and auto-imports the `CodeSnippet` component everywhere.
 */
export function astroCodeSnippets(): AstroIntegration {
	return {
		name: '@astrojs/code-snippets',
		hooks: {
			'astro:config:setup': ({ injectScript, updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [remarkCodeSnippets()],
					},
				});

				// Auto-import the Aside component and attach it to the global scope
				injectScript('page-ssr', `import ${CodeSnippetTagname} from "~/components/CodeSnippet.astro"; global.${CodeSnippetTagname} = ${CodeSnippetTagname};`);
			},
		},
	};
}

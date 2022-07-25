import type { AstroIntegration } from 'astro';
import type { BlockContent, Root, Parent } from 'mdast';
import type { Plugin, Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { escapeHtml } from '../src/util';

const CodeSnippetTagname = 'AutoImportedCodeSnippet';
const FileNameCommentExtensions = [
	// Components & Scripts
	'astro', 'cjs', 'js', 'jsx', 'mjs', 'svelte', 'ts', 'tsx', 'vue',
	// Styles
	'css', 'less', 'sass', 'scss', 'styl', 'stylus',
	// Text Content
	'md', 'mdx',
	// Data & Config Files
	'env', 'json', 'yaml', 'yml',
];
const FileNameCommentRegExp = new RegExp(
	[
		// Start of line
		`^`,
		// Optional whitespace
		`\\s*`,
		// Mandatory comment start (`//`, `#` or `<!--`)
		`(?://|#|<!--)`,
		// Optional whitespace
		`\\s*`,
		// Optional sequence of characters, followed by a Japanese colon or a regular colon (`:`),
		// but not by `://`. Matches strings like `File name:`, but not `https://example.com/test.md`.
		`(?:(.*?)(?:\\uff1a|:(?!//)))?`,
		// Optional whitespace
		`\\s*`,
		// Optional sequence of characters allowed in file paths
		`([\\w./[\\]\\\\-]*`,
		// Mandatory dot and supported file extension
		`\\.(?:${FileNameCommentExtensions.join('|')}))`,
		// Optional whitespace
		`\\s*`,
		// Optional HTML comment end (`-->`)
		`(?:-->)?`,
		// Optional whitespace
		`\\s*`,
		// End of line
		`$`,
	].join('')
);

export interface CodeSnippetWrapper extends Parent {
	type: 'codeSnippetWrapper';
	children: BlockContent[];
}

declare module 'mdast' {
	interface BlockContentMap {
		codeSnippetWrapper: CodeSnippetWrapper;
	}
}

export function remarkCodeSnippets(): Plugin<[], Root> {
	const transformer: Transformer<Root> = (tree) => {
		visit(tree, 'code', (code, index, parent) => {
			if (index === null || parent === null) return;

			const { code: processedCode, fileName: extractedFileName } = preprocessCode(code.value);
			code.value = processedCode;

			let fileName = extractedFileName;

			// If no file name could be extracted from the code, check if the previous
			// Markdown paragraph contains a file name for the code snippet
			if (!fileName && index > 0) {
				const prev = parent.children[index - 1];
				// Require the previous paragraph to contain one child with strong formatting
				const prevParaStrongChild = prev.type === 'paragraph' &&
					prev.children.length === 1 &&
					prev.children[0].type === 'strong' &&
					prev.children[0].children.length === 1 &&
					prev.children[0].children[0];
				// Require the child to be either raw text or inline code and retrieve its value
				const prevParaStrongTextValue = prevParaStrongChild &&
					prevParaStrongChild.type === 'text' &&
					prevParaStrongChild.value;
				const prevParaStrongCodeValue = prevParaStrongChild &&
					prevParaStrongChild.type === 'inlineCode' &&
					prevParaStrongChild.value;
				const potentialFileName = prevParaStrongTextValue || prevParaStrongCodeValue;
				// Check if it's a file name
				const matches = potentialFileName &&
					FileNameCommentRegExp.exec(`// ${potentialFileName}`);
				if (matches) {
					// Yes, store the file name and replace the paragraph with an empty node
					fileName = matches[2];
					parent.children[index - 1] = {
						type: 'html',
						value: '',
					};
				}
			}

			const codeSnippetWrapper: CodeSnippetWrapper = {
				type: 'codeSnippetWrapper',
				data: {
					hName: CodeSnippetTagname,
					hProperties: {
						lang: code.lang,
						meta: code.meta ? escapeHtml(code.meta) : undefined,
						fileName,
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
 * Preprocesses the given raw code snippet before being handed to the syntax highlighter.
 * 
 * Does the following things:
 * - Trims empty lines at the beginning or end of the code block
 * - Checks the first lines for a comment line ending with a file name.
 *   - If a matching line is found, removes it from the code
 *     and returns the extracted file name in the result object.
 * - Normalizes whitespace and line endings
 */
function preprocessCode(code: string) {
	let fileName: string | undefined;

	// Split the code into lines and remove any empty lines at the beginning & end
	const lines = code.split(/\r?\n/);
	while (lines.length > 0 && lines[0].trim().length === 0) {
		lines.shift();
	}
	while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
		lines.pop();
	}

	// Try to find a file name comment in the first 5 lines of the given code
	const lineIdx = lines.slice(0, 4).findIndex((line) => {
		const matches = FileNameCommentRegExp.exec(line);
		if (matches) {
			fileName = matches[2];
			return true;
		}
		return false;
	});

	// Was a file name comment line found?
	if (lineIdx > -1) {
		// Yes, remove it from the code
		lines.splice(lineIdx, 1);
		// If the following line is empty, remove it as well
		if (!lines[lineIdx]?.trim().length) {
			lines.splice(lineIdx, 1);
		}
	}

	// If only one line is left, trim any leading indentation
	if (lines.length === 1)
		lines[0] = lines[0].trimStart();

	// Rebuild code with normalized line endings
	code = lines.join('\n');

	// Convert tabs to 2 spaces
	code = code.replace(/\t/g, '  ');

	return {
		code,
		fileName,
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

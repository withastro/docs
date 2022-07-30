import type { AstroIntegration } from 'astro';
import { escape } from 'html-escaper';
import type { BlockContent, Root, Parent } from 'mdast';
import type { Plugin, Transformer } from 'unified';
import type { BuildVisitor } from 'unist-util-visit/complex-types';
import { visit } from 'unist-util-visit';

const CodeSnippetTagname = 'AutoImportedCodeSnippet';
const LanguageGroups = {
	code: ['astro', 'cjs', 'htm', 'html', 'js', 'jsx', 'mjs', 'svelte', 'ts', 'tsx', 'vue'],
	data: ['env', 'json', 'yaml', 'yml'],
	styles: ['css', 'less', 'sass', 'scss', 'styl', 'stylus'],
	textContent: ['markdown', 'md', 'mdx'],
};
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
		`\\.(?:${Object.values(LanguageGroups).flat().sort().join('|')}))`,
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
	const visitor: BuildVisitor<Root, 'code'> = (code, index, parent) => {
		if (index === null || parent === null) return;

		// Parse optional meta information after the opening code fence,
		// trying to get a meta title and an array of highlighted lines
		const { title: metaTitle, highlightedLines, highlightedExpressions } = parseMeta(code.meta || '');
		let title = metaTitle;

		// Preprocess the code
		const { preprocessedCode, extractedFileName } = preprocessCode(
			code.value,
			code.lang || '',
			// Only try to extract a file name from the code if no meta title was found above
			title === undefined
		);
		code.value = preprocessedCode;
		if (extractedFileName) {
			title = extractedFileName;
		}

		// If there was no title in the meta information or in the code, check if the previous
		// Markdown paragraph contains a file name that we can use as a title
		if (title === undefined && index > 0) {
			// Check the previous node to see if it matches our requirements
			const prev = parent.children[index - 1];
			const strongContent =
				// The previous node must be a paragraph...
				prev.type === 'paragraph' &&
				// ...it must contain exactly one child with strong formatting...
				prev.children.length === 1 &&
				prev.children[0].type === 'strong' &&
				// ...this child must also contain exactly one child
				prev.children[0].children.length === 1 &&
				// ...which is the result of this expression
				prev.children[0].children[0];

			// Require the strong content to be either raw text or inline code and retrieve its value
			const prevParaStrongTextValue = strongContent && strongContent.type === 'text' && strongContent.value;
			const prevParaStrongCodeValue = strongContent && strongContent.type === 'inlineCode' && strongContent.value;
			const potentialFileName = prevParaStrongTextValue || prevParaStrongCodeValue;

			// Check if it's a file name
			const matches = potentialFileName && FileNameCommentRegExp.exec(`// ${potentialFileName}`);
			if (matches) {
				// Yes, store the file name and replace the paragraph with an empty node
				title = matches[2];
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
					title,
					highlightedLines,
					highlightedExpressions: highlightedExpressions && escape(highlightedExpressions) || undefined,
				},
			},
			children: [code],
		};

		parent.children.splice(index, 1, codeSnippetWrapper);
	};

	const transformer: Transformer<Root> = (tree) => {
		visit(tree, 'code', visitor);
	};

	return function attacher() {
		return transformer;
	};
}

/**
 * Parses the given meta information string and returns contained supported properties.
 *
 * Meta information is the string after the opening code fence and language name.
 *
 * In the following example, it's `title="example.js" {1,3-4}`:
 *
 * ````md
 * ```js title="example.js" {1,3-4}
 * // Line 1, this will be highlighted
 * // Line 2
 * // Line 3, this will be highlighted
 * // Line 4, this will be highlighted
 * ```
 * ````
 */
function parseMeta(meta: string) {
	// Try to find the meta property `title="..."`, store its value and remove it from meta
	const titleMatch = meta.match(/title="(.*?)"/);
	const title = titleMatch?.[1];
	meta = (titleMatch?.[0] && meta.replace(titleMatch[0], '')) || meta;

	// Try to find a range of highlighted lines inside curly braces like `{4-5,10}`,
	// store its value and remove it from meta
	const highlightedLinesMatch = meta.match(/{([0-9,\s-]*)}/);
	const highlightedLines = highlightedLinesMatch?.[1];
	meta = (highlightedLinesMatch?.[0] && meta.replace(highlightedLinesMatch[0], '')) || meta;

	// Try to find highlighted expressions between forward slashes like `/slot=".*?"|sidebar/`,
	// store its value and remove it from meta
	const highlightedExpressionsMatch = meta.match(/\/(.*)\//);
	const highlightedExpressions = highlightedExpressionsMatch?.[1];
	meta = (highlightedExpressionsMatch?.[0] && meta.replace(highlightedExpressionsMatch[0], '')) || meta;

	return {
		title,
		highlightedLines,
		highlightedExpressions,
	};
}

/**
 * Preprocesses the given raw code snippet before being handed to the syntax highlighter.
 *
 * Does the following things:
 * - Trims empty lines at the beginning or end of the code block
 * - If `extractFileName` is true, checks the first lines for a comment line with a file name.
 *   - If a matching line is found, removes it from the code
 *     and returns the extracted file name in the result object.
 * - Normalizes whitespace and line endings
 */
function preprocessCode(code: string, lang: string, extractFileName: boolean) {
	let extractedFileName: string | undefined;

	// Split the code into lines and remove any empty lines at the beginning & end
	const lines = code.split(/\r?\n/);
	while (lines.length > 0 && lines[0].trim().length === 0) {
		lines.shift();
	}
	while (lines.length > 0 && lines[lines.length - 1].trim().length === 0) {
		lines.pop();
	}

	// If requested, try to find a file name comment in the first 5 lines of the given code
	if (extractFileName) {
		const lineIdx = lines.slice(0, 4).findIndex((line) => {
			const matches = FileNameCommentRegExp.exec(line);
			if (matches) {
				extractedFileName = matches[2];
				return true;
			}
			return false;
		});

		// If the syntax highlighting language is contained in our known language groups,
		// ensure that the extracted file name has an extension that matches the group
		if (extractedFileName) {
			const languageGroup = Object.values(LanguageGroups).find((group) => group.includes(lang));
			const fileExt = extractedFileName.match(/\.([^.]+)$/)?.[1];
			if (languageGroup && fileExt && !languageGroup.includes(fileExt)) {
				// The file extension does not match the syntax highlighting language,
				// so it's not a valid file name for this code snippet
				extractedFileName = undefined;
			}
		}

		// Was a valid file name comment line found?
		if (extractedFileName) {
			// Yes, remove it from the code
			lines.splice(lineIdx, 1);
			// If the following line is empty, remove it as well
			if (!lines[lineIdx]?.trim().length) {
				lines.splice(lineIdx, 1);
			}
		}
	}

	// If only one line is left, trim any leading indentation
	if (lines.length === 1) lines[0] = lines[0].trimStart();

	// Rebuild code with normalized line endings
	let preprocessedCode = lines.join('\n');

	// Convert tabs to 2 spaces
	preprocessedCode = preprocessedCode.replace(/\t/g, '  ');

	return {
		preprocessedCode,
		extractedFileName,
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

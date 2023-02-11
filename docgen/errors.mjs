import { slug as githubSlug } from 'github-slugger';
import jsdoc from 'jsdoc-api';
import ts from 'typescript';

export async function scrapeFileForErrors(fileContents) {
	const astroErrorData = await getTranspiledSourceFile(fileContents);

	// TODO: Implement compiler errors

	let result = [];
	for (const comment of astroErrorData.jsdoc) {
		const proccessedCommentDoc = processErrorComment(comment, astroErrorData.errors[comment.longname]);
		if (!proccessedCommentDoc) {
			continue;
		}
		result.push(proccessedCommentDoc);
	}
	return result;
}


/**
 * @param {(string | function)} message
 * @returns {(string | undefined)} Formatted message for the error or `undefined`
 */
function getMessage(message) {
	if (typeof message === 'string') {
		return message.trim();
	}
	if (typeof message === 'function') {
		return String.raw({
			raw: extractStringFromFunction(message.toString()),
		}).trim();
	}
}


function processErrorComment(comment, errorData) {
	if (comment.kind === 'heading') {
		throw new Error('DEPRECATED');
	}
	const categoryFlag = comment.tags.find((f) => f.title === 'category');
	if (!categoryFlag || categoryFlag.text !== 'error') {
		throw new Error(`Expected Error, got ${categoryFlag.text} (${comment.longname})`);
	}

	const errorCode = errorData.code;
	return {
		slug: githubSlug(comment.longname),
		name: comment.longname,
		description: comment.description && comment.description.trim(),
		category: categoryFlag && categoryFlag.text,
		seeAlsoLinks: [...(comment.see || []).join('\n').matchAll(/\[(.*?)\]\((.*?)\)/g)].map(m => ([m[1], m[2]])),
		deprecated: comment.deprecated,
		version: comment.version,
		meta: {
			code: errorCode,
			message: getMessage(comment.tags.find((tag) => tag.title === 'message')?.value || errorData.message)
		}
	};
}

async function getTranspiledSourceFile(fileContents) {
	const compiledResult = ts.transpileModule(fileContents, {
		compilerOptions: { module: 'esnext', target: 'esnext', removeComments: false },
	}).outputText;

	const encodedJs = encodeURIComponent(compiledResult);
	const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;

	/**
	 * @type {{AstroErrorData: Object.<string, {code: number, message: string, hint: string}>}
	 */
	const data = await import(dataUri);

	/**
	 * Get all the JSDoc comments in the file marked with the tag `@docs`
	 */
	const jsDocComments = jsdoc
		.explainSync({ source: compiledResult })
		.filter((data) => data.tags && data.tags.some((tag) => tag.title === 'docs'));

	return {
		errors: data.AstroErrorData,
		jsdoc: jsDocComments,
	};
}

function extractStringFromFunction(func) {
	const arrowIndex = func.indexOf('=>') + '=>'.length;

	return escapeHtml(func.slice(arrowIndex).trim().slice(1, -1));

	function escapeHtml(unsafe) {
		return unsafe
			.replaceAll(
				/\${([^}]+)}/gm,
				(str, match1) =>
					`${match1
						.split(/\.?(?=[A-Z])/)
						.join('_')
						.toUpperCase()}`
			)
			.replaceAll('\\`', '`')
			.replaceAll(/`?(client:[\w]+(="\(.+\)")?)`?/g, '`$1`')
			.replaceAll(/&/g, '&amp;')
			.replaceAll(/</g, '&lt;')
			.replaceAll(/>/g, '&gt;');
	}
}

/**
 * Make sure client directives are wrapped in backticks to avoid a docs bug
 * @param {string} message
 */
function sanitizeString(message) {
	return message.replaceAll(/`?(client:[\w]+(="\(.+\)")?)`?/g, '`$1`');
}

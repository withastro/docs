export class CopyButton {
	private codeLines: string[] = []
	private code: string;

	constructor(codeHtmlLines: string[]) {
		this.codeLines = codeHtmlLines;
		this.code = '';

		const lineRegExp = /^<span class="line.*?".*?>(.*)<\/span>$/;
		const tokenRegExp = /<span style="color: ?#[0-9A-Fa-f]+[^"]*">(.*?)<\/span>/g;

		for (const line of this.codeLines) {
			const lineMatches = line.match(lineRegExp);
			if (!lineMatches)
				throw new Error(
					`Shiki-highlighted code line HTML did not match expected format. HTML code:\n${line}`
				);

			const tokensHtml = lineMatches[1];

			// Split line into inline tokens
			const tokenMatches = tokensHtml.matchAll(tokenRegExp);

			let textLine = '';

			for (const tokenMatch of tokenMatches) {
				const [,innerHtml] = tokenMatch;
				const text = unescape(innerHtml);
				textLine += text;
			}

			this.code += textLine + '\n'
		}

		this.code = this.code.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, "\"")
			.replace(/&#39;/g, "'");  
	}

	renderToHtml() {
		return `<button class="copy-button" value="${encodeURIComponent(this.code)}">copy</button>`;
	}
}

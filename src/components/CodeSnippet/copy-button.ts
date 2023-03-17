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
		return `<button class="copy-button" title="Copy to clipboard" aria-label="Copy" value="${encodeURIComponent(this.code)}"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><g transform="scale(0.5 0.5)"><path d="M15 37.95q-1.25 0-2.125-.875T12 34.95v-28q0-1.25.875-2.125T15 3.95h22q1.25 0 2.125.875T40 6.95v28q0 1.25-.875 2.125T37 37.95Zm0-3h22v-28H15v28Zm-6 9q-1.25 0-2.125-.875T6 40.95V12.3q0-.65.425-1.075Q6.85 10.8 7.5 10.8q.65 0 1.075.425Q9 11.65 9 12.3v28.65h22.2q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425Zm6-37v28-28Z" fill="currentcolor"/></g></svg></button>`;
	}
}

import type { ShikiLine } from './shiki-line';

export type CopyButtonArgs = {
	copyButtonTitle?: string;
	copyButtonTooltip?: string;
};

export class CopyButton {
	private code: string;
	private title: string;
	private tooltip: string;

	constructor(lines: ShikiLine[], CopyButtonArgs: CopyButtonArgs) {
		this.title = CopyButtonArgs.copyButtonTitle || '';
		this.tooltip = CopyButtonArgs.copyButtonTooltip || '';
		this.code = lines.map((line) => line.textLine).join('\n');
	}

	renderToHtml() {
		return `<div class="copy-button-wrapper" aria-live="polite">
	<button
		class="copy-button"
		title="${this.title}"
		value="${encodeURIComponent(this.code)}"
	><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true">
			<path d="M7.5 18.98q-.63 0-1.06-.44T6 17.48v-14q0-.63.44-1.07t1.06-.44h11q.63 0 1.06.44T20 3.47v14q0 .63-.44 1.07t-1.06.44Zm0-1.5h11v-14h-11v14Zm-3 4.5q-.63 0-1.06-.44T3 20.48V6.15q0-.33.21-.54.21-.21.54-.21.33 0 .54.21.21.21.21.54v14.32h11.1q.33 0 .54.22.21.21.21.53 0 .33-.21.54-.22.22-.54.22Zm3-18.5v14-14Z"/>
		</svg></button>
	<p class="copy-button-tooltip">${this.tooltip}</p>
</div>`;
	}
}

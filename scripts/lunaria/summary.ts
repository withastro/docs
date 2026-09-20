import type { Locale, LunariaConfig, LunariaStatus } from '@lunariajs/core';
import { getDashboardStatus, getLocalization, html } from '@lunariajs/core/dashboard';

/**
 * Build an SVG file showing a summary of each language’s translation progress.
 * Embedded in the repository README and served at `https://i18n.docs.astro.build/summary.svg`.
 */
export const SvgSummary = (config: LunariaConfig, status: LunariaStatus): string => {
	const localeHeight = 56; // Each locale’s summary is 56px high.
	const svgHeight = localeHeight * Math.ceil(config.locales.length / 2);
	return html`<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 400 ${svgHeight.toString()}"
		font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
	>
		${config.locales
			.map((locale) => SvgLocaleSummary(status, locale))
			.sort((a, b) => b.progress - a.progress)
			.map(({ svg }, index) => {
				const x = (index % 2) * 215;
				const y = Math.floor(index / 2) * localeHeight;
				return html`<g transform="translate(${x.toString()} ${y.toString()})">${svg}</g>`;
			})}
	</svg>`;
};

function SvgLocaleSummary(
	status: LunariaStatus,
	{ label, lang }: Locale
): { svg: string; progress: number } {
	let missing = 0;
	let outdated = 0;
	for (const entry of status) {
		const dashboardStatus = getDashboardStatus(getLocalization(entry, lang));
		if (dashboardStatus === 'missing') missing++;
		else if (dashboardStatus === 'outdated') outdated++;
	}

	const done = status.length - outdated - missing;
	const barWidth = 184;
	const doneFraction = done / status.length;
	const outdatedFraction = outdated / status.length;
	const doneWidth = (doneFraction * barWidth).toFixed(2);
	const outdatedWidth = ((outdatedFraction + doneFraction) * barWidth).toFixed(2);
	const summary =
		missing === 0 && outdated === 0
			? '100% complete, amazing job! 🎉'
			: `${done} done, ${outdated} outdated, ${missing} missing`;

	return {
		progress: doneFraction,
		svg: html`<text x="0" y="12" font-size="11" font-weight="600" fill="#999"
				>${label} (${lang})</text
			>
			<text x="0" y="26" font-size="9" fill="#999">${summary}</text>
			<rect
				x="0"
				y="34"
				width="${barWidth.toString()}"
				height="8"
				fill="#999"
				opacity="0.25"
			></rect>
			<rect x="0" y="34" width="${outdatedWidth}" height="8" fill="#fb923c"></rect>
			<rect x="0" y="34" width="${doneWidth}" height="8" fill="#c084fc"></rect>`,
	};
}

import { astroExpressiveCode, ExpressiveCodeTheme, pluginFramesTexts } from 'astro-expressive-code';
import path from 'path';
import { translations } from '../src/i18n/util';
import { theme } from './syntax-highlighting-theme';

// Provide Expressive Code with texts from our translations
Object.entries(translations).forEach(([locale, texts]) => {
	pluginFramesTexts.overrideTexts(locale, {
		terminalWindowFallbackTitle: texts['expressiveCode.terminalWindowFallbackTitle'],
		copyButtonTooltip: texts['expressiveCode.copyButtonTooltip'],
		copyButtonCopied: texts['expressiveCode.copyButtonCopied'],
	});
});

// Allow creation of a pre-configured Expressive Code integration that matches the Astro Docs theme
export const astroDocsExpressiveCode = () =>
	astroExpressiveCode({
		theme: new ExpressiveCodeTheme(theme),
		styleOverrides: {
			codeBackground: 'var(--theme-code-bg)',
			borderColor: 'hsl(269deg 22% 25%)',
			scrollbarThumbColor: 'hsl(269deg 20% 90% / 0.25)',
			scrollbarThumbHoverColor: 'hsl(269deg 20% 90% / 0.5)',
		},
		frames: {
			styleOverrides: {
				editorTabBarBackground: 'var(--theme-code-tabs)',
				editorActiveTabBackground: 'hsl(269deg 40% 65% / 0.15)',
				editorActiveTabBorderBottom: 'hsl(269deg 35% 55%)',
				editorTabBarBorderBottom: 'var(--theme-code-tabs)',

				terminalTitlebarBackground: 'var(--theme-code-tabs)',
				terminalTitlebarBorderBottom: 'transparent',
				terminalBackground: 'var(--theme-code-bg)',
			},
		},
		textMarkers: {
			styleOverrides: {
				defaultChroma: '55',
			},
		},
		getBlockLocale: ({ file }) => {
			// Path format: `src/content/docs/en/getting-started.mdx`
			// Part indices:  0     1      2   3         4
			const pathParts = path.relative(file.cwd, file.path).split(/[\\/]/);
			return pathParts[3];
		},
	});

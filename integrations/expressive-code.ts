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
			codeBackground: 'var(--astro-code-color-background)',
			borderColor: 'var(--sl-color-gray-5)',
			borderWidth: '1px',
			borderRadius: 'none',
			scrollbarThumbColor: 'hsl(269deg 20% 90% / 0.25)',
			scrollbarThumbHoverColor: 'hsl(269deg 20% 90% / 0.5)',
		},
		frames: {
			styleOverrides: {
				frameBoxShadowCssValue: 'none',
				editorTabBarBackground: 'var(--sl-color-accent-low)',
				editorActiveTabForeground: 'var(--sl-color-text)',
				editorActiveTabBackground: 'var(--astro-code-color-background)',
				editorActiveTabBorderTop: 'var(--sl-color-accent)',
				editorTabBarBorderBottom: 'var(--sl-color-gray-5)',

				terminalTitlebarForeground: 'var(--sl-color-text)',
				terminalTitlebarBackground: 'var(--sl-color-accent-low)',
				// Expressive Code’s approach doesn’t support CSS variables here yet.
				terminalTitlebarDotsForeground: '#3D4EF5',
				terminalTitlebarBorderBottom: 'transparent',
				terminalBackground: 'var(--astro-code-color-background)',
			},
		},
		getBlockLocale: ({ file }) => {
			// Path format: `src/content/docs/en/getting-started.mdx`
			// Part indices:  0     1      2   3         4
			const pathParts = path.relative(file.cwd, file.path).split(/[\\/]/);
			return pathParts[3];
		},
	});

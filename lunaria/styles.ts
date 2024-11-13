import { html } from './components';

export const BaseStyles = html`
	<style>
		:root {
			/** Fonts */
			--ln-font-fallback: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif,
				Apple Color Emoji, Segoe UI Emoji;
			--ln-font-body: system-ui, var(--ln-font-fallback);
			--ln-font-mono: 'IBM Plex Mono', Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console',
				'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono',
				'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace;

			/* Light theme colors */
			--ln-color-white: #f9fafb;
			--ln-color-gray-1: #f3f4f6;
			--ln-color-gray-2: #e5e7eb;
			--ln-color-gray-3: #d1d5db;
			--ln-color-gray-4: #9ca3af;
			--ln-color-gray-5: #6b7280;
			--ln-color-gray-6: #4b5563;
			--ln-color-gray-7: #374151;
			--ln-color-black: #030712;
			--ln-color-blue: #3b82f6;
			--ln-color-orange: #f97316;
			--ln-color-purple: #a855f7;

			/** Contextual colors */
			--ln-color-background: var(--ln-color-white);
			--ln-color-link: var(--ln-color-blue);
			--ln-color-done: var(--ln-color-purple);
			--ln-color-outdated: var(--ln-color-orange);
			--ln-color-missing: var(--ln-color-black);
			--ln-color-table-border: var(--ln-color-gray-3);
			--ln-color-table-background: var(--ln-color-gray-1);
		}

		@media (prefers-color-scheme: dark) {
			:root {
				/* Dark theme colors */
				--ln-color-white: #030712;
				--ln-color-gray-1: #374151;
				--ln-color-gray-2: #4b5563;
				--ln-color-gray-3: #6b7280;
				--ln-color-gray-4: #9ca3af;
				--ln-color-gray-5: #d1d5db;
				--ln-color-gray-6: #e5e7eb;
				--ln-color-gray-7: #f3f4f6;
				--ln-color-black: #f9fafb;
				--ln-color-blue: #60a5fa;
				--ln-color-orange: #fb923c;
				--ln-color-purple: #c084fc;
			}
		}

		* {
			box-sizing: border-box;
			margin: 0;
		}

		html {
			background: var(--ln-color-background);
			scrollbar-gutter: stable;
		}

		body {
			color: var(--ln-color-black);
			display: flex;
			flex-direction: column;
			font-family: var(--ln-font-body);
			font-size: 16px;
			line-height: 1.5;
			margin-block: 2rem;
			margin-inline: 1rem;
		}

		h1,
		h2,
		h3,
		h4,
		h5,
		h6 {
			margin-bottom: 1rem;
			font-weight: bold;
			line-height: 1.3;
		}

		h1,
		h2 {
			max-width: 40ch;
		}

		h1 {
			font-size: 2.25rem;
			font-weight: 900;
		}

		h2 {
			font-size: 1.875rem;
			margin-top: 4rem;
		}

		h3,
		h4 {
			margin-top: 3rem;
		}

		h5,
		h6 {
			margin-top: 2rem;
		}

		main {
			max-width: 80ch;
			margin-inline: auto;
		}

		.limit-to-viewport {
			max-width: calc(100vw - 2rem);
		}

		p + p {
			margin-top: 1.25rem;
		}

		a {
			color: var(--ln-color-link);
			text-decoration: none;
		}

		h2 a {
			color: inherit;
		}

		a:hover {
			text-decoration: underline;
		}

		ul {
			font-size: 0.875rem;
		}

		.progress-details {
			margin-bottom: 1.25rem;
		}

		details summary {
			cursor: pointer;
			user-select: none;
		}

		details summary:hover strong,
		details summary:hover::marker {
			color: var(--ln-color-gray-5);
		}

		details p {
			margin-top: 1.2rem;
		}

		details h3 {
			margin-top: 1.2rem;
			font-size: 0.8rem;
		}

		details h4 {
			margin-top: 1rem;
			font-size: 0.8rem;
		}

		details > :last-child {
			margin-bottom: 1rem;
		}

		.create-button {
			padding: 0.1em 0.5em;
			font-weight: bold;
			font-size: 0.75rem;
		}

		.status-by-file {
			margin-bottom: 1rem;
			border-collapse: collapse;
			border: 1px solid var(--ln-color-table-border);
			font-size: 0.8125rem;
			column-gap: 64px;
		}

		.status-by-file tr:first-of-type td {
			padding-top: 0.5rem;
		}

		.status-by-file tr:last-of-type td {
			padding-bottom: 0.5rem;
		}

		.status-by-file tr td:first-of-type {
			padding-inline: 1rem;
		}

		.status-by-file th {
			border-bottom: 1px solid var(--ln-color-table-border);
			background: var(--ln-color-table-background);
			position: sticky;
			top: -1px;
			white-space: nowrap;
			padding-inline: 0.3rem;
		}

		.status-by-file th,
		.status-by-file td {
			padding-block: 0.2rem;
		}

		.status-by-file tbody tr:hover td {
			background: var(--ln-color-table-background);
		}

		.status-by-file th:first-of-type,
		.status-by-file td:first-of-type {
			text-align: left;
			padding-inline-start: 1rem;
		}

		.status-by-file th:last-of-type,
		.status-by-file td:last-of-type {
			text-align: center;
			padding-inline-end: 1rem;
		}

		.status-by-file td:not(:first-of-type) {
			min-width: 2rem;
			text-align: center;
			cursor: default;
		}

		.status-by-file td:not(:first-of-type) a {
			text-decoration: none;
		}

		.progress-summary {
			font-size: 0.8125rem;
		}

		.progress-bar {
			display: flex;
			flex-direction: row;
			margin-top: 0.5rem;
		}

		.progress-bar div:first-of-type {
			border-radius: 36px 0px 0px 36px;
		}

		.progress-bar div:last-of-type {
			border-radius: 0px 36px 36px 0px;
		}

		.up-to-date-bar,
		.outdated-bar,
		.missing-bar {
			width: 1rem;
			height: 1rem;
		}

		.up-to-date-bar {
			background-color: var(--ln-color-done);
		}

		.outdated-bar {
			background-color: var(--ln-color-outdated);
		}

		.missing-bar {
			background-color: var(--ln-color-missing);
		}

		.capitalize {
			text-transform: capitalize;
		}
	</style>
`;

export const CustomStyles = html`
	<style>
		:root {
			--theme-navbar-height: 6rem;
			--theme-mobile-toc-height: 4rem;
			--theme-accent-secondary: hsla(22, 100%, 60%, 1);
			--theme-text: hsla(250, 14%, 90%, 1);
			--theme-bg: hsl(256, 27%, 19%);
			--theme-bg-gradient-top: var(--theme-bg);
			--theme-bg-gradient-bottom: hsl(251, 29%, 11%);
			--theme-bg-gradient: linear-gradient(
				180deg,
				var(--theme-bg-gradient-top),
				var(--theme-bg-gradient-top)
					calc(var(--theme-navbar-height) + var(--theme-mobile-toc-height)),
				var(--theme-bg-gradient-bottom)
			);

			--ln-color-link: #539bf5;
			--ln-color-table-background: hsl(252, 34%, 25%);
			--ln-color-table-border: hsl(252, 34%, 37%);
			--ln-color-background: var(--theme-bg-gradient);
			--ln-color-black: var(--theme-text);
			--ln-color-missing: var(--ln-color-black);
			--ln-color-outdated: #fb923c;
			--ln-color-done: #c084fc;

			color-scheme: dark;
		}

		p a {
			color: var(--theme-accent-secondary);
			text-decoration: underline;
		}

		details summary:hover strong,
		details summary:hover::marker {
			color: var(--theme-accent-secondary);
		}

		.create-button {
			background-color: hsl(213deg 89% 64% / 20%);
			border-radius: 0.5em;
		}
	</style>
`;

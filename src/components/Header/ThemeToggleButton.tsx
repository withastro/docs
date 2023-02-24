import { useEffect, useState } from 'preact/hooks';
import './ThemeToggleButton.css';

interface Props {
	labels: {
		useLight: string;
		useDark: string;
	};
	isInsideHeader?: boolean;
}

const themes = ['light', 'dark'];

const icons = [
	<svg
		key="light"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="currentColor"
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
			clipRule="evenodd"
		/>
	</svg>,
	<svg
		key="dark"
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="currentColor"
		aria-hidden="true"
	>
		<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
	</svg>,
];

const ThemeToggle = ({ labels, isInsideHeader }: Props) => {
	const [theme, setTheme] = useState(() => {
		if (import.meta.env.SSR) {
			return undefined;
		}
		return document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'light') {
			root.classList.remove('theme-dark');
		} else {
			root.classList.add('theme-dark');
		}
	}, [theme]);

	return (
		<div className={`theme-toggle ${isInsideHeader ? 'hide-toggle-on-smaller-screens' : ''}`}>
			{themes.map((t, i) => {
				const icon = icons[i];
				const checked = t === theme;
				const themeLabel = t === 'light' ? labels.useLight : labels.useDark;
				return (
					<label key={themeLabel} title={themeLabel} className={checked ? 'checked' : ''}>
						{icon}
						<input
							type="radio"
							name="theme-toggle"
							checked={checked}
							value={t}
							aria-label={themeLabel}
							onChange={() => {
								const matchesDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

								if ((matchesDarkTheme && t === 'dark') || (!matchesDarkTheme && t === 'light')) {
									localStorage.removeItem('theme');
								} else {
									localStorage.setItem('theme', t);
								}

								setTheme(t);
							}}
						/>
					</label>
				);
			})}
		</div>
	);
};

export default ThemeToggle;

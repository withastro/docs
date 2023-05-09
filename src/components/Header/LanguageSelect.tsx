import type { ChangeEvent } from 'preact/compat';
import languages from '../../i18n/languages';
import './HeaderButton.css';
import './LanguageSelect.css';

const LanguageSelect = ({ lang, label }: { lang: string; label: string }) => {
	return (
		<label className="language-select-wrapper">
			<span className="sr-only">{label}</span>
			<svg
				width="1.25em"
				height="1.25em"
				viewBox="0 0 88.6 77.3"
				focusable="false"
				aria-hidden="true"
				role="img"
			>
				<path
					fill="currentColor"
					d="M61 24.6h7.9l18.7 51.6h-7.7l-5.4-15.5H54.3l-5.6 15.5h-7.2L61 24.6zM72.6 55l-8-22.8L56.3 55h16.3z"
				/>
				<path
					fill="currentColor"
					d="M53.6 60.6c-10-4-16-9-22-14 0 0 1.3 1.3 0 0-6 5-20 13-20 13l-4-6c8-5 10-6 19-13-2.1-1.9-12-13-13-19h8c4 9 10 14 10 14 10-8 10-19 10-19h8s-1 13-12 24c5 5 10 9 19 13l-3 7zm-52-44h56v-8h-23v-7h-9v7h-24v8z"
				/>
			</svg>
			<select
				className="header-button language-select"
				value={lang}
				onChange={(e: ChangeEvent<HTMLSelectElement>) => {
					const newLang = e.currentTarget.value;
					const [_leadingSlash, _oldLang, ...rest] = window.location.pathname.split('/');
					const slug = rest.join('/');
					window.location.pathname = `/${newLang}/${slug}`;
				}}
			>
				{Object.entries(languages).map(([code, name]) => (
					<option key={name} value={code}>
						<span>{name}&nbsp;&nbsp;&nbsp;</span>
					</option>
				))}
			</select>
		</label>
	);
};

export default LanguageSelect;

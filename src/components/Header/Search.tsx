/* jsxImportSource: react */
import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as docsearch from '@docsearch/react';
import '@docsearch/css/dist/style.css';
import type { DocSearchTranslation } from '../../i18n/translation-checkers';
import './HeaderButton.css';
import './Search.css';

const { DocSearchModal, useDocSearchKeyboardEvents } =
	(docsearch as unknown as { default: typeof docsearch }).default || docsearch;

interface Props {
	lang?: string;
	labels: DocSearchTranslation;
}

export default function Search({ lang = 'en', labels }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const searchButtonRef = useRef();
	const [initialQuery, setInitialQuery] = useState(null);

	const onOpen = useCallback(() => {
		setIsOpen(true);
	}, [setIsOpen]);

	const onClose = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	const onInput = useCallback(
		(e) => {
			setIsOpen(true);
			setInitialQuery(e.key);
		},
		[setIsOpen, setInitialQuery]
	);

	useDocSearchKeyboardEvents({
		isOpen,
		onOpen,
		onClose,
		onInput,
		searchButtonRef,
	});

	return (
		<>
			<button
				className="header-button search-input"
				type="button"
				aria-label={labels.button}
				ref={searchButtonRef}
				onClick={onOpen}
			>
				<svg
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					fill="none"
					focusable="false"
					aria-hidden="true"
					role="img"
				>
					<path
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						transform="translate(-1)"
					/>
				</svg>
				<span className="search-placeholder">
					{labels.button} <span className="sr-only">({labels.shortcutLabel})</span>
				</span>
				<span className="search-keyboard-hint">
					<kbd aria-hidden="true">/</kbd>
				</span>
			</button>
			{isOpen &&
				createPortal(
					<DocSearchModal
						initialQuery={initialQuery}
						initialScrollY={window.scrollY}
						onClose={onClose}
						indexName="astro"
						appId="7AFBU8EPJU"
						apiKey="4440670147c44d744fd8da35ff652518"
						searchParameters={{ facetFilters: [[`lang:${lang}`]] }}
						getMissingResultsUrl={({ query }) =>
							`https://github.com/withastro/docs/issues/new?title=Missing+results+for+query+%22${encodeURIComponent(
								query
							)}%22`
						}
						transformItems={(items) => {
							return items.map((item) => {
								// We transform the absolute URL into a relative URL to
								// work better on localhost, preview URLS.
								const a = document.createElement('a');
								a.href = item.url;
								const hash = a.hash === '#overview' ? '' : a.hash;
								return {
									...item,
									url: `${a.pathname}${hash}`,
								};
							});
						}}
						placeholder={labels.placeholder}
						translations={labels.modal}
					/>,
					document.body
				)}
		</>
	);
}

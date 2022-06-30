import type { FunctionalComponent } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { unescapeHtml } from '../../util';
import './TableOfContents.css';

interface Props {
	headers: { depth: number; slug: string; text: string }[];
	labels: {
		onThisPage: string;
		overview: string;
	};
	isMobile?: boolean;
}

const TableOfContents: FunctionalComponent<Props> = ({ headers = [], labels, isMobile }) => {
	headers = [{ depth: 2, slug: 'overview', text: labels.overview }, ...headers].filter(({ depth }) => depth > 1 && depth < 4);
	const toc = useRef<HTMLUListElement>();
	const [currentID, setCurrentID] = useState('overview');
	const [open, setOpen] = useState(!isMobile);
	const onThisPageID = 'on-this-page-heading';

	const Container = ({ children }) => {
		return isMobile ? (
			<details {...{ open }} onToggle={(e) => setOpen(e.target.open)} class="toc-mobile-container">
				{children}
			</details>
		) : (
			children
		);
	};

	const HeadingContainer = ({ children }) => {
		const currentHeading = headers.find(({ slug }) => slug === currentID);
		return isMobile ? (
			<summary class="toc-mobile-header">
				{children}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 1 16 16" width="16" height="16" aria-hidden="true">
					<path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z"></path>
				</svg>
				{!open && currentHeading?.slug !== 'overview' && <span>{currentHeading?.text}</span>}
			</summary>
		) : (
			children
		);
	};

	useEffect(() => {
		if (!toc.current) return;

		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const { id } = entry.target;
					if (id === onThisPageID) continue;
					setCurrentID(entry.target.id);
					break;
				}
			}
		};

		const observerOptions: IntersectionObserverInit = {
			// Negative top margin accounts for `scroll-margin`.
			// Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
			rootMargin: '-100px 0% -66%',
			threshold: 1,
		};

		const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

		// Observe all the headings in the main page content.
		document.querySelectorAll('article :is(h1,h2,h3)').forEach((h) => headingsObserver.observe(h));

		// Stop observing when the component is unmounted.
		return () => headingsObserver.disconnect();
	}, [toc.current]);

	const onLinkClick = (e) => {
		if (!isMobile) return;
		setOpen(false);
		setCurrentID(e.target.getAttribute('href').replace('#', ''));
	};

	return (
		<Container>
			<HeadingContainer>
				<h2 class="heading" id={onThisPageID}>
					{labels.onThisPage}
				</h2>
			</HeadingContainer>
			<ul ref={toc}>
				{headers.map(({ depth, slug, text }) => (
					<li class={`header-link depth-${depth} ${currentID === slug ? 'current-header-link' : ''}`.trim()}>
						<a href={`#${slug}`} onClick={onLinkClick}>
							{unescapeHtml(text)}
						</a>
					</li>
				))}
			</ul>
		</Container>
	);
};

export default TableOfContents;

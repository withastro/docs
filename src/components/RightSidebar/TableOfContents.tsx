import type { FunctionalComponent } from 'preact';
import { h, Fragment } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

interface Props {
	headers: { depth: number; slug: string; text: string }[];
	labels: {
		onThisPage: string;
		overview: string;
	};
}

const TableOfContents: FunctionalComponent<Props> = ({ headers = [], labels }) => {
	headers = [{ depth: 2, slug: 'overview', text: labels.overview }, ...headers].filter(({ depth }) => depth > 1 && depth < 4);
	const toc = useRef<HTMLUListElement>();
	const [currentID, setCurrentID] = useState('overview');

	useEffect(() => {
		if (!toc.current) return;

		const setCurrent: IntersectionObserverCallback = (entries) => {
			const intersectingEntries = [];

			for (const entry of entries) {
				if (entry.isIntersecting) intersectingEntries.push(entry);
			}

			if (intersectingEntries.length === 1) {
				setCurrentID(intersectingEntries[0].target.id);
				scrollIntoView();
			} else if (intersectingEntries.length > 1) {
				const sortedEntries = intersectingEntries.sort((a, b) => {
					return getHeadingIndex(a.target.id) - getHeadingIndex(b.target.id);
				});
				setCurrentID(sortedEntries[0].target.id);
				scrollIntoView();
			}
		};

		const observerOptions: IntersectionObserverInit = {
			// Negative top margin accounts for `scroll-margin`.
			// Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
			rootMargin: '-100px 0px -66% 0px',
			threshold: [0.75, 1],
		};

		const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

		// removes the headings from "on this page" on mobile using [id] selector.
		const headings = document.querySelectorAll('article :is(h1,h2[id],h3)');

		const getHeadingIndex = (id) => Array.from(headings).findIndex((heading) => heading.id === id);

		let scrollPosition = 0;
		let scrollDirection = 10;

		const setScrollDirection = () => {
			if (document.body.getBoundingClientRect().top > scrollPosition) scrollDirection = -10;
			else scrollDirection = 10;
			scrollPosition = document.body.getBoundingClientRect().top;
		};

		window.addEventListener('scroll', setScrollDirection);

		const scrollIntoView = () => {
			const scrollingContext = document.querySelector('.sidebar-nav-inner');
			if (window.matchMedia('(prefers-reduced-motion)')) scrollingContext.scrollBy(0, scrollDirection);
		};

		// Observe all the headings in the main page content.
		headings.forEach((h) => headingsObserver.observe(h));

		// Stop observing/listening when the component is unmounted.
		return () => {
			headingsObserver.disconnect(), window.removeEventListener('scroll', setScrollDirection);
		};
	}, [toc.current]);

	return (
		<>
			<h2 class="heading">{labels.onThisPage}</h2>
			<ul ref={toc}>
				{headers.map(({ depth, slug, text }) => (
					<li class={`header-link depth-${depth} ${currentID === slug ? 'current-header-link' : ''}`.trim()}>
						<a href={`#${slug}`}>{text}</a>
					</li>
				))}
			</ul>
		</>
	);
};

export default TableOfContents;

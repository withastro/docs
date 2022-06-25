import type { FunctionalComponent } from 'preact';
import { h, Fragment } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import { unescapeHtml } from '../../util';

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
			for (const entry of entries) {
				if (entry.isIntersecting) {
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

	return (
		<>
			<h2 class="heading">{labels.onThisPage}</h2>
			<ul ref={toc}>
				{headers.map(({ depth, slug, text }) => (
					<li class={`header-link depth-${depth} ${currentID === slug ? 'current-header-link' : ''}`.trim()}>
						<a href={`#${slug}`}>{unescapeHtml(text)}</a>
					</li>
				))}
			</ul>
		</>
	);
};

export default TableOfContents;

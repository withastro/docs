import type { FunctionalComponent } from 'preact';
import { h, Fragment } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

interface Props {
	headings: { depth: number; slug: string; text: string }[];
	labels: {
		onThisPage: string;
		overview: string;
	};
}

const TableOfContents: FunctionalComponent<Props> = ({ headings = [], labels }) => {
	headings = [{ depth: 2, slug: 'overview', text: labels.overview }, ...headings].filter(({ depth }) => depth > 1 && depth < 4);
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
				{headings.map(({ depth, slug, text }) => (
					<li class={`heading-link depth-${depth} ${currentID === slug ? 'current-heading-link' : ''}`.trim()}>
						<a href={`#${slug}`}>{text}</a>
					</li>
				))}
			</ul>
		</>
	);
};

export default TableOfContents;

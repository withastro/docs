import type { FunctionalComponent } from 'preact';
import { h, Fragment } from 'preact';
import { useState, useEffect, useRef, useMemo } from 'preact/hooks';

interface Props {
	headers: any[];
	labels: {
		onThisPage: string;
		overview: string;
	};
}

const TableOfContents: FunctionalComponent<Props> = ({ headers = [], labels }) => {
	const itemOffsets = useRef([]);
	const [activeId, setActiveId] = useState<string>(undefined);
	const parsedHeaders = useMemo(
		() => headers
			.filter(({ depth }) => depth > 1 && depth < 4)
			.map((header) => {
				let result = { ...header };
				// Stop Pilcrow (¶) character that's added to headings from showing up in sidebar
				if (header.text.endsWith("¶")) {
					result.text = header.text.slice(0, -1);
				}
				return result;
			}),
		[headers]);

	useEffect(() => {
		const getItemOffsets = () => {
			const titles = document.querySelectorAll('article :is(h1, h2, h3, h4)');
			itemOffsets.current = Array.from(titles).map((title) => ({
				id: title.id,
				topOffset: title.getBoundingClientRect().top + window.scrollY,
			}));
		};

		getItemOffsets();
		window.addEventListener('resize', getItemOffsets);

		return () => {
			window.removeEventListener('resize', getItemOffsets);
		};
	}, []);

	return (
		<>
			<h2 class="heading">{labels.onThisPage}</h2>
			<ul>
				<li class={`header-link depth-2 ${activeId === 'overview' ? 'active' : ''}`.trim()}>
					<a href="#overview">{labels.overview}</a>
				</li>
				{parsedHeaders
					.map((header) => (
						<li class={`header-link depth-${header.depth} ${activeId === header.slug ? 'active' : ''}`.trim()}>
							<a href={`#${header.slug}`}>{header.text}</a>
						</li>
					))}
			</ul>
		</>
	);
};

export default TableOfContents;

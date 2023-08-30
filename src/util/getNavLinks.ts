import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';
import { getNav } from './getNav';

interface NavItem {
	text: string;
	slug: string;
}

interface LinkItem {
	text: string;
	link: string;
}

interface PreviousAndNext {
	previous?: LinkItem;
	next?: LinkItem;
}

/**
 * This helper looks for the current page in the global navigation object and,
 * if it finds it, returns the pages before and after it to help build links.
 * @param Astro The Astro global
 * @returns `previous` and `next` links if available
 */
export async function getNavLinks(Astro: Readonly<AstroGlobal>): Promise<PreviousAndNext> {
	const links = (await getNav(Astro)).filter((x) => !('header' in x) && x.slug) as NavItem[];
	return getPreviousAndNext(links, Astro);
}

export function getPreviousAndNext(
	links: NavItem[],
	Astro: Readonly<AstroGlobal>
): PreviousAndNext {
	const index = links.findIndex((x) => Astro.url.pathname.replace(/\/$/, '').endsWith(x.slug));
	const lang = getLanguageFromURL(Astro.url.pathname);

	const makeLinkItem = ({ text, slug }: NavItem): LinkItem => ({ text, link: `/${lang}/${slug}/` });

	return {
		previous: index > 0 ? makeLinkItem(links[index - 1]) : undefined,
		next: index !== -1 && index < links.length - 1 ? makeLinkItem(links[index + 1]) : undefined,
	};
}

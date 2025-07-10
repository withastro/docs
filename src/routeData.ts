import type { APIContext } from 'astro';
import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { tutorialPages as pages } from '~/content';
import { stripLangFromSlug } from '~/util/path-utils';
import { getOgImageUrl } from '~/util/getOgImageUrl';
import { getTutorialPages } from '~/util/getTutorialPages';

export const onRequest = defineRouteMiddleware((context) => {
	updateHead(context);
	updateTutorialPagination(context.locals.starlightRoute);
});

function updateHead(context: APIContext) {
	const { head, entry, isFallback, lang, entryMeta } = context.locals.starlightRoute;

	const ogImageUrl = getOgImageUrl(context.url.pathname, !!isFallback);
	const imageSrc = ogImageUrl ?? '/default-og-image.png';
	const canonicalImageSrc = new URL(imageSrc, context.site);
	const is404 = context.url.pathname.endsWith('/404/');

	const title = head.find((item) => item.tag === 'title');
	const frontmatterTitle = entry.data.head.find((item) => item.tag === 'title');
	if (title && entry.id.split('/')[1] === 'tutorial' && !frontmatterTitle) {
		title.content = context.locals.t('tutorial.title.prefix', {
			title: title.content,
			// TODO(HiDeoo) comment
			lng: entryMeta.lang,
		});
	}

	head.push({ tag: 'meta', attrs: { property: 'og:image', content: canonicalImageSrc.href } });
	head.push({ tag: 'meta', attrs: { name: 'twitter:image', content: canonicalImageSrc.href } });
	head.push({ tag: 'meta', attrs: { name: 'twitter:site', content: 'astrodotbuild' } });

	// Algolia docsearch language facet
	head.push({ tag: 'meta', attrs: { name: 'docsearch:language', content: lang } });

	// Fathom analytics
	head.push({
		tag: 'script',
		attrs: {
			src: 'https://cdn.usefathom.com/script.js',
			'data-site': 'EZBHTSIG',
			'data-canonical': is404 ? 'false' : 'true',
			defer: true,
		},
	});
}

function updateTutorialPagination(starlightRoute: StarlightRouteData) {
	const { entry, locale, pagination } = starlightRoute;

	if (entry.id.split('/')[1] !== 'tutorial') return;

	const tutorialPages = getTutorialPages(pages, locale!);
	const i = tutorialPages.findIndex((p) => p.id === entry.id);

	if (tutorialPages[i - 1]) {
		const prevPage = tutorialPages[i - 1];

		pagination.prev = {
			href: `/${locale}/${stripLangFromSlug(prevPage.id)}/`,
			isCurrent: false,
			label: prevPage.data.title,
			type: 'link',
			badge: undefined,
			attrs: {},
		};
	}

	if (tutorialPages[i + 1]) {
		const nextPage = tutorialPages[i + 1];

		pagination.next = {
			href: `/${locale}/${stripLangFromSlug(nextPage.id)}/`,
			isCurrent: false,
			label: nextPage.data.title,
			type: 'link',
			badge: undefined,
			attrs: {},
		};
	}
}

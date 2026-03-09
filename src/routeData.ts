import type { APIContext } from 'astro';
import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { tutorialPages as pages } from '~/content';
import { stripLangFromSlug } from '~/util/path-utils';
import { getOgImageUrl } from '~/util/getOgImageUrl';
import { getTutorialPages } from '~/util/getTutorialPages';
import { getAbsoluteLocaleUrl } from 'astro:i18n';

export const onRequest = defineRouteMiddleware((context) => {
	updateHead(context);
	updateTutorialPagination(context.locals.starlightRoute);
	updateFallbackCanonicals(context);
});

/**
 * Updates the `<link rel="canonical">` for pages using fallback content to point to the original
 * English version of the page.
 *
 * TODO: If we consider this experiment successful, we should upstream the change to Starlight.
 */
function updateFallbackCanonicals(context: APIContext) {
	const { head, isFallback } = context.locals.starlightRoute;
	if (!isFallback) {
		return;
	}
	const canonicalLink = head.find(
		(entry) => entry.tag === 'link' && entry.attrs?.rel === 'canonical'
	);
	if (!canonicalLink?.attrs?.href || typeof canonicalLink.attrs.href !== 'string') {
		return;
	}
	const { href } = canonicalLink.attrs;
	const canonicalUrl = new URL(href);
	canonicalLink.attrs.href = getAbsoluteLocaleUrl(
		'en',
		stripLangFromSlug(canonicalUrl.pathname.slice(1))
	);
}

function updateHead(context: APIContext) {
	const { head, entry, isFallback, lang, entryMeta } = context.locals.starlightRoute;

	const title = head.find((item) => item.tag === 'title');
	const frontmatterTitle = entry.data.head.find((item) => item.tag === 'title');

	// Update the title of tutorial entry which do not provide a custom title in their frontmatter.
	if (isTutorialEntry(entry) && title && !frontmatterTitle) {
		// Check if a prefix translation exists for the page content language, without any possible
		// fallback.
		const isPrefixTranslated = context.locals.t.exists('tutorial.title.prefix', {
			lngs: [entryMeta.lang],
		});

		if (isPrefixTranslated) {
			// If a prefix translation exists, use it to format the title.
			title.content = context.locals.t('tutorial.title.prefix', {
				title: title.content,
				// Explicitly use the language based on the page content, which can be different from the
				// page language for fallback pages.
				lngs: [entryMeta.lang],
			});
		}
	}

	const ogImageUrl = getOgImageUrl(context.url.pathname, !!isFallback);
	const imageSrc = ogImageUrl ?? '/default-og-image.png';
	const canonicalImageSrc = new URL(imageSrc, context.site);
	const is404 = context.url.pathname.endsWith('/404/');

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

	if (!isTutorialEntry(entry)) return;

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

function isTutorialEntry(entry: StarlightRouteData['entry']) {
	return entry.id.split('/')[1] === 'tutorial';
}

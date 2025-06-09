import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { tutorialPages as pages } from '~/content';
import { stripLangFromSlug } from '~/util/path-utils';
import { getTutorialPages } from '~/util/getTutorialPages';

export const onRequest = defineRouteMiddleware((context) => {
	updateTutorialPagination(context.locals.starlightRoute);
});

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

import { matchesPrefix, stripLocale } from './intent';

export const SIGNUP_URL = 'https://prosopo.io/register/';

export type SignupPlacement = 'inline' | 'sidebar' | 'production';

const SITE_KEY_PAGES: ReadonlyArray<string> = [
	'/basics/index',
	'/basics/client-side-rendering',
	'/basics/server-side-verification',
	'/basics/invisible-captcha',
	'/basics/demo-keys',
	'/basics/test-keys',
	'/framework-integrations',
	'/wordpress-plugin',
	'/integrations',
	'/demos',
];

const docsPath = (pathname: string): string => {
	const path = stripLocale(pathname).replace(/\/+$/, '');
	return path === '/basics' ? '/basics/index' : path;
};

export const showsSiteKeyCta = (pathname: string): boolean => {
	const path = docsPath(pathname);
	return SITE_KEY_PAGES.some((prefix: string): boolean => matchesPrefix(path, prefix));
};

export const signupSource = (pathname: string): string =>
	matchesPrefix(docsPath(pathname), '/wordpress-plugin') ? 'docs-wordpress' : 'docs';

/**
 * Sign-up link naming the docs page and placement in `cta`. No UTM tags: docs
 * shares the prosopo.io analytics, where a tagged link replaces the visit's
 * real source.
 */
export const signupHref = (pathname: string, placement: SignupPlacement): string => {
	const page = docsPath(pathname)
		.replace(/[^a-z0-9]+/gi, '-')
		.replace(/^-+|-+$/g, '')
		.toLowerCase();
	const url = new URL(SIGNUP_URL);
	url.searchParams.set('source', signupSource(pathname));
	url.searchParams.set('cta', `docs-${placement}-${page}`);
	return url.toString();
};

export const SIGNUP_EVENT_CLASS = 'plausible-event-name=Docs+Get+Site+Key';

export const signupEventClasses = (placement: SignupPlacement): string =>
	`${SIGNUP_EVENT_CLASS} plausible-event-placement=${placement}`;

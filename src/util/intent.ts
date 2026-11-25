import intentRules from '../intentRules.json';
import intentTagNames from '../intentTags.json';
import languages from '../i18n/languages';

/**
 * Weighted intent tags for each docs page, emitted as
 * `<meta name="prosopo:intent">` so analytics can tell what a reader wants.
 * The tag vocabulary is owned by `INTENT_TAGS` in @prosopo/types-private in
 * the main repo; `intentTags.json` is a copy kept in sync by a test there.
 */
export type IntentTags = Record<string, number>;
export type IntentRule = { prefix: string; intent: IntentTags };

const knownTags = new Set<string>(intentTagNames);

export const validateIntent = (tags: IntentTags): IntentTags => {
	for (const [name, weight] of Object.entries(tags)) {
		if (!knownTags.has(name)) {
			throw new Error(`Unknown intent tag "${name}"`);
		}
		if (!Number.isFinite(weight) || weight < 0 || weight > 1) {
			throw new Error(`Intent weight for "${name}" must be between 0 and 1, got ${weight}`);
		}
	}
	return tags;
};

export const stripLocale = (path: string): string => {
	const [, first = '', ...rest] = path.split('/');
	return first in languages ? `/${rest.join('/')}` : path;
};

export const matchesPrefix = (path: string, prefix: string): boolean =>
	prefix === '/' || path === prefix || path.startsWith(`${prefix.replace(/\/$/, '')}/`);

/** Rules broadest first, then the page's frontmatter; a weight of 0 removes a tag. */
export const intentForPath = (
	rules: ReadonlyArray<IntentRule>,
	path: string,
	pageIntent: IntentTags = {}
): IntentTags => {
	const localPath = stripLocale(path);
	const merged: IntentTags = {};
	const layers = [
		...rules
			.filter((rule) => matchesPrefix(localPath, rule.prefix))
			.sort((a, b) => a.prefix.length - b.prefix.length)
			.map((rule) => rule.intent),
		pageIntent,
	];
	for (const layer of layers) {
		Object.assign(merged, validateIntent(layer));
	}
	return Object.fromEntries(Object.entries(merged).filter(([, weight]) => weight > 0));
};

export const formatIntent = (tags: IntentTags): string =>
	Object.entries(tags)
		.sort(([nameA, a], [nameB, b]) => b - a || nameA.localeCompare(nameB))
		.map(([name, weight]) => `${name}:${Math.round(weight * 100) / 100}`)
		.join(', ');

export const docsIntent = (path: string, pageIntent?: IntentTags): string =>
	formatIntent(intentForPath(intentRules, path, pageIntent));

const LINK_TARGETS: ReadonlyArray<{ host: string; path: string; intent: IntentTags }> = [
	{ host: 'prosopo.io', path: '/pricing', intent: { buying: 1, pricing: 1 } },
	{ host: 'prosopo.io', path: '/register', intent: { signup: 1 } },
	{ host: 'prosopo.io', path: '/contact', intent: { 'contact-sales': 1 } },
	{ host: 'prosopo.io', path: '/enterprise-form', intent: { enterprise: 1, 'contact-sales': 1 } },
	{ host: 'portal.prosopo.io', path: '/', intent: { signup: 0.9, onboarding: 0.8 } },
	{ host: 'calendly.com', path: '/', intent: { 'contact-sales': 1, 'demo-request': 0.9 } },
];

/** Tags for a link out of the docs, or '' when it says nothing about intent. */
export const linkIntent = (href: string): string => {
	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return '';
	}
	const target = LINK_TARGETS.find(
		({ host, path }) =>
			(url.hostname === host || url.hostname === `www.${host}`) && matchesPrefix(url.pathname, path)
	);
	return target ? formatIntent(validateIntent(target.intent)) : '';
};

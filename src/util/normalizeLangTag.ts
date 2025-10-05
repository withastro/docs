/**
 * Simplified method for normalizing language tags.
 * @param tag Language tag to normalize, e.g. `pt-br` → `pt-BR`
 */
export function normalizeLangTag(tag: string) {
	if (!tag.includes('-')) return tag.toLowerCase();
	const [lang, region] = tag.split('-');
	return lang.toLowerCase() + '-' + region.toUpperCase();
}

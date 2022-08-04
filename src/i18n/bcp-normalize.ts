/**
 * Simplified method for normalizing language tags.
 * We use `bcp-47-normalize` elsewhere, but this is a little presumptuous
 * and strips region identifiers from `pt-BR` and `zh-CN`.
 * @param tag Language tag to normalize, e.g. `pt-br` → `pt-BR`
 */

export function normalizeLangTag(tag: string) {
	if (!tag.includes('-')) return tag.toLowerCase();
	const [lang, region] = tag.split('-');
	return lang.toLowerCase() + '-' + region.toUpperCase();
}

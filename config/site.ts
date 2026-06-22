export function getSiteUrl() {
	const previewBranch = process.env.GITHUB_HEAD_REF;
	const previewSite = previewBranch
		? `https://${previewBranch}.previews.docs.astro.build/`
		: undefined;

	return previewSite || 'https://docs.astro.build/';
}

export function getSiteOrigin() {
	return new URL(getSiteUrl()).origin;
}

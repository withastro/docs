import { getEntry } from 'astro:content';

export async function getLatestNPMVersion(pkg: string): Promise<string> {
	const entry = await getEntry('packages', pkg);
	if (!entry) {
		throw new Error(
			`Unknown package "${pkg}". Add it to the packages collection in src/content.config.ts.`
		);
	}
	return entry?.data.version;
}

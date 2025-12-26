import { AstroError } from 'astro/errors';
import { getEntry } from 'astro:content';

export async function getLatestNPMVersion(pkg: string): Promise<string> {
	const entry = await getEntry('packages', pkg);
	if (!entry) {
		throw new AstroError(
			`Unknown package \`"${pkg}"\`.`,
			`Add \`"${pkg}"\` to the \`packages\` collection in \`./src/content.config.ts\` to fix this error.`
		);
	}
	return entry.data.version;
}

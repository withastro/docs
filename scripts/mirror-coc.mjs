import fs from 'fs';
import fetch from 'node-fetch';

/**
 * Fetch a remote resource and save it to the target path.
 * @param {string} source Source URL to miror from
 * @param {string} target Path to file to write to
 */
async function mirror(source, target) {
	const contents = await fetch(source).then((r) => r.text());
	fs.writeFileSync(target, contents, 'utf8');
}

mirror(
	'https://raw.githubusercontent.com/withastro/astro/main/CODE_OF_CONDUCT.md',
	'CODE_OF_CONDUCT.md'
);

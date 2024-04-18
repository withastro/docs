import fs from 'node:fs';

try {
	let url = new URL('./node_modules/.astro/content/manifest.json', import.meta.url);
	const data = fs.readFileSync(url, 'utf-8');
	const json = JSON.parse(data);
	console.log('Manifest version', json.version);
	//console.log(data);
} catch(err) {
	console.error('Unable to load manifest', err);
}

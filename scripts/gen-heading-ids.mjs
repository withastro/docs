import * as fs from 'node:fs';
import { remark } from 'remark';
import remarkFrontMatter from 'remark-frontmatter';
import remarkMdx from 'remark-mdx';
import remarkHeadingId from 'remark-heading-id';
import { visit } from 'unist-util-visit';
import Slugger from 'github-slugger';
import MagicString from 'magic-string';

const lunariaStatus = JSON.parse(await fs.promises.readFile('dist/lunaria/status.json', 'utf8'));

const allFiles = new Map(
	lunariaStatus
		.filter((entry) => entry.sharedPath.endsWith('.mdx') || entry.sharedPath.endsWith('.md'))
		.flatMap((entry) => [
			[
				entry.sourceFile.path,
				{
					shared:
						entry.sharedPath.slice('src/content/docs'.length, entry.sharedPath.lastIndexOf('.')) +
						'/',
					local:
						entry.sourceFile.path.slice(
							'src/content/docs'.length,
							entry.sourceFile.path.lastIndexOf('.')
						) + '/',
				},
			],
			...Object.values(entry.localizations)
				.filter((loc) => !loc.isMissing && !loc.isOutdated)
				.map((loc) => [
					loc.path,
					{
						shared:
							entry.sharedPath.slice('src/content/docs'.length, entry.sharedPath.lastIndexOf('.')) +
							'/',
						local: loc.path.slice('src/content/docs'.length, loc.path.lastIndexOf('.')) + '/',
					},
				]),
		])
);

const englishFiles = new Map([...allFiles].filter(([, link]) => link.local.startsWith('/en/')));
const translatedFiles = new Map([...allFiles].filter(([, link]) => !link.local.startsWith('/en/')));

const parser = remark().use(remarkFrontMatter, ['yaml']).use(remarkMdx).use(remarkHeadingId);

async function collectHeadings(fileName) {
	const content = await fs.promises.readFile(fileName, 'utf8');

	const ast = parser.parse(content);
	const slugger = new Slugger();
	const headings = [];

	visit(ast, 'heading', (node) => {
		const id = slugger.slug(node.children.map((c) => c.value).join(''));
		headings.push(id);
	});

	return headings;
}

const headings = new Map(
	await Promise.all(
		[...englishFiles].map(async ([fileName, link]) => {
			const headings = await collectHeadings(fileName);
			return [link.shared, headings];
		})
	)
);

async function updateFile(fileName, headings) {
	let headingIndex = 0;

	const idsToSet = new Map();
	const translationMap = new Map();
	const slugger = new Slugger();

	const rgx = / \\?\{#([^\}]+)\}$/;

	const content = await fs.promises.readFile(fileName, 'utf8');
	const ms = new MagicString(content);
	visit(parser.parse(content), 'heading', (node) => {
		const heading = headings[headingIndex++];
		if (!heading) return;

		let headingContent = node.children.map((c) => c.value).join('');

		const match = headingContent.match(rgx);
		if (match) {
			headingContent = headingContent.slice(0, match.index);
		}

		const slug = slugger.slug(headingContent);
		translationMap.set(slug, heading);

		const idSuffix = fileName.endsWith('.mdx') ? ` \\{#${heading}\\}` : ` {#${heading}}`;

		const lastChild = node.children[node.children.length - 1];
		if (lastChild && lastChild.type === 'text') {
			const childMatch = lastChild.value.match(rgx);
			if (childMatch) {
				ms.overwrite(
					lastChild.position.start.offset + childMatch.index,
					lastChild.position.end.offset,
					idSuffix
				);
			} else {
				ms.appendRight(node.position.end.offset, idSuffix);
			}
		} else {
			ms.appendRight(node.position.end.offset, idSuffix);
		}

		idsToSet.set(node.position.start.line, heading);
	});

	if (ms.hasChanged()) {
		await fs.promises.writeFile(fileName, ms.toString());
	}

	return translationMap;
}

const translations = new Map(
	await Promise.all(
		[...translatedFiles].map(async ([fileName, link]) => {
			const newHeadings = headings.get(link.shared) || [];
			const translation = await updateFile(fileName, newHeadings);

			return [link.local, translation];
		})
	)
);

async function updateLinks(fileName, selfName) {
	const content = await fs.promises.readFile(fileName, 'utf8');
	const ms = new MagicString(content);
	visit(parser.parse(content), 'link', (node) => {
		if (!node.url.startsWith('/') && !node.url.startsWith('#')) return;

		const idStart = node.url.indexOf('#');
		if (idStart === -1) return;
		const pageName = node.url.slice(0, idStart) || selfName;

		const originalId = node.url.slice(idStart + 1);
		const newId = translations.get(pageName)?.get(originalId);
		if (!newId || newId === originalId) return;

		ms.overwrite(
			node.children.at(-1).position.end.offset + 3 + idStart,
			node.position.end.offset - 1,
			newId
		);
	});

	if (ms.hasChanged()) {
		await fs.promises.writeFile(fileName, ms.toString());
	}
}

await Promise.all(
	[...translatedFiles].map(async ([fileName, link]) => {
		await updateLinks(fileName, link.local);
	})
);

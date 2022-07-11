import glob from 'fast-glob';
import kleur from 'kleur';

/** 
 *  Ignore these slugs, usually because the page is deprecated in English
 *  and no longer needs to be maintained. 
 **/
const IGNORE_SLUGS = [
	// NOTE(fks, 07-11-2022): Migrated to "concepts/islands.md"
	'core-concepts/partial-hydration.md'
];

/** Makes sure that all translations’ slugs match the English slugs. */
class SlugChecker {
	async run() {
		const errors = await this.#findMismatchedSlugs();
		this.#outputResult(errors);
	}

	/** Load all Markdown pages and check non-English pages have counterparts in `pages/en/`. */
	async #findMismatchedSlugs() {
		const enSlugs = new Set(IGNORE_SLUGS);
		/** @type {Record<string, string[]>} */
		const errorMap = {};
		(await glob('./src/pages/**/*.md'))
			.map((file) => {
				const [, lang, slug] = file.replace('./src/pages/', '').match(/^([^/]+)\/(.+)$/);
				if (lang === 'en') enSlugs.add(slug);
				return [lang, slug];
			})
			.forEach(([lang, slug]) => {
				console.log(enSlugs);
				if (enSlugs.has(slug)) return;
				if (!errorMap[lang]) errorMap[lang] = [];
				errorMap[lang].push(slug);
			});
		return Object.entries(errorMap);
	}

	/**
	 * Print the result of the slug check to the console.
	 * @param {[lang: string, slugs: string[]][]} errors
	 */
	#outputResult(errors) {
		if (errors.length === 0) {
			console.log(kleur.green().bold(`\n*** Found no translations with mismatched slugs\n`));
			return;
		}
		const prefix = kleur.gray(`  [${kleur.red().bold(' ✖ ')}] `);
		let errorCount = 0;
		for (const [lang, slugs] of errors) {
			errorCount += slugs.length;
			const summary = [`\n/${lang}/`, ...slugs.map((slug) => prefix + slug)];
			console.error(summary.join('\n'));
		}
		console.error(kleur.red().bold(`\n*** Found ${errorCount} translations with mismatched slugs`));
		console.error('    Rename the files listed above to match English slugs\n');
		process.exit(1);
	}
}

const checker = new SlugChecker();
checker.run();

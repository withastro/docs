import generator from '@babel/generator';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { bcp47Normalize } from 'bcp-47-normalize';
import fs from 'fs';
import kleur from 'kleur';
import prettier from 'prettier';
import prompts from 'prompts';

// Logging utilities.
const skip = (...message) => console.log(kleur.gray().dim('•'), ...message.map(kleur.gray));
const done = (...message) => console.log(kleur.bold().green('✔︎'), ...message);

/**
 * Resolve a file path relative to this script.
 * @param {string} path
 */
const resolve = (path) => new URL(path, import.meta.url);

class LanguageScaffolder {
	/** Language tag (e.g. en, pt-BR, etc.) */
	#tag = '';
	/** Language name (e.g. English, Português do Brasil, etc.) */
	#name = '';
	/** Language writing direction (`'ltr' | 'rtl'`) */
	#dir = '';
	/** Track whether this instance has made any changes. */
	#dirty = false;

	async run() {
		try {
			await this.#collectInputs();
			this.#updateLanguagesList();
			this.#createDirectories();
			this.#createTranslationFileStubs();

			if (this.#dirty) {
				console.log(kleur.bold().green(`\nDone scaffolding i18n files for ${this.#name}!`));
				console.log('You can now edit the generated files and commit them.\n');
			} else {
				console.log(kleur.bold().gray(`\n${this.#name} was already set up. No changes made.\n`));
			}
		} catch (error) {
			console.error('\n' + kleur.bold().red().inverse(' ERROR '), error, '\n');
			process.exit(1);
		}
	}

	/** Check CLI arguments and prompt for language tag & name. */
	async #collectInputs() {
		const questions = [
			{
				type: 'text',
				name: 'tag',
				message: 'Language tag ' + kleur.reset('(e.g. en, pt-BR, etc.)'),
				validate: (tag) => {
					let warning = tag
						? 'Invalid language tag. Make sure it conforms to BCP 47 syntax.'
						: 'Language tag is required.';
					const normalized = bcp47Normalize(tag, {
						warning: (reason, code) => (warning = `Error ${code}: ${reason}`),
					});
					if (normalized) return true;
					return kleur.reset('[Press Enter to resubmit] ') + kleur.red().italic(warning);
				},
				format: (tag) => bcp47Normalize(tag)?.toLowerCase(),
			},
			{
				type: 'text',
				name: 'name',
				message: 'Language name ' + kleur.reset('(e.g. English, Português do Brasil, etc.)'),
				validate: (name) =>
					name
						? true
						: kleur.reset('[Press Enter to resubmit] ') +
						  kleur.red().italic('Please enter a language name.'),
				format: (value) => value.trim(),
			},
			{
				type: 'select',
				name: 'dir',
				message: 'Writing direction',
				choices: [
					{ title: 'Left-to-right', description: '(e.g. English, Russian, etc.)', value: 'ltr' },
					{ title: 'Right-to-left', description: '(e.g. Arabic, Hebrew, etc.)', value: 'rtl' },
				],
			},
			{
				type: 'confirm',
				name: 'confirm',
				message: (_, { tag, name }) =>
					`Scaffold i18n files for ${kleur.bold().underline(name)} (${kleur.bold(tag)})?`,
				initial: true,
			},
		];

		const { tag, name, dir, confirm } = await prompts(questions);
		console.log(); // Add newline after questions summary.

		this.#tag = tag;
		this.#name = name;
		this.#dir = dir;

		if (!confirm) process.exit(0);
	}

	/** Add the new language to `src/i18n/languages.ts` */
	#updateLanguagesList() {
		/** Parse file contents to an AST using Babel. */
		const stringToAST = (code) =>
			parser.parse(code, { sourceType: 'unambiguous', plugins: ['typescript'] });
		/** Compile an AST using Babel. */
		const astToString = (ast) => generator.default(ast).code;

		const languagesListPath = '../src/i18n/languages.ts';

		// Load and parse the current list of languages.
		const source = fs.readFileSync(resolve(languagesListPath), { encoding: 'utf-8' });
		const ast = stringToAST(source);

		let langAlreadyInList = false;

		traverse.default(ast, {
			// Handle the default export (which is the map of languages).
			ExportDefaultDeclaration: (path) => {
				const defaultExport = path.node.declaration;

				// We expect the languages list to be an object.
				if (!t.isObjectExpression(defaultExport)) {
					throw new Error(
						`Expected default export of ${languagesListPath} to be an object expression. Got ${defaultExport.type}`
					);
				}

				// Check if the language is already in the list.
				for (const prop of defaultExport.properties) {
					if (!t.isObjectProperty(prop)) continue;
					// Keys can be string literals OR identifiers because a language tag can contain a hyphen.
					const key = t.isStringLiteral(prop.key)
						? prop.key.value
						: t.isIdentifier(prop.key)
						? prop.key.name
						: undefined;
					if (key !== this.#tag) continue;

					langAlreadyInList = true;

					if (!t.isStringLiteral(prop.value)) {
						throw new Error(
							`Expected ${languagesListPath} to have a string literal value for property ${kleur.bold(
								key
							)}`
						);
					}

					// If the language is already in the list, use the existing name from now on.
					const { value } = prop.value;
					this.#name = value;
					skip(
						`Tag ${kleur.bold(key)} found in ${languagesListPath}, using existing name ${kleur.bold(
							value
						)}...`
					);
				}

				if (!langAlreadyInList) {
					// Add new language to the languages map.
					const newProperty = t.objectProperty(
						t.stringLiteral(this.#tag),
						t.stringLiteral(this.#name)
					);
					defaultExport.properties.push(newProperty);
				}
			},
			// Handle the set of RTL languages.
			ExportNamedDeclaration: (path) => {
				if (this.#dir !== 'rtl') return;

				const namedExport = path.node.declaration;
				if (!t.isVariableDeclaration(namedExport)) return;

				const declarator = namedExport.declarations[0];
				if (declarator.id.name !== 'rtlLanguages') return;

				const langArray = declarator.init.arguments[0];
				if (!t.isArrayExpression(langArray)) return;

				const langAlreadyInList = langArray.elements.some(({ value }) => value === this.#tag);
				if (!langAlreadyInList) langArray.elements.push(t.stringLiteral(this.#tag));
			},
		});

		if (!langAlreadyInList) {
			const newCode = LanguageScaffolder.format(astToString(ast), languagesListPath);
			fs.writeFileSync(resolve(languagesListPath), newCode, { encoding: 'utf-8' });
			done('Updated', kleur.bold(languagesListPath));
			this.#dirty = true;
		}
	}

	#createDirectories() {
		this.#mkdir(`../src/i18n/${this.#tag}`);
		this.#mkdir(`../src/content/docs/${this.#tag}`);
	}

	#createTranslationFileStubs() {
		for (const { getPath, getStub } of LanguageScaffolder.stubs) {
			this.#safeWrite(getPath(this.#tag, this.#name), getStub(this.#tag, this.#name));
		}
	}

	/** This project’s prettier config. */
	static prettierOpts = JSON.parse(
		fs.readFileSync(resolve('../.prettierrc'), { encoding: 'utf-8' })
	);

	/**
	 * Format a code string with this project’s Prettier config.
	 * @param {string} code Code to format
	 * @param {string} filepath Filepath of code (used by Prettier to decide which parser to use)
	 * @returns {string} Formatted code string
	 */
	static format = (code, filepath) =>
		prettier.format(code, { ...LanguageScaffolder.prettierOpts, filepath });

	/**
	 * Create a directory if it doesn’t exist.
	 * @param {string} path File path to create. Will be resolved relative to this script.
	 */
	#mkdir(path) {
		try {
			fs.mkdirSync(resolve(path));
		} catch (error) {
			if (error.code !== 'EEXIST') throw error;
		}
	}

	/**
	 * Write a file to disk, but only if it doesn’t already exist.
	 * @param {string} path File path to write to. Will be resolved relative to this script.
	 * @param {string} data File contents to write.
	 */
	#safeWrite(path, data) {
		const prettyPath = path.replace('../', '');
		try {
			const formatted = LanguageScaffolder.format(data, path);
			fs.writeFileSync(resolve(path), formatted, { encoding: 'utf-8', flag: 'wx' });
			done('Created', kleur.bold(prettyPath));
			this.#dirty = true;
		} catch (error) {
			if (error.code !== 'EEXIST') throw error;
			skip('Skipped', prettyPath, kleur.dim('(already exists)'));
		}
	}

	/**
	 * Content stubs for files created when running the scaffolder.
	 * @type {{ getPath: (tag: string, name: string) => string; getStub: (tag: string, name: string) => string; }[]}
	 */
	static stubs = [
		{
			getPath: (tag) => `../src/i18n/${tag}/ui.ts`,
			getStub: () => `import { UIDictionary } from '../translation-checkers';

	export default UIDictionary({
	});
	`,
		},
		{
			getPath: (tag) => `../src/i18n/${tag}/nav.ts`,
			getStub: () => `import { NavDictionary } from '../translation-checkers';

export default NavDictionary({
	startHere: 'START-HERE-TRANSLATION',
	'getting-started': 'GETTING-STARTED-TRANSLATION',
});
`,
		},
		{
			getPath: (tag) => `../src/i18n/${tag}/docsearch.ts`,
			getStub: () => `import { DocSearchDictionary } from '../translation-checkers';

export default DocSearchDictionary({
	button: 'SEARCH-TRANSLATION',
});
`,
		},
		{
			getPath: (tag) => `../src/content/docs/${tag}/getting-started.mdx`,
			getStub: () => `---
title: GETTING-STARTED-TITLE-TRANSLATION
description: DESCRIPTION-TRANSLATION
---

GETTING-STARTED-PAGE-TRANSLATION
`,
		},
	];
}

const scaffolder = new LanguageScaffolder();
scaffolder.run();

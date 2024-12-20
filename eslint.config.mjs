// @ts-check
import eslint from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['**/dist', '**/node_modules', '**/.astro', '**/.github', '**/.changeset'],
	},

	eslint.configs.recommended,
	...tseslint.configs.recommended,

	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tseslint.parser,
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
		},
		rules: {
			'no-mixed-spaces-and-tabs': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},

	// Allow triple-slash references in `*.d.ts` files.
	{
		files: ['**/*.d.ts'],
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off',
		},
	},

	// Astro
	...eslintPluginAstro.configs.recommended,

	// Set globals for Node scripts.
	{
		files: ['scripts/**'],
		languageOptions: {
			globals: globals.node,
		},
	}
);

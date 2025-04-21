import starlightLlmsTxt from 'starlight-llms-txt';

/** Starlight plugin that sets up `starlight-llms-txt` with configuration for the Astro docs. */
export const starlightPluginLlmsTxt = () =>
	starlightLlmsTxt({
		// Basic information about the docs and Astro to display in the main `llms.txt` entry file.
		projectName: 'Astro',
		description: 'Astro is an all-in-one web framework for building websites. ',
		details: [
			'- Astro uses island architecture and server-first design to reduce client-side JavaScript overhead and ship high performance websites.',
			'- Astro’s friendly content-focused features like content collections and built-in Markdown support make it an excellent choice for blogs, marketing, and e-commerce sites amongst others.',
			'- The `.astro` templating syntax provides powerful server rendering in a format that follows HTML standards and will feel very familiar to anyone who has used JSX.',
			'- Astro supports popular UI frameworks like React, Vue, Svelte, Preact, and Solid through official integrations.',
			'- Astro is powered by Vite, comes with a fast development server, bundles your JavaScript and CSS for you, and makes building websites feel fun.',
		].join('\n'),
		optionalLinks: [
			{
				label: 'The Astro blog',
				url: 'https://astro.build/blog/',
				description: 'the latest news about Astro development',
			},
		],

		// Create custom subsets of docs to break things up.
		customSets: [
			{
				label: 'API Reference',
				description: 'terse, structured descriptions of Astro’s APIs',
				paths: ['en/reference/**', 'en/guides/imports'],
			},
			{
				label: 'How-to Recipes',
				description: 'guided examples of adding features to an Astro project',
				paths: ['en/recipes/**'],
			},
			{
				label: 'Build a Blog Tutorial',
				description: 'a step-by-step guide to building a basic blog with Astro',
				paths: ['en/tutorial/**'],
			},
			{
				label: 'Deployment Guides',
				description: 'recipes for how to deploy an Astro website to different services',
				paths: ['en/guides/deploy/**'],
			},
			{
				label: 'CMS Guides',
				description:
					'recipes for how to use different content management systems in an Astro project',
				paths: ['en/guides/cms/**'],
			},
			{
				label: 'Backend Services',
				description:
					'advice on how to integrate backend services like Firebase, Sentry, and Supabase in an Astro project',
				paths: ['en/guides/migrate-to-astro/**'],
			},
			{
				label: 'Migration Guides',
				description: 'advice on how to migrate a project built with another tool to Astro',
				paths: ['en/guides/migrate-to-astro/**'],
			},
			{
				label: 'Additional Guides',
				description:
					'guides to e-commerce, authentication, testing, and digital asset management in Astro projects',
				paths: [
					'en/guides/ecommerce',
					'en/guides/authentication',
					'en/guides/testing',
					'en/guides/media/**',
				],
			},
		],

		// Control the order of pages in output files.
		promote: [
			'en/concepts/why-astro',
			'en/concepts/islands',
			'en/install-and-setup',
			'en/basics/project-structure',
			'en/develop-and-build',
			'en/guides/configuring-astro',
		],

		// Exclude pages from the abridged `llms-small.txt` file designed for smaller context windows.
		exclude: [
			// Landing page doesn’t really include any helpful content on its own, so it is excluded.
			'en/getting-started',
			// We can exclude this from the abridged docs as nonessential.
			'en/contribute',
			// Legacy flags and old upgrade guides also seem reasonable to exclude from the abridged docs.
			'en/reference/legacy-flags',
			'en/guides/upgrade-to/v{1..4}',

			// The following are all excluded because they are split out using `customSets`.

			// How-to Recipes
			'en/recipes/**',
			// Build a Blog Tutorial
			'en/tutorial/**',
			// API Reference
			'en/reference/**',
			'en/guides/imports',
			// Each of these categories is included in a dedicated custom set.
			'en/guides/backend/**',
			'en/guides/cms/**',
			'en/guides/deploy/**',
			'en/guides/migrate-to-astro/**',
			// Additional Guides
			'en/guides/ecommerce',
			'en/guides/authentication',
			'en/guides/testing',
			'en/guides/media/**',
		],
	});

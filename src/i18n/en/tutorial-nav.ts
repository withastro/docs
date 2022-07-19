/**
 * This configures the navigation items for the tutorial.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Introduction', header: true, type: 'tutorial', key: 'tut/0' },
	{ text: 'Introduction', slug: 'tutorial/0-introduction', key: 'tut/0/0' },
	{ text: 'Background Knowledge', slug: 'tutorial/0-introduction/1', key: 'tut/0/1' },

	{ text: 'Setup', header: true, type: 'tutorial', key: 'tut/1' },
	{ text: 'Overview', slug: 'tutorial/1-setup', key: 'tut/1/0' },
	{ text: 'Create a new project', slug: 'tutorial/1-setup/1', key: 'tut/1/1' },
	{ text: 'Connect to GitHub / Netlify', slug: 'tutorial/1-setup/2', key: 'tut/1/2' },

	{ text: 'Astro Pages', header: true, type: 'tutorial', key: 'tut/2' },
	{ text: 'Overview', slug: 'tutorial/2-astro-pages', key: 'tut/2/0' },
	{ text: 'About Page', slug: 'tutorial/2-astro-pages/1', key: 'tut/2/1' },
	{ text: 'Astro Script', slug: 'tutorial/2-astro-pages/2', key: 'tut/2/2' },
	{ text: 'Astro Script 2', slug: 'tutorial/2-astro-pages/3', key: 'tut/2/3' },
	{ text: 'Astro Style Tag', slug: 'tutorial/2-astro-pages/4', key: 'tut/2/4' },

	{ text: 'Astro Components', header: true, type: 'tutorial', key: 'tut/3' },
	{ text: 'Overview', slug: 'tutorial/3-components', key: 'tut/3/0' },
	{ text: 'Navigation Component', slug: 'tutorial/3-components/1', key: 'tut/3/1' },
	{ text: 'Component Props', slug: 'tutorial/3-components/2', key: 'tut/3/2' },
	{ text: 'Layout Component', slug: 'tutorial/3-components/3', key: 'tut/3/3' },

	{ text: 'Markdown Blog Posts', header: true, type: 'tutorial', key: 'tut/4' },
	{ text: 'Overview', slug: 'tutorial/4-markdown', key: 'tut/4/0' },
	{ text: 'Create a Blog Post', slug: 'tutorial/4-markdown/1', key: 'tut/4/1' },
	{ text: 'Using Markdown Frontmatter', slug: 'tutorial/4-markdown/2', key: 'tut/4/2' },
	{ text: 'Adding Blog Pages', slug: 'tutorial/4-markdown/3', key: 'tut/4/3' },

	{ text: 'Using the API', header: true, type: 'tutorial', key: 'tut/5' },
	{ text: 'Overview', slug: 'tutorial/5-astro-api', key: 'tut/5/0' },
	{ text: 'Using Astro.glob()', slug: 'tutorial/5-astro-api/1', key: 'tut/5/1' },
	{ text: 'Dynamic Routing', slug: 'tutorial/5-astro-api/2', key: 'tut/5/2' },
	{ text: 'Tag Index Page', slug: 'tutorial/5-astro-api/3', key: 'tut/5/3' },
	{ text: 'RSS Feed', slug: 'tutorial/5-astro-api/4', key: 'tut/5/4' },

	{ text: 'Interactivity', header: true, type: 'tutorial', key: 'tut/6' },
	{ text: 'Overview', slug: 'tutorial/6-interactivity', key: 'tut/6/0' },
	{ text: 'Theme Toggle', slug: 'tutorial/6-interactivity/1', key: 'tut/6/1' },
	{ text: 'Responsive Nav', slug: 'tutorial/6-interactivity/2', key: 'tut/6/2' },
	{ text: 'UI Frameworks', slug: 'tutorial/6-interactivity/3', key: 'tut/6/3' },
] as const;

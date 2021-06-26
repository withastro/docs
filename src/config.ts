export const sidebar = [
  {
    text: 'Start Here',
    link: '',
    children: [
      { text: 'Installation', link: 'installation' },
      { text: 'Quickstart', link: 'quick-start' },
      { text: 'Examples', link: 'examples' },
    ],
  },
  {
    text: 'Core Concepts',
    link: 'core-concepts',
    children: [
      { text: 'Project Structure', link: 'core-concepts/project-structure' },
      { text: 'Astro Pages', link: 'core-concepts/astro-pages' },
      { text: 'Astro Components', link: 'core-concepts/astro-components' },
      {
        text: 'Frontend Components',
        link: 'core-concepts/frontend-components',
      },
      {
        text: 'Component Hydration',
        link: 'core-concepts/component-hydration',
      },
      { text: 'Layouts', link: 'core-concepts/layouts' },
      { text: 'Styling', link: 'core-concepts/styling' },
      { text: 'Markdown Content', link: 'core-concepts/markdown-content' },
      { text: 'Data Fetching', link: 'core-concepts/data-fetching' },
      // To be written when https://github.com/snowpackjs/astro/issues/501 is completed
      // { text: 'Pagination', link: 'core-concepts/pagination' },
      { text: 'Collections', link: 'core-concepts/collections' },
      { text: 'Imports', link: 'core-concepts/imports' },
      { text: 'UI Renderers', link: 'core-concepts/ui-renderers' },
      { text: 'Build & Deploy', link: 'core-concepts/build-and-deploy' },
      { text: 'Publish to NPM', link: 'core-concepts/publish-to-npm' },
    ],
  },
  {
    text: 'Reference',
    link: 'reference',
    children: [
      { text: 'API Reference', link: 'reference/api-reference' },
      { text: 'CLI Reference', link: 'reference/cli-reference' },
      {
        text: 'Configuration Reference',
        link: 'reference/configuration-reference',
      },
    ],
  },
  // To add once rest of the site is complete
  // see https://github.com/snowpackjs/astro-docs/issues/9
  // {
  //   text: 'Integrations',
  //   link: 'integrations',
  //   children: [
  //     { text: 'Deploy Astro', link: 'integrations/deploy-astro' },
  //     { text: 'Data Sources / CMS', link: 'integrations/data-sources-cms' },
  //     { text: 'State Management', link: 'integrations/state-management' },
  //     {
  //       text: 'Styles & CSS Libraries',
  //       link: 'integrations/styles-and-css-libraries',
  //     },
  //     { text: 'Developer Tools', link: 'integrations/developer-tools' },
  //   ],
  // },
];

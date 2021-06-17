export const sidebar = [
  {
    text: 'Start Here',
    link: '',
    children: [
      { text: 'What is Astro?', link: 'what-is-astro' },
      { text: 'Installation', link: 'installation' },
      { text: 'Quickstart', link: 'quickstart' },
      { text: 'Examples', link: 'examples' },
    ],
  },
  {
    text: 'Basic Concepts',
    link: 'basic-concepts',
    children: [
      { text: 'Project Structure', link: 'basic-concepts/project-structure' },
      { text: 'Astro Pages', link: 'basic-concepts/astro-pages' },
      { text: 'Astro Components', link: 'basic-concepts/astro-components' },
      {
        text: 'Frontend Components',
        link: 'basic-concepts/frontend-components',
      },
      {
        text: 'Component Hydration',
        link: 'basic-concepts/component-hydration',
      },
      { text: 'Layouts', link: 'basic-concepts/layouts' },
      { text: 'Styling', link: 'basic-concepts/styling' },
      { text: 'Content (Markdown)', link: 'basic-concepts/content-markdown' },
      { text: 'Data Fetching', link: 'basic-concepts/data-fetching' },
      { text: 'Pagination', link: 'basic-concepts/pagination' },
      { text: 'Collections', link: 'basic-concepts/collections' },
      { text: 'Build & Deploy', link: 'basic-concepts/build-and-deploy' },
    ],
  },
  {
    text: 'Reference',
    link: 'reference',
    children: [
      { text: 'Api Reference', link: 'reference/api-reference' },
      {
        text: 'Configuration Reference',
        link: 'reference/configuration-reference',
      },
    ],
  },
  {
    text: 'Integrations',
    link: 'integrations',
    children: [
      { text: 'Deploy Astro', link: 'integrations/deploy-astro' },
      { text: 'Data Sources / CMS', link: 'integrations/data-sources-cms' },
      { text: 'State Management', link: 'integrations/state-management' },
      {
        text: 'Styles & CSS Libraries',
        link: 'integrations/styles-and-css-libraries',
      },
      { text: 'Developer Tools', link: 'integrations/developer-tools' },
    ],
  },
];

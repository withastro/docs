export const sidebar = [
  {
    text: 'Welcome to Astro',
    link: '',
    children: [
      { text: 'Why Astro?', link: 'why-astro' },
      { text: 'Island Architecture', link: 'island-architecture' },
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
    text: 'APIs',
    link: 'apis',
    children: [
      { text: 'Collection', link: 'apis/collection' },
      { text: 'Fetch-content', link: 'apis/fetch-content' },
      { text: 'Request', link: 'apis/request' },
      { text: 'Site', link: 'apis/site' },
    ],
  },
  {
    text: 'Deployment',
    link: 'deployment',
    children: [
      { text: 'Netlify', link: 'deployment/netlify' },
      { text: 'Github Pages', link: 'deployment/github-pages' },
      { text: 'Gitlab Pages', link: 'deployment/gitlab-pages' },
      { text: 'SSH', link: 'deployment/ssh' },
      { text: 'Vercel', link: 'deployment/vercel' },
      { text: 'AWS', link: 'deployment/aws' },
    ],
  },
  {
    text: 'Integrations',
    link: 'integrations',
    children: [{ text: 'Strapi', link: 'integrations/strapi' }],
  },
  {
    text: 'Tooling',
    link: 'tooling',
    children: [
      { text: 'VS-Code Extension', link: 'tooling/vs-code-extension' },
      { text: 'Prettier', link: 'tooling/prettier' },
      { text: 'DevTools', link: 'tooling/devtools' },
    ],
  },
  {
    text: 'Extending',
    link: 'extending',
    children: [
      {
        text: 'Adding Framework / Renderer',
        link: 'extending/framework-renderer',
      },
      { text: 'Adding plugins', link: 'extending/plugins' },
    ],
  },
];

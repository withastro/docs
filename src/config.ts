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
    text: 'Core Concepts',
    link: 'core-concepts',
    children: [
      { text: 'Project Structure', link: 'core-concepts/project-structure' },
      { text: 'Configuration', link: 'core-concepts/configuration' },
      { text: 'Pages', link: 'core-concepts/pages' },
      { text: 'Components', link: 'core-concepts/components' },
      { text: 'Static files', link: 'core-concepts/static-files' },
      { text: 'Templating', link: 'core-concepts/templating' },
      { text: 'Routing', link: 'core-concepts/routing' },
      { text: 'State Management', link: 'core-concepts/state-management' },
      { text: 'Styling', link: 'core-concepts/styling' },
      { text: 'Data / Content', link: 'core-concepts/data-content' },
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

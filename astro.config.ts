import { tokens } from './syntax-highlighting-theme';
import type { AstroMarkdownOptions } from '@astrojs/markdown-remark';
import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  buildOptions: {
    site: 'https://docs.astro.build/'
  },
  markdownOptions: {
    render: ['@astrojs/markdown-remark', ({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: {
          name: 'Star gazer',
          type: 'dark',
          settings: tokens
        }
      }
    } as AstroMarkdownOptions)]
  },
  integrations: [preact(), react()]
});
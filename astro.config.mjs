// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Until the custom domain is set up the site lives at bemesko.github.io/portfolio.
// Switch by setting the SITE_URL and BASE_PATH repository variables (see README).
const site = process.env.SITE_URL || 'https://bemesko.github.io';
const base = process.env.BASE_PATH || '/portfolio';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});

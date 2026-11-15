// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Until a custom domain is set up the site lives at the user site, bemesko.github.io.
// Switch by setting the SITE_URL and BASE_PATH repository variables (see README).
const site = process.env.SITE_URL || 'https://bemesko.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});

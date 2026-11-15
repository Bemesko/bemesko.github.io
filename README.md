# ~/captain-devops

Personal portfolio of Bernardo Mesko. Static site built with [Astro](https://astro.build), deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321/ (drafts visible)
npm run build     # astro check + static build into dist/ (drafts excluded)
npm run preview   # serve dist/
```

Requires Node 22.12+ (`.nvmrc` pins 24).

## Structure

| Path                         | What                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `src/site.ts`                | Name, brand, contact links, active type pairing                                               |
| `src/styles/tokens.css`      | Palette (paper, ink, cobalt, depth bands) and layout tokens                                   |
| `src/styles/fonts.css`       | Active font pairing                                                                           |
| `src/components/`            | `DepthGauge`, `DepthZone`, `Contours`, `LayeredDiagram`, `YamlCard`, `StarGrid`, `ProjectRow` |
| `src/content/projects/*.mdx` | Case studies. `draft: true` = visible only in dev                                             |
| `src/data/diagrams.ts`       | Layered diagrams referenced by a project's `diagram` field                                    |
| `src/data/toolbox.ts`        | Tools shown on /toolbox and how often each one is used                                        |
| `src/pages/`                 | Home, toolbox, about, case study route, 404                                                   |

### Adding a case study

Create `src/content/projects/<slug>.mdx` with the frontmatter described in `src/content.config.ts`. Set `featured: true` on the one shown on the home page. Search for `TODO` to find copy that still needs real content.

### Fonts

The site uses the "Technical chart" pairing (Space Grotesk + Source Serif 4 + JetBrains Mono). Fonts are self-hosted through `@fontsource` packages; the variables live in `src/styles/fonts/chart.css`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which refreshes the blog posts, type-checks, builds and publishes to GitHub Pages. It also runs daily so new posts show up without a push.

### Scripts

- `npm run posts` refreshes `src/data/posts.json` from the Substack feed: directly first, then through rss2json.com (Substack answers 403 to CI runners). If both fail it keeps the committed file. The list is also published at `/posts.json` for the GitHub profile README.
- `python scripts/make-og.py . <work-dir> public/og.png` renders the social share card.
- `python scripts/make-substack-kit.py <work-dir>` renders the Substack brand kit in `docs/brand/substack/`.

The Python scripts need Pillow and fontTools with brotli, and read the fonts from `node_modules`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

This repo is the GitHub user site (`bemesko.github.io`), so without extra configuration it is published at the root, `https://bemesko.github.io/`.

## Custom domain

1. Add `public/CNAME` containing just the domain (e.g. `example.com`).
2. Set the repository variable `SITE_URL` = `https://example.com` (Settings → Secrets and variables → Actions → Variables). The base path is already `/`.
3. DNS at your registrar:
   - Subdomain (`www.example.com`): `CNAME` → `bemesko.github.io`
   - Apex (`example.com`): `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
4. Recommended: verify the domain under your GitHub account's **Settings → Pages** to prevent takeover.
5. In the repo's **Settings → Pages**, set the custom domain, wait for the certificate, then tick **Enforce HTTPS**.
6. Push (or re-run the workflow) so the build picks up the new `SITE_URL`.

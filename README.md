# ~/captain-devops

Personal portfolio of Bernardo Mesko. Static site built with [Astro](https://astro.build), deployed to GitHub Pages.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321/portfolio/ (drafts visible)
npm run build     # astro check + static build into dist/ (drafts excluded)
npm run preview   # serve dist/
```

Requires Node 22.12+ (`.nvmrc` pins 24).

## Structure

| Path                         | What                                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `src/site.ts`                | Name, brand, contact links, active type pairing                                               |
| `src/styles/tokens.css`      | Palette (paper, ink, cobalt, depth bands) and layout tokens                                   |
| `src/styles/fonts.css`       | Active font pairing (`fonts/editorial.css`, `chart.css`, `plex.css`)                          |
| `src/components/`            | `DepthGauge`, `DepthZone`, `Contours`, `LayeredDiagram`, `YamlCard`, `StarGrid`, `ProjectRow` |
| `src/content/projects/*.mdx` | Case studies. `draft: true` = visible only in dev                                             |
| `src/data/diagrams.ts`       | Layered diagrams referenced by a project's `diagram` field                                    |
| `src/pages/`                 | Home, about, case study route, 404, type specimen                                             |

### Adding a case study

Create `src/content/projects/<slug>.mdx` with the frontmatter described in `src/content.config.ts`. Set `featured: true` on the one shown on the home page. Search for `TODO` to find copy that still needs real content.

### Changing fonts

Compare pairings at `/type-specimen`. To switch, change the import in `src/styles/fonts.css` and `typePairing` in `src/site.ts`. After choosing, delete `src/pages/type-specimen.astro` and the unused pairing files and font packages.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which type-checks, builds and publishes to GitHub Pages.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Without extra configuration the site is published at `https://bemesko.github.io/portfolio/`.

## Custom domain

1. Add `public/CNAME` containing just the domain (e.g. `example.com`).
2. Set the repository variables (Settings → Secrets and variables → Actions → Variables):
   - `SITE_URL` = `https://example.com`
   - `BASE_PATH` = `/`
3. DNS at your registrar:
   - Subdomain (`www.example.com`): `CNAME` → `bemesko.github.io`
   - Apex (`example.com`): `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
4. Recommended: verify the domain under your GitHub account's **Settings → Pages** to prevent takeover.
5. In the repo's **Settings → Pages**, set the custom domain, wait for the certificate, then tick **Enforce HTTPS**.
6. Push (or re-run the workflow) so the build picks up the new `SITE_URL`/`BASE_PATH`.

# noomesh.github.io

Landing pages for [noomesh.ai](https://noomesh.ai), served via GitHub Pages.

| Path | What |
|------|------|
| `index.html` | **Live now.** Pre-launch teaser — name, one line, "launching soon". |
| `launch.html` | **Staged, not launched.** The full landing page for go-live. `noindex` + disallowed in `robots.txt`. |
| `assets/site.css` | Shared Slate palette and primitives, lifted from `@metis/tokens` in `pai-mesh-ui` so the site matches the console. |
| `assets/mesh.js` | The animated node-link field both pages share. |
| `CNAME` | Custom domain binding (**do not delete**). |
| `robots.txt`, `sitemap.xml` | Crawl control. |

No build step — plain HTML/CSS/JS, self-contained. **Deploys automatically on
push to `main`**, so treat `main` as production.

DNS is managed in Azure DNS (`noomesh-dns-rg` resource group, `personifai-dns`
subscription).

## Going live

When the launch page becomes the front door:

1. `git mv launch.html index.html` (replacing the teaser).
2. Delete the `<meta name="robots" content="noindex, nofollow">` line from it.
3. Delete the `Disallow: /launch.html` line from `robots.txt`.
4. Re-check the copy — see "Copy is unverified" below.

## Copy is unverified

The launch page describes the product from what the code does, not from an
agreed positioning document. Before it goes live, someone who knows the
roadmap should confirm every claim on it — particularly the open-core section
(what exactly is open, under which licence) and the CLI shown in the terminal
block, which is **illustrative** and does not match a shipped command surface.

## Local preview

```bash
python -m http.server 4321      # then open http://localhost:4321/
```

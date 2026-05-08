# Deploy

Localingo deploys as a GitHub Pages static site.

Live URL:
https://baditaflorin.github.io/localingo/

Repository:
https://github.com/baditaflorin/localingo

## Publishing Strategy

- Branch: `main`
- Folder: `/docs`
- Vite base path: `/localingo/`
- SPA fallback: `docs/404.html`
- Build metadata: `docs/version.json`

GitHub Pages is configured through the repository Pages settings and serves from `main` `/docs`.

## Publish

```bash
npm install
make lint
make test
make smoke
git push
```

`make build` writes the Pages-ready app into `docs/`.

## Manual Preview

```bash
make build
make pages-preview
```

Preview URL:
http://127.0.0.1:4173/localingo/

## Rollback

Revert the publishing commit and push:

```bash
git revert <commit_sha>
git push
```

GitHub Pages will serve the reverted `docs/` contents.

## Custom Domain

No custom domain is configured in v0.1.0.

If a domain is added later:

1. Add `docs/CNAME`.
2. Point DNS to GitHub Pages according to GitHub documentation.
3. Rebuild and push.

GitHub Pages documentation:
https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Pages Gotchas

- `_headers` and `_redirects` are not supported.
- SPA fallback is handled by `404.html`.
- Service worker scope must remain under `/localingo/`.
- Generated assets are hashed under `docs/assets/`.

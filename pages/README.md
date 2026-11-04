# One repository for Lovable and GitHub Pages

The app, artwork and six-slide pitch remain in `src/`. Lovable keeps using the
existing TanStack Start configuration. The additional static build reuses those
routes with a browser-only root and hash routing, so GitHub Pages requires no
server or rewrite rules. Guest orders and gift activity remain browser-local.

## Build and export

```sh
npm install
npm --prefix pages install
npx vite build --config pages/vite.config.ts
node pages/export.mjs
```

The workflow runs the existing tests, builds the static app, checks every public
route, and exports the pitch as six 3840x2160 PNGs and one six-page PDF. It saves
`exports/amortentia-post-png-pdf.zip` on the same branch and includes it in the
deployable site. Source files and backend configuration are never published in
the Pages artifact.

## Publishing

In this repository's **Settings > Pages**, choose **GitHub Actions** as the source.
Private repositories require a GitHub plan that supports Pages. Keep the repository
private unless you independently choose to make the source public.

Set the repository Actions variable `PUBLISH_GITHUB_PAGES` to `true` to enable
the deployment job after configuring Pages. The workflow still builds and saves
exports when that variable is absent. Each subsequent source update rebuilds the
app and slides together.

The app URL will end in `/amortentia-post-0764d734/#/`; slides use
`/amortentia-post-0764d734/#/pitch?slide=1`. The existing Demo repository can stay
in place until this deployment is verified.

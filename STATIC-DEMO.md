# Self-contained Amortentia Post demo

The demo runs entirely in the visitor's browser. It does not require a Lovable subscription, a database, server functions, authentication, payment services, or an API key.

- Built-in fictional confessions and photos are bundled with the app.
- New confessions, profile changes, sent/received gifts, and swoons are stored on that browser.
- Recipient links include the gift contents. Anyone with a link can see that gift.
- Opening and bite activity does not synchronize between devices.
- Delivery progress is simulated from each order's timestamp.
- Fonts and images are included in the build.

## Build

Use Node.js 22 or later:

```sh
npm ci
npm test
npm run build:demo
node scripts/check-demo.mjs
```

Publish only the contents of `dist-demo/` to a public, build-only GitHub repository. Do not copy `.env`, source history, dependencies, or account settings. Enable GitHub Pages for that repository using the `main` branch and `/ (root)` folder.

Routes use hash URLs (for example `/#/spellbook`), so refreshing or opening a gift link works under a GitHub Pages project subdirectory without server rewrites.

The original full-stack build configuration remains available separately. The static entry point is `src/demo-entry.tsx`, using `vite.demo.config.ts`.

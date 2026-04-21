# Deployment Options

> English version: [deploy-options.en.md](./deploy-options.en.md)。

This project is a static Vite build (`npm run build` → `dist/`). Any static-site host works. Below are the easiest paths for anyone forking this repo.

> 想在自家 VPS 搭配 Nginx + GitHub Actions 部署？請參考 [deployment.md](./deployment.md)（較進階）。

## Quick Comparison

| Option | Cost | Custom domain | Setup effort | CI/CD |
|--------|------|---------------|--------------|-------|
| **Vercel** | Free tier | ✅ | ★☆☆☆☆ | Auto on push |
| **Netlify** | Free tier | ✅ | ★☆☆☆☆ | Auto on push |
| **Cloudflare Pages** | Free | ✅ (free SSL) | ★★☆☆☆ | Auto on push |
| **GitHub Pages** | Free (public repo) | ✅ | ★★★☆☆ (needs `VITE_BASE`) | Manual or GH Action |

Recommendation: **Vercel** or **Netlify** for the smoothest first-time experience. **Cloudflare Pages** if you want a free global CDN with your own domain. **GitHub Pages** if you prefer keeping everything inside GitHub.

---

## Option 1 — Vercel (Recommended)

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account
2. Click **Add New → Project**, import your fork
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. (Optional) Add env vars: `VITE_GA_ID`, `VITE_FORMSPREE_ID`
7. Click **Deploy**

Vercel deploys automatically on every push to `master`. Preview deployments are created for each PR.

Custom domain: Project Settings → Domains → add your domain and follow the DNS instructions.

---

## Option 2 — Netlify

1. Sign in at [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import from Git**, choose your fork
3. Build command: `npm run build`
4. Publish directory: `dist`
5. (Optional) Add env vars under Site settings → Environment variables
6. Click **Deploy site**

SPA fallback: add `public/_redirects` with `/*  /index.html  200` (only needed if you add client-side routes later — this project currently uses a single-page layout).

---

## Option 3 — Cloudflare Pages

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
2. **Create → Pages → Connect to Git**, select your fork
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Build output directory: `dist`
6. (Optional) Environment variables → add `VITE_GA_ID`, `VITE_FORMSPREE_ID`
7. **Save and deploy**

Custom domain (free SSL): Custom domains → add your domain → Cloudflare handles DNS + certificate automatically.

---

## Option 4 — GitHub Pages

GitHub Pages serves the site from a subpath like `https://<user>.github.io/<repo>/`, so the build needs the correct `VITE_BASE`.

**Steps:**

1. Repo → **Settings → Pages** → Source: `GitHub Actions`
2. Create `.github/workflows/pages.yml`:

   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [master]
     workflow_dispatch:

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         - run: npm ci
         - run: npm run build
           env:
             VITE_BASE: /${{ github.event.repository.name }}/
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

3. Push to `master` — the workflow builds and publishes automatically
4. Site will be live at `https://<user>.github.io/<repo>/`

> For env vars (`VITE_GA_ID`, `VITE_FORMSPREE_ID`), add them as Actions secrets and expose them in the `Build` step.

---

## Choosing

- Just want it up fast → **Vercel**
- Prefer Netlify's ecosystem → **Netlify**
- Want Cloudflare's CDN / free SSL on a custom domain → **Cloudflare Pages**
- Prefer staying inside GitHub → **GitHub Pages**
- Own VPS / full control → see [deployment.md](./deployment.md)

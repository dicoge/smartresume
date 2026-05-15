# SmartResume Full Optimization Plan

> **For Hermes:** Use subagent-driven-development to implement this plan phase by phase.

**Goal:** Transform SmartResume (dicoge.com) from a functional portfolio into a polished, performant, PWA-capable personal brand showcase with SEO, testing, and modern UX.

**Architecture:** Vue 3 SPA with 7 sections (Hero → About → Projects → TechStack → Stats → Contact → Footer). Optimize incrementally: fix critical issues first, then add polish.

**Tech Stack:** Vue 3.5 + Vite 6 + TypeScript 5.7 + Tailwind 3.4 + vue-i18n 10

**Project Root:** `/mnt/c/Users/dicoge/smartresume/`
**Live URL:** https://dicoge.com

---

## Phase Order (Priority)

| Priority | Phase | Est. Time | Worker |
|----------|-------|-----------|--------|
| P0 | ⓪ Infrastructure Setup | 30min | Claude Code |
| P0 | ① Performance & PWA | 2h | Claude Code |
| P0 | ② SEO & Structured Data | 1.5h | Claude Code |
| P1 | ③ UI/UX Enhancements | 2.5h | Claude Code |
| P1 | ④ Contact Form (Formspree) | 1h | Claude Code |
| P2 | ⑤ Architecture Refactoring | 2h | Codex → Claude Code |
| P2 | ⑥ Testing | 2h | OpenCode |
| P3 | ⑦ Multi-personality QA | 1h | OpenClaw+184 |

---

## Phase 0: Infrastructure Setup

### Task 0.1: Install dev dependencies

**Objective:** Add Vitest, Playwright, and PWA plugin to the project.

**Files:** Modify: `package.json`

**Step 1:** Install dependencies
```bash
cd /mnt/c/Users/dicoge/smartresume
npm install -D vitest @vue/test-utils happy-dom
npm install -D @playwright/test
npm install vite-plugin-pwa
```

**Step 2:** Add test scripts to package.json
```json
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "playwright test",
  "postinstall": "npx playwright install chromium"
```

**Step 3:** Verify install
```bash
npm ls vitest @vue/test-utils vite-plugin-pwa
```

---

## Phase 1: Performance & PWA

### Task 1.1: Add vite-plugin-pwa configuration

**Objective:** Enable PWA with service worker, manifest, offline support.

**Files:**
- Modify: `vite.config.ts`

**Step 1:** Replace vite.config.ts content
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

const buildSha = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim() }
  catch { return 'dev' }
})()
const buildTime = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg', 'og-image.png'],
      manifest: {
        name: '石少斌 Shih Shao Pin - 全端工程師',
        short_name: '石少斌 Portfolio',
        description: '4年Unity/全端工程師，專精遊戲開發與現代化Web技術',
        theme_color: '#264653',
        background_color: '#fef9f4',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'zh-TW',
        start_url: '/',
        icons: [
          { src: '/vite.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/og-image.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
})
```

### Task 1.2: Add preconnect and preload hints to index.html

**Objective:** Speed up font loading and critical resources.

**Files:** Modify: `index.html`

**Step 1:** Add preconnect hints before Google Fonts link
```html
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
```

**Step 2:** Add preload for hero-critical assets
```html
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap">
```

**Step 3:** Add theme-color meta for PWA
```html
    <meta name="theme-color" content="#264653">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="石少斌 Portfolio">
```

### Task 1.3: Font optimization — subset and swap

**Objective:** Ensure fonts don't block rendering. Add `font-display: swap` via CSS.

**Files:** Modify: `index.html`

**Step 1:** Add `&display=swap` to Google Fonts URL
```
Current: &display=swap
Already present ✓
```

**Step 2:** Add CSS font-display strategy in style.css
```css
@layer base {
  /* Font preload already handled by Google Fonts link with display=swap */
}
```
(Already handled by the existing link — just verify.)

### Task 1.4: Add robots.txt

**Objective:** Allow search engine crawling.

**Files:** Create: `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://dicoge.com/sitemap.xml
```

### Task 1.5: Add sitemap.xml generation

**Objective:** Improve SEO indexing.

**Files:** Create: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dicoge.com/</loc>
    <lastmod>2026-05-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Task 1.6: Lazy-load below-fold sections

**Objective:** Improve LCP (Largest Contentful Paint) by deferring non-critical components.

**Files:**
- Modify: `src/App.vue`

**Step 1:** Use Vue `defineAsyncComponent` for below-fold sections
```ts
import { defineAsyncComponent } from 'vue'

// Above the fold — eager load
import TheHeader from './components/layout/TheHeader.vue'
import HeroSection from './components/sections/HeroSection.vue'

// Below the fold — lazy load
const AboutSection = defineAsyncComponent(() => import('./components/sections/AboutSection.vue'))
const ProjectsSection = defineAsyncComponent(() => import('./components/sections/ProjectsSection.vue'))
const TechStackSection = defineAsyncComponent(() => import('./components/sections/TechStackSection.vue'))
const StatsSection = defineAsyncComponent(() => import('./components/sections/StatsSection.vue'))
const ContactSection = defineAsyncComponent(() => import('./components/sections/ContactSection.vue'))
const TheFooter = defineAsyncComponent(() => import('./components/layout/TheFooter.vue'))
```

---

## Phase 2: SEO & Structured Data

### Task 2.1: Add JSON-LD structured data

**Objective:** Help Google understand the page content and show rich results.

**Files:** Modify: `index.html`

**Step 1:** Add Person/WebSite JSON-LD before `</head>`
```html
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "石少斌",
      "alternateName": "Shih Shao Pin",
      "givenName": "Shao Pin",
      "familyName": "Shih",
      "email": "kin169999@gmail.com",
      "url": "https://dicoge.com/",
      "image": "https://dicoge.com/og-image.png",
      "jobTitle": "Senior Engineer",
      "worksFor": {
        "@type": "Organization",
        "name": "鈊象電子"
      },
      "knowsAbout": ["Unity", "Vue.js", "Node.js", "TypeScript", "Game Development"],
      "sameAs": [
        "https://github.com/dicoge"
      ]
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "石少斌 Shih Shao Pin - 全端工程師",
      "url": "https://dicoge.com/",
      "description": "4年Unity/全端工程師，專精遊戲開發與現代化Web技術",
      "author": {
        "@type": "Person",
        "name": "石少斌"
      }
    }
    </script>
```

### Task 2.2: Enhance meta tags with hreflang

**Objective:** Support bilingual content in search results.

**Files:** Modify: `index.html`

**Step 1:** Add hreflang alternates
```html
    <link rel="alternate" href="https://dicoge.com/" hreflang="zh-TW" />
    <link rel="alternate" href="https://dicoge.com/?lang=en" hreflang="en" />
    <link rel="alternate" href="https://dicoge.com/" hreflang="x-default" />
```

### Task 2.3: Verify Lighthouse baseline

**Objective:** Measure before/after improvements.

**Step 1:** Run a local audit
```bash
cd /mnt/c/Users/dicoge/smartresume
npx lighthouse https://dicoge.com --output=json --output-path=./lighthouse-baseline.json --chrome-flags="--headless"
```

---

## Phase 3: UI/UX Enhancements

### Task 3.1: Mobile responsiveness audit

**Objective:** Ensure all sections look great on mobile (320px+).

**Files:** Modify: All section `.vue` files

**Key fixes needed:**
- Hero: text scaling for very small screens
- Projects: 3-col grid → 1-col on mobile (already has responsive classes, verify)
- TechStack: 4-col → 2-col → 1-col responsive cascade
- Stats: 4-col → 2-col on mobile

**Step 1:** Review current grid classes
```html
Projects grid: class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
→ Already correct ✓

TechStack grid: class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
→ Change to: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
→ Smaller gap on mobile ✓

Stats grid: class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
→ Already correct ✓
```

### Task 3.2: Project card hover effects

**Objective:** Add subtle hover animations on project cards.

**Files:** Modify: `src/components/ui/ProjectCard.vue`

**Step 1:** Add hover transform and shadow
```html
<div class="bg-white dark:bg-dark-card rounded-2xl p-6 border border-primary-100 dark:border-dark-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 dark:hover:shadow-dark-border/20">
```

**Step 2:** Add tag hover color change
```css
/* In style section */
.project-tag:hover {
  @apply bg-primary-500 text-white border-primary-500;
}
```

### Task 3.3: Smooth scroll navigation highlight

**Objective:** Active nav item highlights based on current scroll position.

**Files:** Create: `src/composables/useActiveSection.ts`
Modify: `src/components/layout/TheHeader.vue`

**Step 1:** Create composable
```ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useActiveSection(sectionIds: string[]) {
  const activeSection = ref('')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer?.observe(el)
    })
  })

  onUnmounted(() => observer?.disconnect())

  return { activeSection }
}
```

**Step 2:** Update TheHeader to highlight active nav item with accent color

### Task 3.4: Loading states for lazy sections

**Objective:** Show skeleton/placeholder while async components load.

**Files:** Modify: `src/App.vue`

**Step 1:** Add loading component for async sections
```ts
const AboutSection = defineAsyncComponent({
  loader: () => import('./components/sections/AboutSection.vue'),
  loadingComponent: {
    template: '<div class="h-96 animate-pulse bg-dark-card/10 dark:bg-dark-card/20 rounded-2xl mx-4 my-8"></div>'
  },
})
```
(Repeat for each lazy section)

### Task 3.5: IntersectionObserver animation refinements

**Objective:** Make scroll-reveal animations buttery smooth.

**Files:** Modify: `src/style.css`

**Step 1:** Add will-change for GPU acceleration
```css
.sr-hidden {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: opacity, transform;
}
```

---

## Phase 4: Contact Form Activation

### Task 4.1: Set up Formspree

**Objective:** Enable the contact form by creating a Formspree form and setting the env var.

**Step 1:** The formspree integration code already exists in ContactSection.vue. It checks `import.meta.env.VITE_FORMSPREE_ID`. User needs to:
1. Go to https://formspree.io/ and create a free account
2. Create a new form → get form ID like `xyzabcde`
3. Run: `echo "VITE_FORMSPREE_ID=xyzabcde" > /mnt/c/Users/dicoge/smartresume/.env`

### Task 4.2: Form validation enhancement

**Objective:** Add client-side validation with clear error messages.

**Files:** Modify: `src/components/sections/ContactSection.vue`

**Step 1:** Add form validation logic
```ts
const errors = ref({ name: '', email: '', message: '' })

const validate = () => {
  let valid = true
  errors.value = { name: '', email: '', message: '' }
  if (!form.value.name.trim()) {
    errors.value.name = t('contact.nameRequired')
    valid = false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = t('contact.emailInvalid')
    valid = false
  }
  if (!form.value.message.trim()) {
    errors.value.message = t('contact.messageRequired')
    valid = false
  }
  return valid
}
```

**Step 2:** Add error messages to template
```html
<p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
```

### Task 4.3: Add reCAPTCHA v3 to form

**Objective:** Prevent spam without user friction.

**Files:** Modify: `src/components/sections/ContactSection.vue`, `index.html`

**Step 1:** Add reCAPTCHA script to index.html
```html
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY" async defer></script>
```

**Step 2:** Get reCAPTCHA token on submit
```ts
const getRecaptchaToken = async (): Promise<string> => {
  return new Promise((resolve) => {
    grecaptcha.ready(async () => {
      const token = await grecaptcha.execute('YOUR_SITE_KEY', { action: 'submit' })
      resolve(token)
    })
  })
}
```

(Note: reCAPTCHA requires a Google Cloud account; skip if not set up yet.)

---

## Phase 5: Architecture Refactoring

### Task 5.1: Extract theme into Pinia store

**Objective:** Centralize theme/locale state management.

**Files:** Create: `src/stores/app.ts`

```ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode, Locale } from '../types'

export const useAppStore = defineStore('app', () => {
  const theme = ref<ThemeMode>(
    (localStorage.getItem('theme') as ThemeMode) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  )
  const locale = ref<Locale>(
    (localStorage.getItem('locale') as Locale) ||
    (navigator.language.startsWith('zh') ? 'zh-TW' : 'en')
  )

  watch(theme, (val) => {
    localStorage.setItem('theme', val)
    document.documentElement.classList.toggle('dark', val === 'dark')
  })

  watch(locale, (val) => {
    localStorage.setItem('locale', val)
  })

  return { theme, locale }
})
```

### Task 5.2: Install and configure Pinia

**Step 1:** Install
```bash
cd /mnt/c/Users/dicoge/smartresume
npm install pinia
```

**Step 2:** Register in main.ts
```ts
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)
```

### Task 5.3: Refactor composables to use Pinia store

**Objective:** Remove localStorage duplication between composables and store.

**Files:** Modify: `src/composables/useTheme.ts`, `src/composables/useLocale.ts`

**Step 1:** Use store in useTheme
```ts
import { useAppStore } from '../stores/app'
export function useTheme() {
  const store = useAppStore()
  // initialize dark class on mount
  onMounted(() => document.documentElement.classList.toggle('dark', store.theme === 'dark'))
  return store
}
```

### Task 5.4: Extract contact form logic into composable

**Objective:** Separate form logic from presentation.

**Files:** Create: `src/composables/useContactForm.ts`
Modify: `src/components/sections/ContactSection.vue`

```ts
// useContactForm.ts
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function useContactForm() {
  const { t } = useI18n()
  const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ID
    ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_ID}`
    : ''

  const form = ref({ name: '', email: '', subject: 'inquiry', message: '' })
  const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
  const errors = ref({ name: '', email: '', message: '' })

  const validate = () => {
    let valid = true
    errors.value = { name: '', email: '', message: '' }
    if (!form.value.name.trim()) { errors.value.name = 'Name required'; valid = false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) { errors.value.email = 'Invalid email'; valid = false }
    if (!form.value.message.trim()) { errors.value.message = 'Message required'; valid = false }
    return valid
  }

  const submit = async () => {
    if (!validate() || !FORMSPREE_ENDPOINT) return
    status.value = 'sending'
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      })
      if (res.ok) {
        status.value = 'success'
        form.value = { name: '', email: '', subject: 'inquiry', message: '' }
      } else {
        status.value = 'error'
      }
    } catch { status.value = 'error' }
    setTimeout(() => (status.value = 'idle'), 5000)
  }

  return { form, status, errors, submit }
}
```

---

## Phase 6: Testing

### Task 6.1: Set up Vitest config

**Files:** Create: `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
```

### Task 6.2: Write composable unit tests

**File:** Create: `src/composables/useTheme.test.ts`

Test theme toggle, localStorage persistence, dark class application.

### Task 6.3: Write component tests

**File:** Create: `src/components/sections/HeroSection.test.ts`

Test rendering, i18n switching, resume link generation.

### Task 6.4: Write Playwright E2E test

**File:** Create: `e2e/smoke.spec.ts`

```ts
import { test, expect } from '@playwright/test'

test('homepage loads and shows hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()
  await expect(page).toHaveTitle(/石少斌/)
})

test('navigation scrolls to sections', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Projects')
  await expect(page.locator('#projects')).toBeVisible()
})

test('dark mode toggle works', async ({ page }) => {
  await page.goto('/')
  await page.click('[aria-label="Switch to dark mode"]')
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('language switcher works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=中')
  await expect(page.locator('h1')).toContainText('石少斌')
  await page.click('text=EN')
  await expect(page.locator('h1')).toContainText('Shih Shao Pin')
})

test('project filtering works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=AI Tools')
  await expect(page.locator('[data-testid="project-card"]')).toHaveCount(1)
})

test('contact form shows validation', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Send')
  await expect(page.locator('text=Name required')).toBeVisible()
})
```

---

## Phase 7: Multi-personality QA

### Task 7.1: Delegate to OpenClaw + 184 agents

Use OpenClaw to run the website through 4 personality lenses:

- **企劃 (Planning)** — Check visual hierarchy, content completeness, brand consistency
- **軟體 (Engineering)** — Check console errors, Lighthouse scores, bundle size
- **美術 (Design)** — Check color contrast, spacing consistency, animation smoothness
- **測試 (Testing)** — Run full user flow: scroll → filter → toggle theme → switch language → fill form

---

## Verification Checklist

Before final deployment, verify:

- [ ] `npm run build` passes (vue-tsc + vite build)
- [ ] Site loads without console errors
- [ ] Dark/Light mode toggle works
- [ ] Chinese/English i18n switch works
- [ ] All 8 project cards render correctly
- [ ] Project filter works
- [ ] Contact form shows validation errors
- [ ] Scroll-reveal animations play smoothly
- [ ] Mobile responsive (320px+)
- [ ] PWA manifest loads
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] JSON-LD structured data present
- [ ] Lighthouse score >= 90 in Performance, Accessibility, SEO

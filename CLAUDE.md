# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for Leunbach Automation (lb-automation.dk), a Danish automation and machine building company. No build tools, no package.json — plain HTML/CSS/JS served via GitHub Pages.

**Company details:**
- CVR: 45615138
- Address: Uplandsgade 72, 2300 Copenhagen, Denmark
- Email: info@lb-automation.dk
- Member of DIRA

## Deployment

- **Hosting:** GitHub Pages with custom domain (`lb-automation.dk` via CNAME file)
- **Deploy:** Push to `main` — no build step required
- **Custom 404:** `404.html` (GitHub Pages convention)

## Architecture

### Pages

All pages follow the same template structure: shared header/nav, page-specific `<main>`, shared footer. Each page loads the same three JS files in order.

- `/index.html` — Home (hero slideshow + specialists grid)
- `/projekter/index.html` — Projects overview (tile grid)
- `/projekter/automation/`, `robotter/`, `specialmaskiner/`, `udvikling/` — Gallery pages
- `/kompetencer/index.html` — Competences grid
- `/om/index.html` — About page
- `/kontakt/index.html` — Contact page

### JavaScript (load order matters)

1. **`translations.js`** — Translation data object (`translations.da` / `translations.en`). Must load first.
2. **`lang.js`** — i18n engine. Reads `data-i18n` attributes, applies translations, persists language choice in `localStorage` key `preferred-lang`. Default language: Danish (`da`).
3. **`nav.js`** — Contains 5 IIFE modules in order:
   - Hamburger menu (mobile)
   - Nav indicator animation (desktop hover)
   - Hero slideshow (5s interval, lazy-loads subsequent slides via `data-src`, waits for full decode before showing each slide)
   - Gallery lightbox (keyboard + touch/swipe support)
   - Image fade-in on load (hides progressive JPEG rendering — sets `opacity:0` until loaded, then removes it so CSS-defined opacity takes over via transition)
4. **`gallery.js`** — Only on gallery pages. Loads all images from `/gallery-images.json` using native `loading="lazy"`. Requires `data-gallery` attribute on `.gallery-grid`.

### CSS

Single file: `style.css`. Uses CSS custom properties for design tokens (colors, spacing). One responsive breakpoint at `max-width: 960px` handles all mobile/tablet layout changes.

Key design tokens:
- `--bg-light: #bad3f3` — used as image placeholder background color while images load
- `--detail1` / `--detail2` — semi-transparent orange-brown, used as brand accent overlays
- `--bg-dark: #94bde9` — header and footer background

Key patterns:
- `.desktop-only` / `.mobile-only` classes toggle visibility at the 960px breakpoint
- Hero text has separate desktop and mobile versions with different `data-i18n` keys
- Gallery uses CSS multi-column layout (3 cols desktop, 2 cols mobile)
- Specialists use container queries (`cqw` units) for responsive text sizing
- Image containers (`.specialist`, `.project-tile`, `.about-image`, `.hero`) have `background: var(--bg-light)` as placeholder
- All content images have `transition: opacity 0.5s ease` for the fade-in effect

### Translation System

Custom i18n with dot-notation keys (e.g., `hero.p1`, `nav.home`). To add translatable content:
1. Add `data-i18n="section.key"` attribute to the HTML element
2. Add the key to both `da` and `en` objects in `translations.js`
3. Page titles use `<meta name="page-title-key" content="title.keyname">`

**Convention:** Use regular hyphens (`-`) in all text, not en dashes (`–`) or em dashes (`—`).

### Gallery Image Management

Gallery pages load images dynamically from `gallery-images.json`. The JSON stores objects with `src`, `w`, and `h` (pixel dimensions) for each image — the dimensions are set as `width`/`height` attributes on `<img>` so the browser reserves the correct space before images load, preventing layout shift.

To update gallery images:
1. Add/remove images in the appropriate `/images/projects/<category>/` directory
2. Run `generate-gallery.ps1` to regenerate `gallery-images.json` (reads dimensions via `System.Drawing`)
3. Optionally run `compress-images.ps1` for image optimization

`generate-gallery.ps1` is in `.gitignore` — it is only stored locally and not committed.

## Conventions

- All text visible to users must support both Danish and English via the translation system
- Images use `loading="lazy"` and `decoding="async"` (except hero first slide which uses `fetchpriority="high"`)
- Hover effects: images scale 1.03-1.05, links scale 1.08
- Semi-transparent orange-brown overlays (`--detail1`, `--detail2`) are the brand accent
- Do not use en/em dashes in any text — use regular hyphens only

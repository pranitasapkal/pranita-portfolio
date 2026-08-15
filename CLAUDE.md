# Portfolio — Pranita Sapkal · "THE NETWORK"

Personal 3D/cinematic portfolio website + resume system. NOT a Valmo project — this is Pranita's own site. The approved master plan lives at `~/.claude/plans/https-pranitas-framer-website-i-need-to-zazzy-eagle.md` (concept, architecture, content plan, fuzzing table, verification gates). Read it before any substantive work.

## What this repo is
- **Site:** Vite 6 + React 19 + TS strict + Tailwind v4 (`@tailwindcss/vite`, tokens in `src/styles/theme.css` `@theme` — NO tailwind.config.js) + GSAP/ScrollTrigger via `@gsap/react` + Lenis + React-Three-Fiber (lazy-loaded, hero only) + react-router v7.
- **Resume:** `content/resume.json` is the single source → two PDFs (designed + ATS) rendered via HTML/CSS print templates in `resume/`.
- **Content:** `content/` holds resume.json, fuzzing-map.json, case-studies/*.md (narrative source). `src/content/` holds the typed TS modules the site renders (discriminated-union `Block[]`, closed vocabulary — do not invent new block types).

## Hard rules
1. **NDA fuzzing:** the public site NEVER shows: "SetuX", ₹0.77 / 81.60%, "2,400 RFQs", 50d→14d payouts, match-engine %, KR titles verbatim, Figma file keys, real vendor/peer names, meesho.com emails. Use `content/fuzzing-map.json` pairs. The RESUME (private PDF) keeps real numbers. Run `npm run nda-scan` against `dist/` before any share.
2. **Prototype copies only:** sanitize copies in `public/prototypes/` — NEVER edit originals in sibling project folders.
3. **Design system:** this site uses THE NETWORK tokens (ink/signal/beacon/paper — see theme.css), NOT Meesho Crystal. Amber `--color-signal` is the only accent; beacon is data-viz only.
4. **Motion:** closed vocabulary (WordsPullUp, scroll-fade paragraph, magnetic, text-roll, arrow-circle, sticky-stack, 650ms crossfade). Master ease `cubic-bezier(0.65,0,0.35,1)`. Every animation lives in `gsap.matchMedia()` with a reduced-motion branch. No new motion patterns without an ADR.
5. **A11y floor:** WCAG 2.1 AA. Contrast pairs are pre-checked in theme.css comments. Focus-visible never removed. Case pages never load Three.js. Mobile <768px gets no WebGL (poster fallback).
6. **Voice:** first person, declarative, every claim within one sentence of a number or artifact. Banned words: passionate, delightful, seamless.

## Commands
`npm run dev` · `npm run build` (tsc + vite) · `npm run optimize-images` · `npm run nda-scan`

## Source material (read-only, sibling folders)
NDC `../network-design/` · CLH `../linehaul-nexus/` + `../clh-rfq-panel/` · Transporter `../contract-management/` · Placement `../placement/` · Dispute `../dispute/` · Trips `../transporter-trips/` · Plugins `../_setup/figma-plugins/` · Klaar facts `../_personal/`.

## Status tracking
`tasks/todo.md` (phases P0–P8), decisions → `tasks/decisions/ADR-NNN-*.md`.

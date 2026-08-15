# Portfolio — Pranita Sapkal

Personal portfolio website + resume system. NOT a Valmo project — this is Pranita's own site.

**The site is mid-revamp.** Two lanes run in parallel on disjoint files — Pranita rewrites the
copy, a collaborator rebuilds the visual system. Read `CONTRIBUTING.md` (file ownership) and
`docs/DESIGN-BRIEF.md` (what may change, and the floor) before any substantive work, plus
`tasks/decisions/ADR-004-visual-system-v2.md` for what the revamp has already dropped.

> The old master plan at `~/.claude/plans/https-pranitas-framer-website-i-need-to-zazzy-eagle.md`
> **no longer exists.** Do not go looking for it. Everything it gated is now in `tasks/todo.md`
> and the ADRs.

## What this repo is
- **Site:** Vite 6 + React 19 + TS strict + Tailwind v4 (`@tailwindcss/vite`, tokens in `src/styles/theme.css` `@theme` — NO tailwind.config.js) + GSAP/ScrollTrigger via `@gsap/react` + Lenis + react-router v7. **No WebGL, no 3D** — removed in ADR-004.
- **Resume:** `content/resume.json` is the single source → two PDFs (designed + ATS) rendered via HTML/CSS print templates in `resume/`.
- **Content:** `content/` holds resume.json, fuzzing-map.json, case-studies/*.md (narrative source). `src/content/` holds the typed TS modules the site renders (discriminated-union `Block[]`, closed vocabulary — do not invent new block types).

## Hard rules
1. **NDA fuzzing:** the public site NEVER shows: "SetuX", ₹0.77 / 81.60%, "2,400 RFQs", 50d→14d payouts, match-engine %, KR titles verbatim, Figma file keys, real vendor/peer names, meesho.com emails. Use `content/fuzzing-map.json` pairs. The RESUME (private PDF) keeps real numbers. Run `npm run nda-scan` against `dist/` before any share.
2. **Prototype copies only:** sanitize copies in `public/prototypes/` — NEVER edit originals in sibling project folders.
3. **Design system:** tokens live in `src/styles/theme.css` `@theme` (ink/signal/beacon/paper), NOT Meesho Crystal. Amber `--color-signal` is the only accent; beacon is data-viz only. **These tokens are being replaced** — the "THE NETWORK" identity they encode was dropped in ADR-004. Until a direction is picked they still ship, so keep using them; any replacement re-derives the contrast ratios noted in theme.css.
4. **Motion:** closed vocabulary (WordsPullUp, scroll-fade paragraph, magnetic, text-roll, arrow-circle, sticky-stack, 650ms crossfade). Master ease `cubic-bezier(0.65,0,0.35,1)`. Every animation lives in `gsap.matchMedia()` — use `withReducedMotion()` in `src/lib/motion.ts`, which registers both branches and passes a cleanup function through. No new motion patterns without an ADR.
5. **A11y floor:** WCAG 2.1 AA. Contrast pairs are pre-checked in theme.css comments. Focus-visible never removed.
6. **Voice:** first person, declarative, every claim within one sentence of a number or artifact. Banned words: passionate, delightful, seamless.

## Commands
`npm run dev` · `npm run build` (tsc + vite) · `npm run optimize-images` · `npm run nda-scan`

## Source material (read-only, sibling folders)
NDC `../network-design/` · CLH `../linehaul-nexus/` + `../clh-rfq-panel/` · Transporter `../contract-management/` · Placement `../placement/` · Dispute `../dispute/` · Trips `../transporter-trips/` · Plugins `../_setup/figma-plugins/` · Klaar facts `../_personal/`.

## Status tracking
`tasks/todo.md` (phases P0–P8), decisions → `tasks/decisions/ADR-NNN-*.md`.

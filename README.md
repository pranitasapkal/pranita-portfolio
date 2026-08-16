# THE NETWORK — Pranita Sapkal's portfolio

Personal portfolio site for **Pranita Sapkal**, Product Designer at Meesho (Valmo Transportation). Five long-form case studies on logistics tooling and a resume pipeline that renders one JSON source into several formats.

Live case studies: Transporter Panel (`TPN-01`), Network Design Central (`NDC-02`), Contract Lifecycle Hub (`CLH-03`), Transporter Contract Management (`TCM-04`), Multi-Origin Route Builder (`PLC-05`).

---

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # tsc -b && vite build  →  dist/
npm run preview    # serve dist/
```

Node 20+. No env vars, no API keys, no backend — it is a fully static site.

## Stack

| | |
|---|---|
| Build | Vite 6 |
| UI | React 19 · TypeScript (strict) · react-router v7 |
| Styling | Tailwind v4 via `@tailwindcss/vite` — tokens live in `src/styles/theme.css` under `@theme`. **There is no `tailwind.config.js`.** |
| Motion | GSAP + ScrollTrigger via `@gsap/react` · Lenis for smooth scroll |

No WebGL and no 3D — the React-Three-Fiber hero was removed in `ADR-004`, taking ~878 kB off the desktop first load.

## Scripts

| Script | What it does | Notes |
|---|---|---|
| `dev` / `build` / `preview` | standard Vite | — |
| `build:resume` | `content/resume.json` → designed + ATS PDF | |
| `build:docx` / `build:svg` | same source → DOCX / SVG | |
| `build:cv` | resume + docx together | |
| `diagrams:transporter` | renders the 3 hand-drawn Transporter Panel diagrams into `public/work/transporter-panel/` | needs Chrome at the standard macOS path |
| `shots:transporter` | exports Transporter Panel case screenshots from the Figma SOT | **needs a folder that is not in this repo** — see below |
| `nda-scan` | greps the build for strings that must not ship | **needs a file that is not in this repo** — see below |
| `optimize-images` | PNG → WebP + width variants under `public/work/`, writes `src/lib/image-manifest.json` | |
| `covers` | renders the five 16:9 case covers | **needs `npm run dev` live on :5173** |

## What is intentionally not in this repo

Three things are gitignored on purpose. Everything builds and runs without them.

| Missing | What it gated |
|---|---|
| `content/fuzzing-map.json` | Maps each public phrase to the real private value behind it, and names colleagues and Figma files. Only `nda-scan` reads it; that script now prints a notice and exits 0 when it is absent. |
| `Figma- Assignment module/` | 182 raw Figma exports + 3 internal source PDFs for the Transporter Panel case study. Only `shots:transporter` reads it; the script exits with a clear message when it is absent. The *sanitized* exports it produced are committed in `public/work/transporter-panel/`. |
| Root `*.jpeg` | Reference screenshots of other designers' portfolios, kept locally as visual research. Not ours to redistribute. |

## Architecture

```
src/
  content/
    types.ts            ← Block[] discriminated union — the content vocabulary
    cases/
      index.ts          ← registry: slug → CaseStudy, plus display order
      *.tsx             ← one file per case study
  components/
    home/CaseIndex.tsx  ← the sticky-stacking case cards on the home page
    caseStudy/
      BlockRenderer.tsx ← renders Block[]
      blocks/           ← one component per block type
  styles/theme.css      ← all design tokens (@theme)
content/
  case-studies/*.md     ← narrative source; the .tsx files are what actually renders
tasks/
  todo.md               ← phase tracker + known-issues table. Read this first.
  transporter-panel-sot-map.md ← evidence base for the Transporter Panel case study
```

### Adding or editing a case study

1. Write the narrative in `content/case-studies/`.
2. Build the typed object in `src/content/cases/<slug>.tsx`.
3. Register it in `src/content/cases/index.ts` — both the map and `caseStudyList` (which sets display order).
4. Add a card to `CASES` in `src/components/home/CaseIndex.tsx`, **and** a matching SVG in `NODE_SIGNATURES` — that array is indexed by card position, so a card without one renders blank.
5. Keep the `code` field identical in both places; they render side by side.

Case data is deliberately duplicated between the registry and the home cards — the home copy is shorter. Only `code` must stay in sync.

## Rules worth not breaking

- **`Block` is a closed vocabulary.** `src/content/types.ts` is a discriminated union. Adding a new block type needs an ADR in `tasks/decisions/`, not a quick extension.
- **Tokens only.** Colours, spacing and type come from `@theme` in `src/styles/theme.css`. Amber `--color-signal` is the sole accent; `--color-beacon` is for data-viz only.
- **Every animation lives in `gsap.matchMedia()`** with a `prefers-reduced-motion` branch. No exceptions. Use `withReducedMotion()` in `src/lib/motion.ts` — it registers both branches and passes a cleanup function through, which is where listeners and timers must be torn down.
- **Accessibility floor is WCAG 2.1 AA.** Contrast pairs are pre-checked in `theme.css` comments. Never remove `focus-visible`.
- **Routes stay lazy.** `CaseStudyPage` and `KitchenSink` are `lazy()` + `Suspense`; only the shell and `Home` ship in the main chunk.

## Contributing

Fork → branch → PR. Issues and suggestions welcome.

No `LICENSE` file, which means default copyright — all rights reserved. Forking and opening PRs works normally on a public repo; this just means the case study writing and imagery aren't licensed for reuse elsewhere.

## Where to start

`HANDOFF.md` — current status, what was just finished, what's next, and the known issues.

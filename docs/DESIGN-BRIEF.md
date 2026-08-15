# Design brief — visual rebuild

For whoever is rebuilding the look of this site. Read `CONTRIBUTING.md` first for the
file-ownership split; this file is only about the design work itself.

The short version: **the look is yours to replace. The floor below is not.**

---

## What this site is

A portfolio for a product designer working on logistics systems — internal ops panels,
contract lifecycles, and interfaces for delivery partners who read slowly and trust the
screen literally. The audience is design hiring managers, most of whom know nothing about
logistics. Five case studies, a home index, a resume, no blog.

The current identity is called "THE NETWORK": near-black ground, amber as the single accent,
a teal reserved for data marks, a warm paper section that inverts to light, and a dashed-line
route motif running through the logo, the scroll cue, the 404 and the case-card marks.

---

## What you may change

Everything visual. Specifically:

- **Tokens** — the palette, type scale, spacing, and radii in `src/styles/theme.css`.
- **Typography** — currently Archivo (display + body), Instrument Serif (italic accents),
  IBM Plex Mono (labels and numbers). All three are swappable.
- **Motion** — the vocabulary in `src/lib/motion.ts` and every GSAP block in the components.
- **Layout and composition** — section order, grid, density, the sticky-stack in the work
  index, the pinned hero.
- **Component internals** — every file under `src/components/`.
- **The two case layouts.** `EditorialCaseLayout.tsx` (long-scroll, board-driven) serves
  Contract Lifecycle Hub; `CaseLayout.tsx` (sticky chapter nav) serves the other four. This
  split was never resolved — deciding whether they converge, and on which, is part of this
  work. If they converge, `CaseStudyPage.tsx` stops branching on `layout`.

Prototype in `/dev/kitchen-sink` before touching pages. It already renders the primitives.

### Six components written as scaffolding — yours to restyle

Added by `ADR-004` so the case studies could adopt the reference template's sections. They are
written **plain and correct, not styled to finish**: right markup, right accessibility, minimal
visual design. Restyling them is expected work, not a correction.

| Component | What it is | What it must keep |
|---|---|---|
| `ProblemTabs` | A problem with several facets behind a pill switcher | WAI-ARIA tabs — roving tabindex, arrow/Home/End keys, panel labelled by its tab |
| `StatementBand` | Full-width band carrying the problem statement | Nothing structural; style freely |
| `InsightNotes` | Research insights as a sticky-note board | It is a `<ul>`. The notes are content, not decoration |
| `BeforeAfter` | Labelled toggle between two images | Both images stay in the DOM (`hidden`, not unmounted) so the swap never flashes; real buttons with `aria-pressed` |
| `AnnotatedShot` | A screen plus numbered callouts | Callouts are an `<ol>` beside the image, not absolute pins — pins break narrow and are unreadable to a screen reader |
| `NdaNote` | The NDA boundary, stated openly | Nothing structural |

`ChallengeSolution` also gained a second form — a Problem → fix → **effect** triplet. The effect
line is the point of the block; keep it visually distinct from the two columns above it.

If you replace the tokens or the motion vocabulary, record it in
`tasks/decisions/ADR-004-visual-system-v2.md` — what you replaced and why. Not bureaucracy:
the current palette carries pre-checked contrast ratios in comments, and a new palette has to
re-derive them.

---

## The floor — non-negotiable regardless of look

### Accessibility (WCAG 2.1 AA)

- Contrast: 4.5:1 body text, 3:1 large text and UI components. Re-check every pair against
  your new palette; the ratios noted in `theme.css` describe the old one.
- Never remove `focus-visible`. Every interactive element keeps a visible focus state.
- No information carried by colour alone.
- The mobile menu keeps its focus trap, Escape-to-close, and body scroll lock.

### Motion

- Every animation lives inside `gsap.matchMedia()` with a real `prefers-reduced-motion`
  branch — not an empty one. The reduced branch must render the final resting state, not
  a broken intermediate. `withReducedMotion()` in `src/lib/motion.ts` wraps this pattern.
- Test it: toggle Reduce Motion in the OS and scroll the whole page.

### Performance and platform

- **No WebGL below 768px.** The hero probes for an actual WebGL context and falls back to
  `SceneFallback` (a static SVG) on small screens, reduced-motion, or a failed probe. Keep all
  three exits.
- **Case-study pages never load Three.js.** It is a separate ~1 MB chunk, lazily imported by
  the hero only. Do not import it anywhere else.
- Keep the home page free of case-study prose — see the note in `CONTRIBUTING.md` about
  `summaries.ts`. It is a ~150 kB difference in the initial bundle.

### Content model

- `Block` in `src/content/types.ts` is a **closed** discriminated union: `text`, `statRow`,
  `image`, `compare`, `rejected`, `flow`, `prototype`, `quote`, `matrix`, `board`, `heroStats`,
  `challengeSolution`, `phaseCards`, `wordList`, `timeline`, `screensGrid`.
- You can redesign how any of them render, freely.
- Adding or removing a type changes what the text lane can author, so it needs an ADR and a
  conversation first. Removing one means rewriting real copy.

### Assets

- Prototype iframes resolve to `/prototypes/<slug>/index.html`. A bare directory URL hits the
  SPA 404 instead.
- Prototype copies under `public/prototypes/` are sanitized derivatives. Never re-sync them
  from the sibling project folders — the originals carry real client data.

---

## Things worth knowing before you start

- **The hero is ScrollTrigger-pinned** inside a 150vh section, so a static screenshot only
  ever shows the hero. Verify anything below it by actually scrolling.
- **The work index is a sticky stack.** Each card is `position: sticky` with a staggered top
  offset; `paddingBottom` creates the scroll travel between cards. If you change the stack
  mechanic, the `stickyTop` value in the ScrollTrigger has to match the inline `top`.
- **Card marks are keyed by slug** in `CaseIndex.tsx` (`NODE_SIGNATURES`), not by position.
  A case with no mark renders without one rather than leaving a hole.
- **The toolkit section inverts to a light "paper" ground** and stamps a spec-sheet mark on
  first scroll-into-view. It is the one light section; if you drop the inversion, the paper
  tokens become dead.
- **If the hero shows the SVG fallback on a capable machine**, the browser's GPU process has
  probably crash-locked — check `chrome://gpu` and restart it. It is not necessarily your bug.

## Verifying your work

```bash
npm run build      # tsc + vite, must be green
npm run nda-scan   # must exit clean
npm run dev        # then actually look at it
```

Walk: home (scroll all the way through the work stack), one standard case
(`/work/assignment-module`), the editorial case (`/work/linehaul-nexus`), `/dev/kitchen-sink`,
and a dead URL for the 404. Then repeat the home page at 360px, 768px and 1440px, and once
more with Reduce Motion on.

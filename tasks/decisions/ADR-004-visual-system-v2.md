# ADR-004: Drop "THE NETWORK" and the WebGL hero

**Date**: 2026-08-15
**Status**: Accepted

## Context

The site's identity, "THE NETWORK", themed the portfolio on its subject matter: an India-map
WebGL hero built from a 40,000-point cloud, hub nodes and route arcs, a dashed-line route motif
running through the logo, scroll cue, 404 and case-card marks, and a "THE NETWORK" ghost
wordmark behind the hero.

Two problems with that.

**It sells the wrong thing.** The audience is design hiring managers, most of whom know nothing
about logistics. A site that themes itself on freight makes logistics look like the candidate's
niche rather than the domain she happened to work in. The positioning we want is transferable
product-design skill; the theming actively argues against it.

**It is expensive.** `three` + `@react-three/fiber` + `@react-three/drei` compiled to a
1,047 kB chunk plus a 14 kB scene, and the scene needed a full fallback ladder to be safe:
a WebGL context probe, a `<768px` exit, a reduced-motion exit, an error boundary, and a static
SVG twin (`SceneFallback`) that had to stay visually 1-to-1 with the 3D poster frame. Five code
paths and ~810 lines to render a backdrop that no hiring manager was going to mention.

`docs/DESIGN-BRIEF.md` had encoded the WebGL arrangement as a *floor* requirement ("no WebGL
below 768px — keep all three exits", "case pages never load Three.js"), so the brief and the
decision were in direct contradiction until this ADR.

## Decision

1. **Drop the logistics theming.** No India-map hero, no route/hub/package motifs, no ghost
   wordmark. Deleted `src/components/three/` (`NetworkScene.tsx` 751 lines, `SceneFallback.tsx`
   57), `public/geo/{hubs,india-points}.json` (~342 kB), and `scripts/generate-india-points.mjs`.
2. **Drop WebGL entirely.** Removed `three`, `@react-three/fiber`, `@react-three/drei`,
   `@types/three`, and the `manualChunks` block in `vite.config.ts` that existed only to split
   them. There is no 3D layer left to gate, so the three floor clauses about it are retired.
3. **The hero carries on type alone** — name, serif subline, stats row, scroll cue. It was a
   150vh section with an inner sticky wrapper purely so ScrollTrigger had room to dolly the
   camera; with no camera it is a plain `min-h-screen` section.
4. **Tokens are not replaced yet.** The `theme.css` palette still ships and is still what to
   build against. It carries pre-checked contrast ratios in comments that any replacement has
   to re-derive, and the replacement direction is blocked on Pranita's reference brief. This
   ADR gets an amendment when a direction is picked.
5. **`withReducedMotion()` now passes a cleanup function through** (`src/lib/motion.ts`). The
   old signature discarded the branch's return value, which forced components to register
   listeners and timers in a bare `useEffect` outside the matchMedia — leaking them across a
   motion-preference change. The new hero uses this; the remaining motion-compliance work
   depends on it.

## Consequences

**Easier.** Desktop first load drops from 1,300.80 kB to 422.55 kB — 878 kB, or 236 kB gzipped
(377.0 → 140.9), a 62% cut in transferred JS. Five rendering paths collapse to one, so the hero
now looks the same everywhere instead of same-ish across a 3D path and a hand-maintained SVG
twin. Two long-standing traps die with it: the pinned hero that made static screenshots of the
home page useless, and the GPU-crash-lockout confusion where a capable machine silently served
the SVG fallback. Screenshots of `/` now work normally.

**Harder / watch.**

- The hero is now genuinely bare. Type alone has to hold a full viewport, and it is not yet
  designed to — this ADR removes something without replacing it, deliberately, because the
  replacement is blocked on the reference brief. Between now and then the hero is plainer than
  what it replaced. That is the known cost of not guessing at a direction.
- `site.hero.ghost` (`'THE NETWORK'`) is now **orphaned** in `src/content/site.ts`. That file is
  the text lane's; deleting the key is Pranita's call, not ours. Nothing renders it.
- `theme.css` still encodes a dropped concept. Anyone reading tokens for design intent will read
  the old intent. Flagged in the brief, resolved when tokens are replaced.
- `SKIP_DIRS = new Set(['geo'])` in `scripts/nda-scan.mjs` is now dormant — kept deliberately,
  since a stale `dist/geo/` from an older build would otherwise re-introduce the 206
  false-positive coordinate hits that P0.5 cleared.
- Reintroducing any WebGL or canvas-3D layer needs a new ADR. The dependency removal is the
  point; adding `three` back for one effect re-imports the whole cost.

---

## Amendment 1 — v2 token layer + homepage rebuild (2026-08-15, same day)

The reference brief arrived (from Manav, acting design lane): 6 portfolio references +
section-by-section screenshot mapping, research digest in `.design/RESEARCH.md`.

**Decisions:**
1. **Light-first with always-dark bands.** Semantic tokens (`--surface-*`, `--text-strong/soft`,
   `--accent`, band tokens) in `theme.css`, flipped by `[data-theme]`; bands never flip.
   Light: #FFFFFF / #1D1D1F (near-black, never pure — research pattern #3). Dark: #0B0C0E
   cluster. Accent: single blue (#2B4FE4 light / #8FA5FF dark), used sparingly.
   All pairs computed ≥ AA — derivation table in theme.css header.
2. **Working light/dark toggle from day one** (`src/lib/theme.ts`, pre-paint script in
   index.html — no FOUC, localStorage → prefers-color-scheme).
3. **Type: Fraunces Variable (display serif) + Hanken Grotesk Variable (body) + IBM Plex Mono
   (meta layer) + Caveat (handwritten micro layer).** Archivo + Instrument Serif remain
   installed for the v1 case pages only.
4. **v1 ink/signal/paper tokens survive scoped to case pages** via the `.v1-ink` wrapper in
   CaseStudyPage; `.force-dark` re-scopes the semantic vars for chrome on dark surfaces.
5. **Loader deleted** (ROUTING→DISPATCHING counter was pure THE NETWORK concept);
   RouteTransition kept but label-less. GrainOverlay deleted (invisible on light).
6. **Homepage rebuilt**: Hero (role pill / serif headline / underline accent / DragCard deck) →
   StatementFold (band) → WorkIndex (whole-card links, real covers, mono meta + status badges)
   → BeyondGrid → Approach (band) → PluginsShowcase (gradient 2-up) → WritingStrip → Footer
   (contact band). Retired: About, CaseIndex, RouteSpine, Toolkit, SecondaryWork, ProcessStrip,
   Writing, old Footer scramble.
7. **All net-new copy is quarantined in `src/content/site-v2-draft.ts`** — marked DRAFT,
   every string placeholder, Pranita rewrites. Components hold zero literals.

**Consequences:** `site.hero.ghost`, `site.hero.stats`, `site.about`, `site.process` are
currently unrendered (text-lane fields awaiting v2 slots or deletion — her call). The home
`work.sectionLabel`/`inAssembly*` strings are unused by WorkIndex. Case pages keep grain-less
v1 look until their own restyle pass.

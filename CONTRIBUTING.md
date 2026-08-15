# Contributing

Two people are rebuilding this site at the same time: Pranita is rewriting all the copy,
and a collaborator is rebuilding the visual system. This file is the contract that lets
both happen at full speed without either of us overwriting the other.

Read the file-ownership table before your first commit. It is the whole trick.

---

## Getting set up

```bash
npm install
npm run dev          # http://localhost:5173
```

`npm run build` (`tsc -b && vite build`) must stay green. There is no test suite; the build
plus a look at the page in a browser is the gate.

Three things are deliberately missing from this repo and everything still runs without them —
see [What's intentionally absent](#whats-intentionally-absent).

---

## File ownership

The rule: **copy lives in `src/content/`, appearance lives in `src/components/`.** Nobody
edits the other lane's files. If you need something from the other side, ask rather than
reach across — a one-line message costs less than a merge conflict in a 400-line component.

| Lane | Owns | Never touches |
|---|---|---|
| **Text** | `src/content/**` · `content/**` | `src/components/**` · `src/styles/**` · `src/lib/**` |
| **Design** | `src/components/**` · `src/styles/**` · `src/lib/**` · `src/pages/**` | `src/content/**` · `content/**` |
| **Shared — change by agreement** | `src/content/types.ts` · `src/App.tsx` routes · `package.json` | — |

### Where the copy actually is

| File | Holds |
|---|---|
| `src/content/site.ts` | Every user-facing string outside the case studies — nav, hero, about, toolkit, process, writing, contact, footer, 404, SEO. |
| `src/content/cases/summaries.ts` | Each case's identity (slug, code) and its **home-index card** copy. |
| `src/content/cases/*.tsx` | Each case study's **page** copy — title, one-liner, meta, TL;DR, and the `Block[]` chapters. |
| `content/case-studies/*.md` | The narrative source the `.tsx` files were written from. |
| `content/resume.json` | Single source for both resume PDFs. |

A component must never contain a user-facing string. If you are in the design lane and find
yourself typing a sentence a visitor will read, it belongs in `site.ts` — flag it instead.

### The one rule that is not about ownership

`src/content/cases/summaries.ts` loads on the **home page**, so everything in it ships to
every visitor. Case-study prose belongs in the `.tsx` case files, which load only on a case
route. Putting a page one-liner into a summary silently adds ~150 kB to the initial load and
can push NDA-sensitive text into the main bundle. The NDA scan will catch it; better not to
write it.

---

## Branches and PRs

```
public-main   the published snapshot — untouched until the revamp lands
  └─ revamp   integration branch; everything targets this
       ├─ text/*     copy work
       └─ design/*   visual work (from a fork)
```

- Branch off `revamp`, not `public-main`.
- Design work comes in as a PR from a fork against `revamp`.
- Rebase on `revamp` whenever the other lane merges. Because the lanes touch disjoint files,
  this is normally a fast-forward.
- `revamp` merges into `public-main` once, at the end.
- `main` is the old private history. It is never pushed anywhere. Do not merge it.

Before opening a PR:

```bash
npm run build      # must pass
npm run nda-scan   # must exit clean
```

---

## The NDA scan

This site is public; the work behind it is not. `npm run nda-scan` greps the build output,
the sanitized prototypes, and `content/case-studies/` for strings that must not ship.

- **Clean exit means clean.** It used to report 224 hits, 206 of which were map coordinates
  matching a bare `0.77`. Numeric tokens are now anchored and `geo/` is skipped, so any hit
  you see is real.
- **A few strings are published on purpose.** They print under "Published by decision" and do
  not fail the scan. Each was raised with Pranita twice and reaffirmed. Do not "fix" one
  without asking her first — see the `ALLOWED` list in `scripts/nda-scan.mjs` for what and why.
- The scan needs `content/fuzzing-map.json`, which is not in this repo. Without it the script
  prints a notice and exits 0, so a fork can run every other command normally.

---

## What's intentionally absent

| Missing | Why | Consequence |
|---|---|---|
| `content/fuzzing-map.json` | It pairs every public phrase with its real private value and names colleagues and Figma file keys. It must never reach a public remote. | `nda-scan` skips cleanly. Nothing else reads it. |
| `Figma- Assignment module/` | 182 raw source exports plus three internal PDFs. | `npm run shots:transporter` exits with a message. Its sanitized outputs are committed under `public/work/transporter-panel/`. |
| Root `*.jpeg` | Reference screenshots of other designers' portfolios — not ours to republish. | Nothing references them. |

Never copy anything back in from the sibling project folders. `public/prototypes/` holds
**sanitized copies**; the originals contain real client data.

---

## Conventions worth knowing

- **Tailwind v4, no config file.** Tokens are `@theme` entries in `src/styles/theme.css`.
- **`Block` in `src/content/types.ts` is a closed union.** The text lane authors against it,
  so adding a block type is a shared decision: write an ADR in `tasks/decisions/` first.
- **Two case layouts exist.** `CaseLayout.tsx` serves four cases; `EditorialCaseLayout.tsx`
  serves Contract Lifecycle Hub. `CaseStudyPage.tsx` branches on `layout === 'editorial'`.
  Whether they converge is part of the design rebuild — see `docs/DESIGN-BRIEF.md`.
- **The home hero is ScrollTrigger-pinned.** A static headless screenshot only ever
  re-renders the hero, so you cannot verify the Work section that way. Scroll for real.
- **Adding a case study** touches four places: the case `.tsx`, `cases/summaries.ts`,
  `CASE_ORDER`, and `cases/index.ts` — plus a node signature keyed by slug in `CaseIndex.tsx`.

## Known rough edges

- `npm run optimize-images` points at `scripts/optimize-images.mjs`, which has never existed.
  Nothing depends on it.
- `content/case-studies/CLH-SCRIPT-v3.md` is a working draft sitting in a scanned directory.
  It probably belongs in `tasks/`, pending a check that the CLH generator scripts don't read it.

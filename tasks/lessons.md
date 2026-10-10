# Lessons Learned

> Rules derived from corrections. Each entry must be concrete and preventive.
> Format: date — category → rule → context → why

## 2026-08-16 — Communication: internal codenames
**Rule**: Never use session-invented codes (TPN-01, D4b, ch5) with the user — say "the Transporter Panel case study". Codes live only in files and commit messages.
**Context**: Asked the user to choose next steps "on the TPN page"; they could not answer because they didn't know what TPN meant.
**Why**: The codes were invented by earlier chats for internal tracking; the user never adopted them.

## 2026-08-16 — Direction recovery after drift
**Rule**: When the user says a previous session drifted or hallucinated, do not trust its recorded direction — re-derive from the primary source (the live reference site, the user's own mock) and re-confirm each recorded ask with the user before building.
**Context**: The handoff's 10-point section order was only "partially right"; the recorded single-amber accent contradicted the reference's five-accent palette, verified live.
**Why**: A drifted session records its own misunderstandings as facts; the handoff inherits them.

## 2026-08-16 — Baked-text images
**Rule**: When the user supplies a composition with text baked in, ship it desktop-only with an alt that enumerates the text, and render live equivalents at small widths. Find their exported file in ~/Downloads (match dimensions) instead of asking them to re-save.
**Context**: The problem-section mock (facepalm + seven questions) arrived as a paste; the export was already on disk as facepalm_man_trip_questions_v2_highres.png.
**Why**: Pastes never reach the filesystem, but the authoring tool's export almost always does; baked text at 360px is unreadable and invisible to screen readers.


## 2026-09-06 — Case-study sourcing: never paste the source deck
**Rule**: When a case study is built from a Behance/Figma board set, **transcribe the boards into copy in our own 10-block format and use only genuine product screens as images** — crop individual screens out of the boards rather than embedding a board. A board is someone else's layout, someone else's headings, and someone else's argument.
**Context**: The first Smart Home page pasted seven whole boards (brief, research, personas, competitive, IA, flow, wireframes) as images. Pranita: *"i dont want you to use images as it is the the projects, i want you to write it in texts as per our case study and the format we used."* Applied again for DoJoin — 20 screens cropped out of 25 boards, zero boards embedded.
**Why**: I treated the boards as finished artefacts to display instead of as source material to read. Pasting a board also hides errors — transcribing Smart Home properly revealed its journey map had **four** stages, not the seven my first draft claimed.

## 2026-09-06 — Attribution: check resume.json before calling anything "personal"
**Rule**: Before framing any project as a concept, self-directed, unbuilt, or untested, grep `content/resume.json` for the org name. If it is an employer, say so and use its real dates.
**Context**: I described AURA as a "self-directed concept, never built, never usability-tested". `resume.json` shows **AuraSmart was an employer** (Jan–Nov 2023) and that she *ran usability testing* there. All three claims wrong, all three understating her experience.
**Why**: I inferred employment status from the Behance framing instead of the one file in the repo that records it.

## 2026-09-11 — Verification: a tool that exits 0 has not necessarily written anything
**Rule**: Never report a save, upload, or publish as done on the strength of an exit code or an absent error. Query the destination for the specific thing you wrote — a marker string, a URL returning 200, a row count. If the destination cannot be queried, say the save is unverified.
**Context**: `mempalace mine` exits **139** but returns 0 through a pipeline, so `cmd | tail` looks successful while the process has segfaulted and stored nothing. Proven by mining a scratch file with a unique marker and getting 0 rows from `chroma.sqlite3`. Still broken on re-test five days later; `set-embedder` does not fix it.
**Why**: I was reading the shell's report of the *last* command in the pipe rather than of the command that mattered — and a silent no-op is indistinguishable from success unless you go and look.

## 2026-09-14 — Copy work: words before layout
**Rule**: For any copy task, draft the actual words first — fact-checked against `content/resume.json` and `content/fuzzing-map.json` — and only then ask about placement, hierarchy or variant. Ask about wording, never about arrangement, until the wording exists.
**Context**: I offered Pranita three hero *layouts* as ASCII previews before any copy existed. She refused: *"lets first decide on what are we actually plannig to write before changnig it on the prototype."*
**Why**: A layout choice made against placeholder words is backwards — the copy determines how much room the layout needs, not the reverse. I was optimising for a fast decision instead of the right sequence.

## 2026-09-14 — Personal-brand copy: the employer is not the argument
**Rule**: When writing Pranita's own positioning (hero, about, bio), the current employer is a credential in the corner, never the claim. Inventory every project across every employer first, find the through-line, then write. `resume.json`'s summary paragraph is written for a resume and will always over-index on the current role — do not lift it wholesale into portfolio copy.
**Context**: My first Framer hero draft led on Meesho/Valmo in the role strip, the claim and the proof line. *"it should not be so related to just meesho i feel, it should be about me."*
**Why**: I reached for the nearest authoritative paragraph instead of asking what the whole body of work has in common. She has consumer apps, a UAE multi-service app, a shipped App Store product, agency client work and eight self-built Figma plugins — one employer cannot carry that.

## 2026-09-21 — Copy: no em dashes, anywhere
**Rule**: Never use an em dash (—) in any copy for Pranita's portfolio — hero, section text, captions, case studies. Rewrite the sentence with a comma, a full stop, or a colon instead.
**Context**: Line E for the intro fold shipped with "ON A SCREEN — AND I BUILD…". She: *"REMOVE THE EM DASHES, I DONT WANT THAT ANYWHERE."* Also found in the template's Approach 001 and Services subheading, and in my own BeyondPixels caption.
**Why**: It is a house-style call, and I had defaulted to my own punctuation habit instead of hers.

## 2026-10-08 — Templates: a pattern, not a clone
**Rule**: When Pranita says "save as a template", keep the *pattern* (section order, voice, tokens, components, rules) but vary the arrangement per case: layouts, positions and visual treatments should differ from case to case. Never output a new case that is a same-to-same copy of the reference layout.
**Context**: Case 02 Contract was generated with every section identical in layout to Trips. She: "does not mean that everything should be exactly in the same way in same position, but more or less things should have a pattern, but not all same to same."
**Why**: I read "template" as "layout to duplicate" instead of "system to apply". A portfolio where every case looks identical reads as generated, not designed.

## 2026-10-08 — "Match the Figma UI exactly" means pixels, not a rebuild
**Rule**: When she asks a prototype to match Figma exactly, use the Figma frames themselves (exported images with hotspots/rings from Figma node coordinates). A hand-coded HTML rebuild with a substitute font and stand-in icons does not count as matching, however close the copy is.
**Context**: The HTML Contract prototype matched labels and layout but used a system font, brighter navy and drawn icons; she said it was "not at all matching with the UI from Figma".
**Why**: I verified copy and structure and called it a match; she judges by how it looks.

## 2026-10-08 · Never clip a device mockup by accident (hero bleed is deliberate)
- **Rule:** every frame and phone mockup shows whole: no `max-height` peeks, no open-bottom frames, and no screen crops that keep slivers of the original bezel. Trim screens inside their bezel, then draw one clean frame.
- **Context:** the v5 hero cut the prototype at 560px with an open bottom, the mobile hero clipped the phones, and Behance crops kept bits of the board bezels. Pranita: "the mockups are cutting the frames".
- **Why:** a cut frame reads as a mistake. She reviews craft at the pixel level, so a half-shown screen undercuts the work it frames.

- **Amended the same day:** for the HERO and the Home covers she wants the frame cut, rising out of the bottom edge with about 60% visible (`SHOW = 0.6` in build_case.py). That is a deliberate bleed with an open bottom edge. Everywhere else (reels, phone panels, screen crops), frames stay whole.
- **Amended again (same day):** the reference is a full-screen opening hero. The header is one viewport tall, the frame takes the rest of the screen and is cut by the window's bottom edge (`fold_hero()` in build_case.py). Home covers are captured from that opening screen at 1440x810.

## A case heading must say what the product is, and match everywhere (2026-10-09)
- **Rule:** a case study H1 states the product and the change in plain words ("Every truck contract, decided on screen"). It is the same on the L1 hover cover and the L2 page. Re-capture the cover whenever the H1 changes. Remind her to push gh-pages: the cover updates in Framer at once, but the hosted L2 page lags until she pushes.
- **Context:** she said the old contract heading "does not make sense" and that L1 and L2 must be consistent. The cover already showed the new H1 while the live L2 page (unpushed) showed an older one.
- **Why:** a clever contrast line ("question, not just accept") needs context the reader doesn't have yet, and a mismatch between the list and the page reads as two different projects.

## Illustrations anchor to text, on pure white (2026-10-09)
- **Rule:** never float a spot illustration off a heading. Pair it with the paragraph it illustrates, vertically centred on that paragraph (`aside` block). Before placing any illustration, trim it to its drawing and turn near-white backgrounds pure white, so it never shows as a tinted box.
- **Context:** she called the first placements "forced and hanging" and asked for no backgrounds behind the illustrations.
- **Why:** an image next to a heading has no partner, so it reads as decoration stuck in a corner. An off-white background under `mix-blend-mode:multiply` still prints as a faint box.

## Framer edits are not live until someone presses Publish (2026-10-09)
- **Rule:** after any Framer edit, say plainly that it sits in the editor only, and ask whether to publish. The live site is `gray-football-641289.framer.app`. After publishing, curl the live site to confirm.
- **Context:** she saw the old More section on the live site and asked why her change "wasn't executed". The editor and its preview had the change; it was never published.
- **Why:** "verified in the Framer preview" reads as "done" to her, but the preview isn't what she or visitors see.

## Navigation inside an iframe: never rely on history.back() (2026-10-09)
- **Rule:** a hosted case page runs inside the Framer site's iframe. Its back/next links must set `window.top.location.href` to the parent origin (taken from `document.referrer`, with the live site as fallback). Test cross-origin with a parent page on another port before claiming it works.
- **Context:** "Go back not working" on every case. `SITE` was empty, so the iframe fell back to `history.back()`, which did nothing; "Next project" was silently dead for the same reason.
- **Why:** a freshly loaded iframe has no history of its own, and an empty config value turned a fallback path into the only path.

## 2026-10-09: "Go back doesn't work" was really "case links open in a new tab"
- **Rule:** when a user says navigation "isn't happening", check the link's target before touching the destination code: `grep target=` on the live HTML.
- **Context:** Home's case links (work-column component) were `target="_blank"`, so every case opened a new tab and Go back landed on a second Home; my earlier tests navigated by URL and never clicked the list.
- **Why:** test the path the user takes (click the real link), not a shortcut to the page.

- **Rule:** after changing a layout property on a Framer component's primary (Desktop) variant, check every breakpoint variant live before calling it done. **Context:** 2026-10-09, setting the navbar container to Distribute Start for Desktop also moved the Phone hamburger next to the logo, because Phone had no override. **Why:** primary-variant edits propagate to variants silently.

- **Rule:** never put `@import` (or anything Framer rewrites) inside a `<style>` rendered by a Framer code component; load fonts with a `<link>` in useEffect. **Context:** 2026-10-10, it caused a server/client mismatch that made the whole page client-render and broke the phone navbar. **Why:** Framer hoists @import into a link at SSR, so the hydrated text differs.
- **Rule:** after changing anything in a Framer layout/template, re-test the phone menu open and close on the live site. **Context:** the overlay "On open" variant on the primary instance controls every breakpoint.

- **Rule:** when uploading to a Framer image property by script, find the control inside the same row as its label and re-read every image slot afterwards. **Context:** 2026-10-10, a click aimed at "Resume page 1" landed on "CH2 image" and put the resume on the TV. **Why:** the properties panel can scroll between measuring and clicking.
- **Rule:** every new Framer page needs Tablet and Phone breakpoints; check `<meta name="viewport">` on each live page. **Context:** six inner pages served width=1200 to phones. **Why:** a page with only a Desktop breakpoint is rendered at desktop width and shrunk.

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


/**
 * EditorialCaseLayout — walletsprout-style long-scroll case shell (ADR-001).
 * Serif editorial hero (eyebrow · title · one-liner · Domain/Role/Timeline/Scale pills)
 * → cover board → chapters rendered full-width top-to-bottom (no sticky nav) with boards
 * interleaved → Decision Spotlights → Reflection → Next case.
 * Real-content cases (cs.noindex) inject a robots noindex tag and skip the NDA chip.
 */
import { useEffect } from 'react'
import { SEOHead } from '../chrome/SEOHead'
import { ArrowCircle } from '../primitives/ArrowCircle'
import { BlockRenderer } from './BlockRenderer'
import { Board } from './blocks/Board'
import type { CaseStudy } from '../../content/types'

interface EditorialCaseLayoutProps {
  cs: CaseStudy
}

export function EditorialCaseLayout({ cs }: EditorialCaseLayoutProps) {
  useEffect(() => {
    if (!cs.noindex) return
    const m = document.createElement('meta')
    m.name = 'robots'
    m.content = 'noindex, nofollow'
    document.head.appendChild(m)
    return () => {
      document.head.removeChild(m)
    }
  }, [cs.noindex])

  const pills: [string, string][] = [
    ['Domain', cs.domain ?? cs.meta.platform],
    ['Role', cs.meta.role],
    ['Timeline', cs.meta.timeline],
    ['Skills', cs.meta.skills.join(' · ')],
    ...(cs.scale ? ([['Scale', cs.scale]] as [string, string][]) : []),
  ]

  return (
    <>
      <SEOHead title={`${cs.title} — Pranita Sapkal`} description={cs.oneLiner} />

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-12 flex flex-col gap-7">
          <span className="font-mono text-xs tracking-[0.22em] uppercase text-signal">
            {cs.eyebrow ?? `${cs.code} · ${cs.meta.platform}`}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-[4.25rem] leading-[1.02] tracking-tight text-text-hi max-w-[20ch]">
            {cs.title}
          </h1>
          <p className="font-body text-lg md:text-xl text-text-lo leading-relaxed max-w-[62ch]">
            {cs.oneLiner}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {pills.map(([k, v]) => (
              <span
                key={k}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 bg-ink-1"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-text-lo/60">
                  {k}
                </span>
                <span className="font-mono text-xs text-text-hi">{v}</span>
              </span>
            ))}
          </div>
        </section>

        {/* ── COVER BOARD ──────────────────────────────────────────── */}
        {cs.coverBoard && (
          <section className="w-full max-w-5xl mx-auto px-6 md:px-12 pb-8">
            <Board
              src={cs.coverBoard.src}
              alt={cs.coverBoard.alt}
              tone={cs.coverBoard.tone ?? 'light'}
              placeholder={cs.coverBoard.placeholder}
            />
          </section>
        )}

        {/* ── CHAPTERS (long-scroll) ───────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 flex flex-col gap-28">
          {cs.chapters.map((chapter) => (
            <section
              key={chapter.id}
              id={`step-${chapter.step}`}
              aria-labelledby={`chapter-heading-${chapter.step}`}
              className="relative scroll-mt-24 flex flex-col gap-8"
            >
              {/* Ghost word backdrop (decorative) */}
              {chapter.ghost && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none absolute -top-14 right-0 font-display font-black tracking-tight text-text-hi/[0.04] leading-none whitespace-nowrap text-[7rem] md:text-[11rem]"
                >
                  {chapter.ghost}
                </span>
              )}
              <div className="relative flex flex-col gap-3">
                <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal">
                  {String(chapter.step).padStart(2, '0')}
                  {chapter.kicker ? (
                    <span className="text-text-lo"> / {chapter.kicker}</span>
                  ) : null}
                </span>
                <h2
                  id={`chapter-heading-${chapter.step}`}
                  className="font-display font-black text-3xl md:text-5xl text-text-hi tracking-tight max-w-[22ch] leading-[1.05]"
                >
                  {chapter.title}
                </h2>
              </div>
              <BlockRenderer blocks={chapter.blocks} />
            </section>
          ))}
        </div>

        {/* ── DECISION SPOTLIGHTS (only when the case still uses them) ─ */}
        {cs.spotlights.length > 0 && (
        <section className="bg-ink-1 border-t border-line" aria-labelledby="spotlights-heading">
          <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal">
                Decision Spotlights
              </span>
              <h2
                id="spotlights-heading"
                className="font-display font-black text-2xl md:text-3xl text-text-hi tracking-tight"
              >
                What I kept, what I cut, and why.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cs.spotlights.map((spot, i) => (
                <article
                  key={i}
                  className="flex flex-col gap-4 p-6 rounded-xl border border-line bg-ink-0 hover:border-signal/30 transition-colors duration-300"
                >
                  <p className="font-body text-text-hi text-sm leading-relaxed">{spot.decision}</p>
                  <div className="border-t border-line pt-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-text-lo/60">
                        What I rejected
                      </span>
                      <p className="font-mono text-xs text-text-lo line-through decoration-text-lo/40 leading-relaxed">
                        {spot.rejected}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-signal/70">
                        Why
                      </span>
                      <p className="font-body text-xs text-text-lo leading-relaxed">{spot.why}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── REFLECTION ───────────────────────────────────────────── */}
        <section
          className="max-w-5xl mx-auto px-6 md:px-12 py-20 flex flex-col gap-6"
          aria-labelledby="reflection-heading"
        >
          <div className="flex flex-col gap-2 border-b border-line pb-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-lo">
              Closing
            </span>
            <h2
              id="reflection-heading"
              className="font-display font-black text-2xl text-text-hi tracking-tight"
            >
              What I'd test next.
            </h2>
          </div>
          <ul className="flex flex-col gap-7 list-none p-0 m-0 max-w-[65ch]">
            {cs.reflections.map((r) => (
              <li key={r.title} className="flex gap-4 border-b border-line pb-7 last:border-b-0">
                <span className="font-mono text-signal shrink-0 pt-1.5" aria-hidden="true">
                  —
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-black text-xl md:text-2xl text-text-hi tracking-tight leading-snug">
                    {r.title}
                  </h3>
                  {r.body && (
                    <p className="font-body text-sm md:text-base text-text-lo leading-relaxed">
                      {r.body}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── NEXT CASE ────────────────────────────────────────────── */}
        <section className="border-t border-line" aria-label="Next case study">
          <a
            href={`/work/${cs.next.slug}`}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-5xl mx-auto px-6 md:px-12 py-12 hover:bg-ink-1 transition-colors duration-300"
          >
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-lo">
                Next case
              </span>
              <span className="font-mono text-sm text-signal">{cs.next.code}</span>
              <span className="font-display font-black text-2xl md:text-3xl text-text-hi group-hover:text-signal transition-colors duration-300 tracking-tight">
                {cs.next.title}
              </span>
            </div>
            <ArrowCircle
              size={56}
              className="text-text-lo group-hover:text-signal transition-colors duration-300 shrink-0"
            />
          </a>
        </section>
      </main>
    </>
  )
}

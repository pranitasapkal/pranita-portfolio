/**
 * CaseLayout — full case-study page shell.
 * CaseHero → TldrBlock → chapters (ChapterNav + BlockRenderer) →
 * Decision Spotlights → Reflection → NextCase footer card.
 */
import { SEOHead } from '../chrome/SEOHead'
import { WordsPullUp } from '../primitives/WordsPullUp'
import { PillTag } from '../primitives/PillTag'
import { ArrowCircle } from '../primitives/ArrowCircle'
import { TldrBlock } from './TldrBlock'
import { ChapterNav } from './ChapterNav'
import { BlockRenderer } from './BlockRenderer'
import type { CaseStudy } from '../../content/types'

interface CaseLayoutProps {
  cs: CaseStudy
}

export function CaseLayout({ cs }: CaseLayoutProps) {
  return (
    <>
      <SEOHead
        title={`${cs.title} — Pranita Sapkal`}
        description={cs.oneLiner}
      />

      <main id="main">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="w-full pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto flex flex-col gap-8">
          {/* Code stamp */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal">
              {cs.code}
            </span>
            <span className="font-mono text-xs text-line" aria-hidden="true">·</span>
            <span className="font-mono text-xs text-text-lo tracking-wider">
              {cs.meta.platform}
            </span>
          </div>

          {/* Title */}
          <WordsPullUp
            as="h1"
            className="font-display font-black text-4xl md:text-6xl lg:text-7xl tracking-tight text-text-hi leading-none"
          >
            {cs.title}
          </WordsPullUp>

          {/* One-liner */}
          <p className="font-serif italic text-xl md:text-2xl text-text-lo leading-snug max-w-[50ch]">
            {cs.oneLiner}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6">
            {(
              [
                ['Role', cs.meta.role],
                ['Team', cs.meta.team],
                ['Timeline', cs.meta.timeline],
                ['Skills', cs.meta.skills.join(' · ')],
              ] as [string, string][]
            ).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-text-lo/60">
                  {key}
                </span>
                <span className="font-mono text-xs text-text-lo">{val}</span>
              </div>
            ))}
          </div>

          {/* NDA chip */}
          <div>
            <a href="#nda-footnote">
              <PillTag className="hover:border-signal/40 transition-colors duration-200">
                Metrics fuzzed for NDA — see note*
              </PillTag>
            </a>
          </div>
        </section>

        {/* ── TLDR ─────────────────────────────────────────────────── */}
        <TldrBlock
          problem={cs.tldr.problem}
          outcomes={cs.tldr.outcomes}
          summary={cs.tldr.summary}
          stats={cs.tldr.stats}
        />

        {/* ── CHAPTERS ─────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
          <div className="flex gap-16 items-start">
            {/* Sticky chapter nav — rendered outside the chapters column */}
            <ChapterNav chapters={cs.chapters} />

            {/* Chapter content */}
            <div className="flex-1 min-w-0 flex flex-col gap-20">
              {cs.chapters.map((chapter) => (
                <section
                  key={chapter.id}
                  id={`step-${chapter.step}`}
                  aria-labelledby={`chapter-heading-${chapter.step}`}
                  className="scroll-mt-24 flex flex-col gap-8"
                >
                  {/* Chapter header */}
                  <div className="flex flex-col gap-2 border-b border-line pb-6">
                    {/* When `title` is a claim, `kicker` carries the process-step name so the
                        8-step sequence stays visible here as it does in the editorial layout. */}
                    <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal">
                      STEP {String(chapter.step).padStart(2, '0')}
                      {chapter.kicker && (
                        <span className="text-text-lo"> / {chapter.kicker}</span>
                      )}
                    </span>
                    <h2
                      id={`chapter-heading-${chapter.step}`}
                      className="font-display font-black text-2xl md:text-3xl text-text-hi tracking-tight"
                    >
                      {chapter.title}
                    </h2>
                  </div>
                  <BlockRenderer blocks={chapter.blocks} />
                </section>
              ))}
            </div>
          </div>
        </div>

        {/* ── DECISION SPOTLIGHTS ──────────────────────────────────── */}
        <section className="bg-ink-1 border-t border-line" aria-labelledby="spotlights-heading">
          <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-10">
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
                  <p className="font-body text-text-hi text-sm leading-relaxed">
                    {spot.decision}
                  </p>
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
                      <p className="font-body text-xs text-text-lo leading-relaxed">
                        {spot.why}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── REFLECTION ───────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-6" aria-labelledby="reflection-heading">
          <div className="flex flex-col gap-2 border-b border-line pb-6">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-lo">
              Reflection
            </span>
            <h2
              id="reflection-heading"
              className="font-display font-black text-2xl text-text-hi tracking-tight"
            >
              What I'd flag against myself.
            </h2>
          </div>
          <ul className="flex flex-col gap-6 list-none p-0 m-0 max-w-[65ch]">
            {cs.reflections.map((r) => (
              <li key={r.title} className="flex gap-4 border-b border-line pb-6 last:border-b-0">
                <span className="font-mono text-signal shrink-0 pt-1" aria-hidden="true">
                  —
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-black text-lg md:text-xl text-text-hi tracking-tight leading-snug">
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
            <ArrowCircle size={56} className="text-text-lo group-hover:text-signal transition-colors duration-300 shrink-0" />
          </a>
        </section>
      </main>
    </>
  )
}

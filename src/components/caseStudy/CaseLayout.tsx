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
import { DeviceFrame } from './blocks/DeviceFrame'
import type { CaseStudy } from '../../content/types'

interface CaseLayoutProps {
  cs: CaseStudy
}

/* Section accents cycle the reference palette (text-safe deep variants only —
   contrast table in theme.css). Brighter per-section labels, home-page style. */
const POP_TEXT = [
  'text-pop-blue',
  'text-pop-red-deep',
  'text-pop-green-deep',
  'text-pop-purple-deep',
  'text-pop-yellow-deep',
]
const POP_BG = [
  'bg-pop-blue/8',
  'bg-pop-red/8',
  'bg-pop-green/8',
  'bg-pop-purple/8',
  'bg-pop-yellow/10',
]

export function CaseLayout({ cs }: CaseLayoutProps) {
  return (
    <>
      <SEOHead
        title={`${cs.title} — Pranita Sapkal`}
        description={cs.oneLiner}
      />

      <main id="main">
        {/* ── HERO — the one black band on an otherwise white page ──── */}
        <div className="v1-ink bg-ink-0 text-text-hi relative overflow-hidden">
          {/* Big subtle grey grid (Manav, 2026-08-16, replacing the glow) —
              static CSS, fades out toward the bottom so the mockup sits clean. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(237,239,243,0.07) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(237,239,243,0.07) 1px, transparent 1px)',
              backgroundSize: '88px 88px',
              maskImage: 'linear-gradient(to bottom, black 55%, transparent 95%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 95%)',
            }}
          />
        <section className="relative w-full pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col gap-8">
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
                <span className="font-body text-sm text-text-hi">{val}</span>
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

          {/* Hero mockup — the panel inside a laptop screen (Debo-style, ADR-007) */}
          {cs.heroShot && (
            <div className="pt-8">
              <DeviceFrame src={cs.heroShot.src} alt={cs.heroShot.alt} />
            </div>
          )}
        </section>
        </div>

        {/* ── TLDR ─────────────────────────────────────────────────── */}
        <TldrBlock
          problem={cs.tldr.problem}
          outcomes={cs.tldr.outcomes}
          summary={cs.tldr.summary}
          stats={cs.tldr.stats}
        />

        {/* ── CHAPTERS ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          {/* Column on mobile so the chip bar stacks above the chapters and its
              overflow-x scroll stays bounded; row with the sticky rail on lg. */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-stretch lg:items-start">
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
                    {/* `eyebrow` is the Debo-style mono section label ("THE PROBLEM");
                        cases without one keep the STEP NN sequence. */}
                    <span
                      className={`font-mono text-xs tracking-[0.2em] uppercase font-medium ${POP_TEXT[(chapter.step - 1) % POP_TEXT.length]}`}
                    >
                      {chapter.eyebrow ?? (
                        <>
                          STEP {String(chapter.step).padStart(2, '0')}
                          {chapter.kicker && (
                            <span className="text-text-lo"> / {chapter.kicker}</span>
                          )}
                        </>
                      )}
                    </span>
                    <h2
                      id={`chapter-heading-${chapter.step}`}
                      className="font-display font-black text-3xl md:text-4xl text-signal tracking-tight"
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

        {/* Decision Spotlights removed (Manav, 2026-08-16) — the argued decisions
            live in the chapters; `cs.spotlights` data is retained in content. */}

        {/* ── REFLECTION ───────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col gap-6" aria-labelledby="reflection-heading">
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
          {/* Numbered accent cards — same tinted-panel language as the stat
              tiles and screenshot panels, filling the full column. */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
            {cs.reflections.map((r, i) => (
              <li
                key={r.title}
                className={`flex flex-col gap-2 rounded-2xl border border-line p-6 md:p-7 ${POP_BG[i % POP_BG.length]}`}
              >
                <span
                  className={`font-mono text-sm tabular-nums ${POP_TEXT[i % POP_TEXT.length]}`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <h3 className="font-display font-black text-xl md:text-2xl text-text-hi tracking-tight leading-snug">
                  {r.title}
                </h3>
                {r.body && (
                  <p className="font-body text-base text-text-lo leading-relaxed">{r.body}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ── NEXT CASE ────────────────────────────────────────────── */}
        <section className="border-t border-line" aria-label="Next case study">
          <a
            href={`/work/${cs.next.slug}`}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 max-w-7xl mx-auto px-6 md:px-12 py-12 hover:bg-ink-1 transition-colors duration-300"
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

/**
 * CaseIndex — id="work". Sticky-stacking case cards, one per registered case study.
 *
 * Card copy comes from each case's `home` field in src/content/cases/*.tsx — this
 * component authors no text. NODE_SIGNATURES is keyed by slug; a case without a
 * signature simply renders no mark rather than a blank slot.
 *
 * Sticky-stack mechanic:
 *   Each card wrapper is position:sticky with staggered top offsets.
 *   paddingBottom on each wrapper creates the scroll distance before the next
 *   card slides into its sticky position.
 *   GSAP ScrollTrigger: when card[i] reaches its sticky top, card[i-1] scales
 *   to 0.96 and dims. onLeaveBack reverses. Reduced-motion: plain stack.
 *
 * Hover tilt + parallax (desktop pointer:fine only):
 *   Cards tilt up to ±2.5° toward cursor via gsap.quickTo (spring back on leave).
 *   The BrowserFrame slot inside shifts ~8px opposite the tilt (parallax layer).
 *   Disabled under prefers-reduced-motion and on touch/hover:none devices.
 *
 * Non-NDC cards are <div aria-disabled> (no Link) so we never ship dead routes.
 */
import { useRef, useCallback } from 'react'
import type { ComponentType } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { EASE, DURATIONS } from '../../lib/motion'
import { SectionLabel } from '../primitives/SectionLabel'
import { PillTag } from '../primitives/PillTag'
import { ArrowCircle } from '../primitives/ArrowCircle'
import { BrowserFrame } from '../primitives/BrowserFrame'
import { caseSummaryList } from '../../content/cases/summaries'
import { site } from '../../content/site'

// ── Case data ─────────────────────────────────────────────────────────────────
// Derived from cases/summaries.ts — the cards carry no copy of their own, and the
// summaries module deliberately excludes case-study prose so the home page stays light.
interface CaseData {
  slug: string
  code: string
  title: string
  oneLiner: string
  stats: string[]
  browserSlug: string
  live: boolean
}

const CASES: CaseData[] = caseSummaryList.map((cs) => ({
  slug: cs.slug,
  code: cs.code,
  title: cs.cardTitle,
  oneLiner: cs.cardOneLiner,
  stats: cs.stats,
  browserSlug: cs.browserSlug,
  live: cs.live ?? true,
}))

// ── Node signatures — unique per-card constellations ─────────────────────────
function NodeASM() {
  return (
    <svg width="64" height="44" viewBox="0 0 64 44" fill="none" aria-hidden="true">
      <circle cx="7"  cy="22" r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <circle cx="21" cy="22" r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <circle cx="35" cy="22" r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <circle cx="49" cy="22" r="3.5" fill="var(--color-signal)" />
      <circle cx="49" cy="38" r="2"   stroke="var(--color-beacon)" strokeWidth="1.5" />
      <path d="M10 22 L18 22" stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 4" />
      <path d="M24 22 L32 22" stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 4" />
      <path d="M38 22 L45 22" stroke="var(--color-signal)"  strokeWidth="0.9" strokeDasharray="3 4" />
      <path d="M49 27 L49 35" stroke="var(--color-beacon)"  strokeWidth="0.8" strokeDasharray="2 4" />
    </svg>
  )
}

function NodeNDC() {
  return (
    <svg width="64" height="44" viewBox="0 0 64 44" fill="none" aria-hidden="true">
      <circle cx="12" cy="22" r="3.5" fill="var(--color-signal)" />
      <circle cx="46" cy="10" r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <circle cx="54" cy="34" r="2"   stroke="var(--color-beacon)"  strokeWidth="1.5" />
      <path d="M15 20 Q30 8 43 11"   stroke="var(--color-signal)"  strokeWidth="0.8" strokeDasharray="3 4" />
      <path d="M15 24 Q30 30 52 33"  stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 5" />
    </svg>
  )
}

function NodeCLH() {
  return (
    <svg width="72" height="24" viewBox="0 0 72 24" fill="none" aria-hidden="true">
      <circle cx="10" cy="12" r="3.5" fill="var(--color-signal)" />
      <circle cx="36" cy="7"  r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <circle cx="62" cy="12" r="2"   stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <path d="M13 11 Q24 6 33 8"    stroke="var(--color-signal)"  strokeWidth="0.8" strokeDasharray="3 4" />
      <path d="M39 8  Q50 8 60 11"   stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 5" />
    </svg>
  )
}

function NodeTPR() {
  return (
    <svg width="64" height="50" viewBox="0 0 64 50" fill="none" aria-hidden="true">
      <circle cx="10" cy="25" r="3.5" fill="var(--color-signal)" />
      <circle cx="48" cy="10" r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <circle cx="48" cy="40" r="2.5" stroke="var(--color-text-lo)" strokeWidth="1.5" />
      <path d="M13 23 Q30 12 45 11"  stroke="var(--color-signal)"  strokeWidth="0.8" strokeDasharray="3 4" />
      <path d="M13 27 Q30 36 45 39"  stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 5" />
    </svg>
  )
}

function NodePLA() {
  return (
    <svg width="64" height="52" viewBox="0 0 64 52" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="2.5" fill="var(--color-signal)" opacity="0.75" />
      <circle cx="10" cy="26" r="2.5" fill="var(--color-signal)" />
      <circle cx="10" cy="42" r="2.5" fill="var(--color-signal)" opacity="0.75" />
      <circle cx="54" cy="26" r="3.5" stroke="var(--color-beacon)" strokeWidth="1.5" />
      <path d="M13 11 Q32 17 51 25"  stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 5" />
      <path d="M13 26 L51 26"        stroke="var(--color-signal)"  strokeWidth="0.9" strokeDasharray="3 4" />
      <path d="M13 41 Q32 36 51 27"  stroke="var(--color-text-lo)" strokeWidth="0.8" strokeDasharray="3 5" />
    </svg>
  )
}

// Keyed by slug so signatures can never fall out of step with card order.
const NODE_SIGNATURES: Record<string, ComponentType> = {
  'assignment-module': NodeASM,
  'network-design-central': NodeNDC,
  'linehaul-nexus': NodeCLH,
  'transporter-contract-management': NodeTPR,
  'placement-multi-origin': NodePLA,
}

// ── Card covers ───────────────────────────────────────────────────────────────
// Keyed by slug, same contract as NODE_SIGNATURES: a case with no cover falls back to
// the pending frame rather than leaving a hole. These are visual assets, not copy, so
// they live in the design lane. Generated by `npm run covers` — two are existing frames
// from public/work/, three are captured from the case's own sanitized prototype.
// Widths come from `npm run optimize-images`; keep the two in step.
const COVER_WIDTHS = [640, 960, 1280, 1600]

const CARD_COVERS = new Set([
  'assignment-module',
  'network-design-central',
  'linehaul-nexus',
  'transporter-contract-management',
  'placement-multi-origin',
])

/**
 * The card preview. `alt` is intentionally empty: the wrapping Link already carries an
 * aria-label naming the case, so alt text here would just double the announcement.
 * Explicit width/height reserve the box so decoding cannot shift ScrollTrigger positions.
 */
function CardCover({ slug }: { slug: string }) {
  const base = `/work/covers/${slug}`
  return (
    <img
      src={`${base}-1280.webp`}
      srcSet={COVER_WIDTHS.map((w) => `${base}-${w}.webp ${w}w`).join(', ')}
      sizes="(min-width: 768px) min(1136px, 100vw - 6rem), calc(100vw - 3rem)"
      width={1600}
      height={900}
      loading="lazy"
      decoding="async"
      alt=""
      className="block w-full h-auto aspect-[16/9] object-cover object-top bg-ink-2"
    />
  )
}

// ── Individual case card ──────────────────────────────────────────────────────
interface CaseCardProps {
  data: CaseData
}

function CaseCard({ data }: CaseCardProps) {
  const NodeSig = NODE_SIGNATURES[data.slug]
  const cardRef = useRef<HTMLDivElement>(null)
  const browserRef = useRef<HTMLDivElement>(null)

  // Detect capabilities once at mount — values don't change during lifetime.
  const canTilt = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // quickTo functions — lazily initialised on first mousemove.
  const qRotateY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const qRotateX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const qBrowserX = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const qBrowserY = useRef<ReturnType<typeof gsap.quickTo> | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt.current) return
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    // Normalised cursor position: -1 (left/top) → +1 (right/bottom)
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2

    // Lazy-init quickTo with perspective set once
    if (!qRotateY.current) {
      gsap.set(card, { transformPerspective: 800 })
      qRotateY.current = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power2.out' })
      qRotateX.current = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power2.out' })
    }

    qRotateY.current(nx * 2.5)
    qRotateX.current?.(-ny * 2.5)

    // BrowserFrame slot shifts opposite (parallax)
    const browser = browserRef.current
    if (browser) {
      if (!qBrowserX.current) {
        qBrowserX.current = gsap.quickTo(browser, 'x', { duration: 0.5, ease: 'power2.out' })
        qBrowserY.current = gsap.quickTo(browser, 'y', { duration: 0.5, ease: 'power2.out' })
      }
      qBrowserX.current(-nx * 8)
      qBrowserY.current?.(-ny * 8)
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!canTilt.current) return
    const card = cardRef.current
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: EASE })
    const browser = browserRef.current
    if (browser) {
      gsap.to(browser, { x: 0, y: 0, duration: 0.8, ease: EASE })
    }
  }, [])

  const cardInner = (
    <div
      ref={cardRef}
      className={[
        'case-card-inner',
        'bg-ink-1 border border-line rounded-2xl overflow-hidden',
        'transition-colors duration-200',
        data.live ? 'group-hover:border-signal/30' : '',
      ].join(' ')}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-8 pt-6 md:pt-7 pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-signal tracking-[0.2em] uppercase">
            {data.code}
          </span>
          {!data.live && (
            <PillTag className="border-signal/25 text-signal/50 text-[10px]">
              {site.work.inAssemblyLabel}
            </PillTag>
          )}
        </div>
        {NodeSig && <NodeSig />}
      </div>

      {/* Title + one-liner */}
      <div className="px-6 md:px-8 pb-6">
        <h3 className="font-display font-black text-2xl md:text-3xl text-text-hi leading-tight tracking-tight">
          {data.title}
        </h3>
        <p className="font-serif italic text-text-lo mt-3 text-base md:text-lg leading-relaxed max-w-2xl">
          {data.oneLiner}
        </p>
      </div>

      {/* Browser frame — case preview (parallax layer) */}
      <div ref={browserRef} className="px-6 md:px-8 pb-6">
        <BrowserFrame slug={data.browserSlug}>
          {CARD_COVERS.has(data.slug) ? (
            <CardCover slug={data.slug} />
          ) : (
            <div className="aspect-[16/9] bg-ink-2 flex items-center justify-center">
              <span className="font-mono text-xs text-text-lo tracking-[0.2em] uppercase">
                {site.work.assetPendingLabel}
              </span>
            </div>
          )}
        </BrowserFrame>
      </div>

      {/* Bottom row: stats + arrow */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 md:px-8 pb-6 md:pb-7">
        <div className="flex flex-wrap gap-2">
          {data.stats.map((s) => (
            <PillTag key={s}>{s}</PillTag>
          ))}
        </div>
        <ArrowCircle size={40} className={data.live ? 'text-text-hi' : 'text-text-lo opacity-40'} />
      </div>
    </div>
  )

  if (data.live) {
    return (
      <Link
        to={`/work/${data.slug}`}
        className="group block focus-visible:outline-signal focus-visible:outline-2 rounded-2xl"
        aria-label={site.work.viewCaseAriaLabel(data.title)}
      >
        {cardInner}
      </Link>
    )
  }

  return (
    <div
      role="link"
      aria-disabled="true"
      aria-label={site.work.inAssemblyAriaLabel(data.title)}
      className="group cursor-default"
      tabIndex={-1}
    >
      {cardInner}
    </div>
  )
}

// ── CaseIndex ─────────────────────────────────────────────────────────────────
export function CaseIndex() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const cards = sectionRef.current?.querySelectorAll<HTMLElement>('.case-card-inner')
      const tracks = sectionRef.current?.querySelectorAll<HTMLElement>('.card-track')
      if (!cards?.length || !tracks?.length) return

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // When track[i] reaches its sticky position, dim + scale track[i-1]
        Array.from(tracks).forEach((_track, i) => {
          if (i === 0) return
          const stickyTop = 88 + i * 10 // px — matches inline style below
          ScrollTrigger.create({
            trigger: tracks[i],
            start: `top top+=${stickyTop}px`,
            onEnter: () => {
              gsap.to(cards[i - 1], {
                scale: 0.96,
                opacity: 0.6,
                duration: DURATIONS.reveal,
                ease: EASE,
              })
            },
            onLeaveBack: () => {
              gsap.to(cards[i - 1], {
                scale: 1,
                opacity: 1,
                duration: DURATIONS.reveal,
                ease: EASE,
              })
            },
          })
        })
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        // Cards rendered plain — no transforms, all visible
        if (cards) gsap.set(Array.from(cards), { scale: 1, opacity: 1 })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      id="work"
      ref={sectionRef}
      className="bg-ink-0 border-t border-line py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel
          number={site.work.sectionNumber}
          label={site.work.sectionLabel}
          className="mb-16"
        />

        {/* Stack */}
        <div className="relative">
          {CASES.map((c, i) => (
            <div
              key={c.slug}
              className="card-track sticky"
              style={{
                top: `${88 + i * 10}px`,
                zIndex: i + 1,
                // paddingBottom creates scroll travel before the next card slides up
                paddingBottom: i < CASES.length - 1 ? '220px' : '0',
              }}
            >
              <CaseCard data={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

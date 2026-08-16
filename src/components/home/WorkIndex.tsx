/**
 * WorkIndex — id="work". Framed work showcase (roshan-sahu.com ref, taken
 * from their actual DOM: .work-img-wrapper > stacked .work-image elements).
 *
 * A FIXED rectangular frame sits on the left; every project cover is stacked
 * inside it. The section pins and, per scroll segment, the next cover wipes
 * up from the bottom of the frame (clip-path inset) slightly oversized and
 * settles to fit, while the previous one scales down beneath it. The right
 * column crossfades each project's meta in sync.
 *
 * Registered via gsap.matchMedia() on `(prefers-reduced-motion: no-preference)
 * and (min-width: 1024px)`; outside that a plain stacked list renders with no
 * pin. Copy from cases/summaries.ts (text lane); meta from the draft module.
 */
import { useRef } from 'react'
import { Link } from 'react-router'
import { gsap, useGSAP } from '../../lib/gsap'
import { caseSummaryList } from '../../content/cases/summaries'
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'
import { MetaLine } from '../primitives/MetaLine'

const WIDTHS = [640, 960, 1280, 1600]
const coverSrcSet = (slug: string) => WIDTHS.map((w) => `/work/covers/${slug}-${w}.webp ${w}w`).join(', ')

const N = caseSummaryList.length

export function WorkIndex() {
  const hostRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const metaRefs = useRef<(HTMLDivElement | null)[]>([])
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])
  const dimRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      // Animation lives in gsap.matchMedia(); the extra width condition keeps
      // the pin off small screens, where the CSS fallback list renders anyway.
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
        const track = trackRef.current
        if (!track) return

        let lastP = -1
        const render = (p: number) => {
          // Skip sub-pixel updates: Lenis emits many near-identical frames.
          if (Math.abs(p - lastP) < 0.0008) return
          lastP = p
          cardRefs.current.forEach((card, i) => {
            if (!card) return
            const reveal = Math.min(1, Math.max(0, p - (i - 1)))
            const covered = Math.min(1, Math.max(0, p - i))
            gsap.set(card, {
              clipPath: `inset(${(1 - reveal) * 100}% 0% 0% 0%)`,
              scale: 1.07 - 0.07 * reveal - 0.09 * covered,
              zIndex: i + 1,
            })
            // Dim via a black overlay's opacity (composite-only) instead of
            // filter: brightness(), which re-rasters the full-size cover.
            const dim = dimRefs.current[i]
            if (dim) gsap.set(dim, { opacity: 0.4 * covered })
          })
          bgRefs.current.forEach((bg, i) => {
            if (!bg) return
            const dist = Math.abs(i - p)
            gsap.set(bg, { opacity: Math.max(0, 1 - dist * 1.2) })
          })
          metaRefs.current.forEach((meta, i) => {
            if (!meta) return
            const dist = Math.abs(i - p)
            gsap.set(meta, {
              opacity: Math.max(0, 1 - dist * 2.4),
              y: (i - p) * -46,
              pointerEvents: dist < 0.4 ? 'auto' : 'none',
            })
          })
        }

        // Progress computed directly from scrollY against the track's live
        // position: no ScrollTrigger, so nothing can go stale or invert.
        const onScroll = () => {
          const r = track.getBoundingClientRect()
          if (r.bottom < -80 || r.top > window.innerHeight + 80) return
          const total = r.height - window.innerHeight
          const passed = Math.min(total, Math.max(0, -r.top))
          render((passed / total) * (N - 1))
        }
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
          window.removeEventListener('scroll', onScroll)
          window.removeEventListener('resize', onScroll)
        }
      })
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  return (
    <section ref={hostRef} id="work" aria-label={site.work.sectionLabel} className="force-dark bg-surface-0">
      {/* ── Sticky showcase (desktop, motion-safe): tall track, sticky stage ── */}
      <div ref={trackRef} className="hidden lg:motion-safe:block relative" style={{ height: `${N * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
        {/* Per-project backdrop: blurred cover art, crossfading with progress */}
        <div className="absolute inset-0" aria-hidden="true">
          {caseSummaryList.map((cs, i) => (
            <div
              key={cs.slug}
              ref={(el) => {
                bgRefs.current[i] = el
              }}
              className="absolute inset-0"
            >
              <img
                src={`/work/covers/${cs.slug}-blur.webp`}
                alt=""
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {/* Deep veil over the blurred art — it read washed-out at lower opacity
              (Manav, 2026-08-16); the covers now only tint the black. */}
          <div className="absolute inset-0 bg-[#0b0c0e]/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b0c0e]/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e]/70 via-transparent to-[#0b0c0e]/60" />
          {/* Faint route-network line work behind the meta column — the job,
              drawn once: nodes, dashed linehaul legs, a destination pin. */}
          <svg
            className="absolute right-[2vw] top-1/2 -translate-y-1/2 w-[38vw] max-w-[640px] opacity-60"
            viewBox="0 0 640 440"
            fill="none"
            aria-hidden="true"
          >
            <g stroke="#edeff3" strokeOpacity="0.09" strokeWidth="1.5">
              <path d="M60 360 C 140 300, 180 260, 250 210" strokeDasharray="2 8" />
              <path d="M250 210 C 330 160, 400 190, 470 150" strokeDasharray="2 8" />
              <path d="M470 150 C 520 120, 560 90, 590 60" strokeDasharray="2 8" />
              <path d="M250 210 C 300 270, 380 300, 470 290" strokeDasharray="2 8" />
              <circle cx="60" cy="360" r="7" />
              <circle cx="250" cy="210" r="10" />
              <circle cx="470" cy="150" r="7" />
              <circle cx="470" cy="290" r="7" />
              <circle cx="250" cy="210" r="22" strokeDasharray="1 6" />
            </g>
            <g stroke="#edeff3" strokeOpacity="0.14" strokeWidth="1.5">
              <path d="M590 60 c -7 -12 -7 -22 0 -30 c 7 8 7 18 0 30 Z" />
              <circle cx="590" cy="38" r="3" />
            </g>
          </svg>
        </div>
        <div className="absolute top-28 left-[6vw] z-20">
          <SectionTag>{draft.work.tag}</SectionTag>
        </div>

        {/* Fixed frame; covers stack inside and wipe/settle per scroll segment */}
        <div className="absolute left-[6vw] top-1/2 -translate-y-1/2 w-[46vw] max-w-[860px] aspect-[16/10] rounded-2xl overflow-hidden border border-line-soft bg-surface-2 shadow-[var(--shadow-card)]">
          {caseSummaryList.map((cs, i) => (
            <div
              key={cs.slug}
              ref={(el) => {
                cardRefs.current[i] = el
              }}
              className="absolute inset-0 will-change-transform"
            >
              <Link
                to={`/work/${cs.slug}`}
                aria-label={site.work.viewCaseAriaLabel(cs.cardTitle)}
                className="relative block w-full h-full"
                tabIndex={-1}
              >
                <img
                  src={`/work/covers/${cs.slug}-1280.webp`}
                  srcSet={coverSrcSet(cs.slug)}
                  sizes="46vw"
                  width={1600}
                  height={900}
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover object-top"
                  draggable={false}
                />
                <div
                  ref={(el) => {
                    dimRefs.current[i] = el
                  }}
                  aria-hidden="true"
                  className="absolute inset-0 bg-black opacity-0 pointer-events-none"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Right meta column */}
        <div className="absolute right-[5vw] top-1/2 -translate-y-1/2 w-[32vw] max-w-[560px] h-[40vh] z-10">
          {caseSummaryList.map((cs, i) => {
            const meta = draft.work.meta[cs.slug]
            return (
              <div
                key={cs.slug}
                ref={(el) => {
                  metaRefs.current[i] = el
                }}
                className="absolute inset-x-0 top-0 flex flex-col gap-5 will-change-transform"
              >
                <div className="flex items-start gap-3">
                  <Link
                    to={`/work/${cs.slug}`}
                    className="font-sans font-black uppercase text-strong leading-[1.02] tracking-tight text-[clamp(2.2rem,3.4vw,3.8rem)] hover:text-accent transition-colors duration-200"
                  >
                    {cs.cardTitle}
                  </Link>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-soft mt-2 shrink-0">
                    {draft.work.openLabel}
                  </span>
                </div>
                {meta && (
                  <div className="flex flex-col gap-1.5">
                    <MetaLine parts={[meta.company, meta.domain]} />
                    <MetaLine parts={[meta.year]} status={meta.status} />
                  </div>
                )}
                <p className="font-sans text-[15px] text-soft leading-relaxed max-w-md">
                  {cs.cardOneLiner}
                </p>
                <p className="font-mono text-[11px] tracking-[0.2em] text-soft">
                  {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </p>
              </div>
            )
          })}
        </div>
        </div>
      </div>

      {/* ── Fallback: mobile or reduced motion — plain stacked list ── */}
      <div className="lg:motion-safe:hidden max-w-[1800px] mx-auto px-6 md:px-[6vw] py-24 flex flex-col gap-10">
        <SectionTag>{draft.work.tag}</SectionTag>
        {caseSummaryList.map((cs) => {
          const meta = draft.work.meta[cs.slug]
          return (
            <Link
              key={cs.slug}
              to={`/work/${cs.slug}`}
              aria-label={site.work.viewCaseAriaLabel(cs.cardTitle)}
              className="group flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface-2 overflow-hidden"
            >
              <img
                src={`/work/covers/${cs.slug}-960.webp`}
                srcSet={coverSrcSet(cs.slug)}
                sizes="(min-width: 768px) 88vw, 100vw"
                width={1600}
                height={900}
                alt=""
                loading="lazy"
                className="w-full h-auto"
              />
              <div className="flex flex-col gap-2.5 p-6 pt-1">
                {meta && <MetaLine parts={[meta.company, meta.domain, meta.year]} status={meta.status} />}
                <h3 className="font-sans font-bold text-strong tracking-tight text-xl">{cs.cardTitle}</h3>
                <p className="font-sans text-[15px] text-soft leading-relaxed">{cs.cardOneLiner}</p>
                <span className="font-sans font-semibold text-[15px] text-strong">
                  {draft.work.readStory} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

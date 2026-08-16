/**
 * Hero — v2 (Sandeep ref): light surface, role pill, huge Fraunces headline
 * with a hand-drawn underline accent, grotesk subline, two pill CTAs, a
 * bold-prefix credibility line, and the interactive DragCard deck on the right
 * (stacks below the text on mobile).
 *
 * Entrance runs on mount inside withReducedMotion(); the reduced branch
 * registers nothing, so everything renders at rest.
 */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EASE, DURATIONS, withReducedMotion } from '../../lib/motion'
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'
import { RolePill } from '../primitives/RolePill'
import { UnderlineAccent } from '../primitives/UnderlineAccent'
import { MarkerHighlight } from '../primitives/MarkerHighlight'
import { PillButton } from '../primitives/PillButton'
import { DragCard } from '../primitives/DragCard'

export function Hero() {
  const hostRef = useRef<HTMLElement>(null)
  const h = draft.hero

  useGSAP(
    () => {
      const mm = withReducedMotion(() => {
        const items = hostRef.current?.querySelectorAll<HTMLElement>('[data-hero-reveal]')
        if (!items?.length) return
        gsap.set(items, { y: 24, opacity: 0 })
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: DURATIONS.reveal,
          ease: EASE,
          stagger: 0.09,
          delay: 0.1,
        })
      })
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  return (
    <section
      ref={hostRef}
      aria-label={site.hero.sectionAriaLabel}
      className="force-dark bg-surface-0 min-h-screen flex items-center overflow-x-clip"
    >
      <div className="w-full max-w-[1800px] mx-auto px-6 md:px-[6vw] pt-32 pb-20 grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-16 items-center">
        {/* ── Text column ── */}
        <div className="flex flex-col items-start gap-8">
          <div data-hero-reveal className="flex flex-col items-start gap-3">
            <p className="font-hand text-2xl md:text-3xl text-soft -rotate-1">{h.hello}</p>
            <RolePill
              role={h.rolePill.role}
              at={h.rolePill.at}
              logoSrc={h.rolePill.logoSrc}
              logoAlt={h.rolePill.logoAlt}
              location={h.rolePill.location}
            />
          </div>

          <h1
            data-hero-reveal
            className="font-serif-display font-semibold text-strong tracking-tight leading-[1.04] text-[clamp(2.4rem,4.5vw,4.5rem)]"
          >
            {h.headline.map((seg, i) =>
              seg.underline ? (
                <UnderlineAccent key={i}>
                  <em className="italic">{seg.text}</em>
                </UnderlineAccent>
              ) : seg.highlight ? (
                <MarkerHighlight key={i}>{seg.text}</MarkerHighlight>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </h1>

          <p data-hero-reveal className="font-sans text-lg md:text-xl text-soft max-w-2xl leading-relaxed">
            {site.hero.subline}
          </p>

          <div data-hero-reveal className="flex flex-wrap gap-4 mt-4">
            <PillButton href="#work">{h.ctaPrimary}</PillButton>
            <PillButton href={site.nav.resumeHref} download variant="outline">
              {h.ctaSecondary}
            </PillButton>
          </div>

          <p data-hero-reveal className="font-sans text-[15px] text-soft">
            <strong className="font-bold text-strong">{h.credibility.strong}</strong>
            {h.credibility.rest}
          </p>
        </div>

        {/* ── Interactive deck ── */}
        <div data-hero-reveal className="flex justify-center xl:justify-end xl:pr-10">
          <DragCard />
        </div>
      </div>
    </section>
  )
}

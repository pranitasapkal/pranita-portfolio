/**
 * Approach — the second dark band (Divesh "generalist with a specialist
 * mindset" ref): grotesk + italic-serif headline over four columns of
 * icon / title / short paragraph. Icons are abstract monochrome SVG marks —
 * decorative, aria-hidden.
 */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EASE, withReducedMotion } from '../../lib/motion'
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'

/** Abstract glassy marks, one per column — decorative only. */
const MARKS = [
  /* nested squares */
  <svg key="0" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <rect x="6" y="6" width="32" height="32" rx="8" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
    <rect x="14" y="14" width="16" height="16" rx="5" fill="currentColor" fillOpacity="0.35" />
  </svg>,
  /* split circle */
  <svg key="1" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <path d="M22 4a18 18 0 0 1 0 36V4Z" fill="currentColor" fillOpacity="0.35" />
    <circle cx="22" cy="22" r="17" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
  </svg>,
  /* spark card */
  <svg key="2" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <rect x="5" y="10" width="34" height="24" rx="6" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
    <path d="M33 6l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" fill="currentColor" fillOpacity="0.7" />
    <rect x="11" y="18" width="12" height="2.5" rx="1.25" fill="currentColor" fillOpacity="0.55" />
    <rect x="11" y="24" width="8" height="2.5" rx="1.25" fill="currentColor" fillOpacity="0.35" />
  </svg>,
  /* interlock */
  <svg key="3" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <circle cx="17" cy="22" r="10" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
    <circle cx="27" cy="22" r="10" fill="currentColor" fillOpacity="0.3" />
  </svg>,
]

export function Approach() {
  const hostRef = useRef<HTMLElement>(null)
  const a = draft.approach

  useGSAP(
    () => {
      const mm = withReducedMotion(() => {
        const cols = hostRef.current?.querySelectorAll<HTMLElement>('[data-approach-col]')
        if (!cols?.length) return
        gsap.set(cols, { y: 30, opacity: 0 })
        gsap.to(cols, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: hostRef.current, start: 'top 72%' },
        })
      })
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  return (
    <section ref={hostRef} aria-label={a.ariaLabel} className="force-dark bg-surface-0 border-t border-line-soft">
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-24 md:py-36 flex flex-col gap-16">
        <div className="flex flex-col gap-5">
          <SectionTag>{a.tag}</SectionTag>
          <h2 className="font-sans font-medium text-strong tracking-tight leading-[1.08] text-[clamp(2.1rem,5.4vw,4rem)]">
            {a.headlinePlain}
            <em className="font-serif-display italic font-semibold">{a.headlineItalic}</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {a.columns.map((col, i) => (
            <div key={col.title} data-approach-col className="flex flex-col items-start gap-5 text-strong">
              {MARKS[i % MARKS.length]}
              <h3 className="font-sans font-semibold text-xl">{col.title}</h3>
              <p className="font-sans text-[15px] leading-relaxed text-soft">{col.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

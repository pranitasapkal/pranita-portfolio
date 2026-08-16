/**
 * PluginsShowcase — "FIGMA PLUGINS I BUILT", dark. A bento grid of all eight
 * plugins from site.toolkit: the two draft-featured ones take the large cells
 * (2×2 and 2×1 on desktop), the rest fill 1×1. Card language matches the
 * BeyondGrid tiles: near-black, bordered, lift + accent border on hover.
 */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EASE, withReducedMotion } from '../../lib/motion'
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'
import { MetaLine } from '../primitives/MetaLine'

/** Figma logo mark for the section tag. */
const FIGMA_MARK = (
  <svg width="12" height="17" viewBox="0 0 12 17" fill="none" aria-hidden="true">
    <path d="M3 17a3 3 0 0 0 3-3v-3H3a3 3 0 0 0 0 6Z" fill="#0acf83" />
    <path d="M0 8.5a3 3 0 0 1 3-3h3v6H3a3 3 0 0 1-3-3Z" fill="#a259ff" />
    <path d="M0 3a3 3 0 0 1 3-3h3v6H3a3 3 0 0 1-3-3Z" fill="#f24e1e" />
    <path d="M6 0h3a3 3 0 0 1 0 6H6V0Z" fill="#ff7262" />
    <path d="M12 8.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" fill="#1abcfe" />
  </svg>
)

const CARD =
  'flex flex-col gap-3 rounded-2xl border border-line-soft bg-[#101114] p-5 ' +
  'transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ' +
  'hover:-translate-y-1 hover:scale-[1.015] hover:border-accent/60 hover:shadow-[var(--shadow-card)]'

/** One accent-tinted glyph per category — the icon layer the gradient cards had. */
const ICONS: Record<string, React.ReactNode> = {
  AUDIT: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="text-accent">
      <circle cx="13" cy="13" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M19 19 L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9.5 13 L12 15.5 L17 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ENFORCE: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="text-accent">
      <path d="M15 3 L26 7 V14 C26 20.5 21.5 25.4 15 27 C8.5 25.4 4 20.5 4 14 V7 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10.5 14.5 L13.5 17.5 L19.5 11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  CHECK: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="text-accent">
      <rect x="4" y="4" width="22" height="22" rx="5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12 h6 M9 17 h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 17.5 L19.5 20 L24 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  GENERATE: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="text-accent">
      <path d="M15 4 L17.4 12.6 L26 15 L17.4 17.4 L15 26 L12.6 17.4 L4 15 L12.6 12.6 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="6" r="2" fill="currentColor" />
    </svg>
  ),
  SPEC: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="text-accent">
      <path d="M8 3 H19 L25 9 V27 H8 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 3 V9 H25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 15 h9 M12 20 h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  SYNC: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true" className="text-accent">
      <path d="M25 12 A10.5 10.5 0 0 0 6.5 9.5 M5 18 A10.5 10.5 0 0 0 23.5 20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 5 V12 H18 M5 25 V18 H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

export function PluginsShowcase() {
  const hostRef = useRef<HTMLElement>(null)
  const p = draft.plugins
  // Featured plugins take the large cells: reorder so they land at 0 and 5.
  const ordered = site.toolkit.plugins

  useGSAP(
    () => {
      const mm = withReducedMotion(() => {
        const cards = hostRef.current?.querySelectorAll<HTMLElement>('[data-plugin-card]')
        if (!cards?.length) return
        gsap.set(cards, { y: 30, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.55,
          ease: EASE,
          stagger: 0.06,
          scrollTrigger: { trigger: hostRef.current, start: 'top 75%' },
        })
      })
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  return (
    <section ref={hostRef} aria-label={site.toolkit.sectionLabel} className="force-dark bg-surface-0 border-t border-line-soft">
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-24 md:py-32 flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <SectionTag mark={FIGMA_MARK}>{p.tag}</SectionTag>
          <h2 className="font-serif-display font-semibold text-strong tracking-tight text-[clamp(1.9rem,4.2vw,3rem)]">
            {site.toolkit.headline}
          </h2>
          <p className="font-sans text-lg text-soft">{p.subline}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ordered.map((plugin) => (
            <article key={plugin.name} data-plugin-card className={CARD}>
              <div className="flex items-center justify-between gap-3">
                {ICONS[plugin.category]}
                <MetaLine parts={[plugin.category]} />
              </div>
              <h3 className="font-sans font-bold text-strong tracking-tight text-[15px]">
                {plugin.name}
              </h3>
              <p className="font-sans text-soft leading-relaxed text-[13px]">{plugin.oneLiner}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

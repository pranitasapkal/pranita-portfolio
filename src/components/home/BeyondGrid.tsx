/**
 * BeyondGrid — "not just logistics" (Sandeep "Things that move" ref).
 * Bento of secondary work from site.secondaryWork: side builds, earlier-life
 * websites, and app concepts, each a typographic tile with tags. Tiles with
 * `earlier: true` carry the EARLIER WORK badge — the deliberate signal that
 * she existed before Meesho.
 */
import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { EASE, withReducedMotion } from '../../lib/motion'
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'
import { MetaLine } from '../primitives/MetaLine'
import { UnderlineAccent } from '../primitives/UnderlineAccent'

/** One card treatment for every tile: near-black, bordered, and alive on
 *  hover (lift + slight grow + accent border). No color families. */
const CARD =
  'flex flex-col gap-4 rounded-3xl border border-line-soft bg-[#101114] p-7 ' +
  'transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ' +
  'hover:-translate-y-1.5 hover:scale-[1.02] hover:border-accent/60 hover:shadow-[var(--shadow-card)]'

export function BeyondGrid() {
  const hostRef = useRef<HTMLElement>(null)
  const b = draft.beyond

  useGSAP(
    () => {
      const mm = withReducedMotion(() => {
        const tiles = hostRef.current?.querySelectorAll<HTMLElement>('[data-beyond-tile]')
        if (!tiles?.length) return
        gsap.set(tiles, { y: 30, opacity: 0 })
        gsap.to(tiles, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: hostRef.current, start: 'top 75%' },
        })
      })
      return () => mm.revert()
    },
    { scope: hostRef },
  )

  return (
    <section ref={hostRef} aria-label={site.secondaryWork.sectionLabel} className="force-dark bg-surface-0 border-t border-line-soft">
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-24 md:py-32 flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-3xl">
          <SectionTag>{b.tag}</SectionTag>
          <h2 className="font-serif-display font-semibold text-strong tracking-tight leading-[1.05] text-[clamp(2rem,4.6vw,3.4rem)]">
            {b.headline.map((seg, i) =>
              seg.underline ? (
                <UnderlineAccent key={i}>{seg.text}</UnderlineAccent>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </h2>
          <p className="font-sans text-lg text-soft">{b.subline}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {site.secondaryWork.items.filter((i) => !i.earlier).map((item) => (
            <article
              key={item.title}
              data-beyond-tile
              className={CARD}
            >
              <MetaLine parts={item.tags} />
              <h3 className="font-sans font-bold text-xl text-strong tracking-tight">
                {item.title}
              </h3>
              <p className="font-sans text-[15px] text-soft leading-relaxed">{item.desc}</p>
            </article>
          ))}
          {draft.beyond.extras.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              data-beyond-tile
              className={CARD}
            >
              <MetaLine parts={item.tags} status={item.status} />
              <h3 className="font-sans font-bold text-xl text-strong tracking-tight">
                {item.title} <span aria-hidden="true">↗</span>
              </h3>
              <p className="font-sans text-[15px] text-soft leading-relaxed">{item.desc}</p>
            </a>
          ))}
          {site.secondaryWork.items.filter((i) => i.earlier).map((item) => (
            <article
              key={item.title}
              data-beyond-tile
              className={CARD}
            >
              <MetaLine
                parts={item.tags}
                status={item.earlier ? site.secondaryWork.earlierTag : undefined}
              />
              <h3 className="font-sans font-bold text-xl text-strong tracking-tight">
                {item.title}
              </h3>
              <p className="font-sans text-[15px] text-soft leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * BeyondPixels — "Things that aren't on my resume" (wallofportfolios /
 * shreyas-vyas ref). Big uppercase prompts stacked between hairlines; hovering
 * (or tapping / focusing) a prompt expands a serif-italic caption and a photo
 * strip beneath it, exactly like the ref's reveal.
 *
 * The expand uses the CSS grid-rows trick (0fr -> 1fr) so height animates
 * without measuring; the global reduced-motion rule collapses the transition
 * to an instant toggle. Prompts are real <button>s with aria-expanded.
 *
 * Photos are Pranita's to drop into public/beyond/ — items with no images
 * render dashed placeholder tiles so the layout reads while she collects them.
 */
import { useState } from 'react'
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'
import { UnderlineAccent } from '../primitives/UnderlineAccent'

export function BeyondPixels() {
  const b = draft.beyondPixels
  const [active, setActive] = useState<number | null>(null)

  return (
    <section aria-label={b.ariaLabel} className="force-dark bg-surface-0 border-t border-line-soft">
      <style>{`
        @keyframes bp-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .bp-track { animation: bp-marquee 32s linear infinite; }
        .bp-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-24 md:py-32 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <SectionTag>{b.tag}</SectionTag>
          <h2 className="font-display font-black uppercase text-strong tracking-tight leading-[1.02] text-[clamp(2rem,5vw,3.8rem)] max-w-4xl">
            {b.headline.map((seg, i) =>
              seg.underline ? (
                <UnderlineAccent key={i}>{seg.text}</UnderlineAccent>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </h2>
          <p className="font-serif-display italic text-soft text-lg md:text-xl">{b.subline}</p>
        </div>

        <div className="flex flex-col">
          {b.items.map((item, i) => {
            const open = active === i
            /* Per-row hover pop (Manav, 2026-08-16): text-only, no bg flood.
               Saturated-but-luminous takes on his trio so they hold on the
               black band — orange 7.50, cobalt 5.38, pink 6.43. focus-visible
               matches hover. */
            const popText = ['#ff7a1a', '#5b7cff', '#ff4fa3'][i % 3]
            const pop = [
              'hover:text-[#ff7a1a] focus-visible:text-[#ff7a1a]',
              'hover:text-[#5b7cff] focus-visible:text-[#5b7cff]',
              'hover:text-[#ff4fa3] focus-visible:text-[#ff4fa3]',
            ][i % 3]
            return (
              <div
                key={item.prompt}
                className="border-t border-line-soft last:border-b"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(open ? null : i)}
                  className={`w-full py-8 md:py-10 font-display font-black uppercase tracking-tight text-center leading-none text-[clamp(1.4rem,3.4vw,2.8rem)] transition-colors duration-200 text-strong ${pop}`}
                >
                  {item.prompt}
                </button>

                {/* grid-rows 0fr -> 1fr: height animates without measurement */}
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  aria-hidden={!open}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col items-center gap-6 pb-10">
                      <p className="font-serif-display italic text-soft text-lg md:text-xl text-center">
                        <span aria-hidden="true" style={{ color: popText }}>
                          {'— '}
                        </span>
                        {item.caption}
                      </p>
                      {/* endless marquee; hover pauses it */}
                      <div className="w-full overflow-hidden">
                        <div className="bp-track flex gap-5 w-max">
                          {(() => {
                            const real = item.images.map((src) => ({ src }))
                            const fill = Array.from({ length: Math.max(0, 6 - real.length) }, () => ({ src: null as string | null }))
                            const slides = [...real, ...fill]
                            return [...slides, ...slides].map((slide, k) =>
                              slide.src ? (
                                /* Uniform padded tile: mixed portrait/landscape
                                   shots cover-crop to one box size. */
                                <div
                                  key={k}
                                  className="h-44 md:h-56 w-56 md:w-72 shrink-0 rounded-2xl border border-line-soft bg-surface-2/60 p-2"
                                >
                                  <img
                                    src={slide.src}
                                    alt=""
                                    loading="lazy"
                                    draggable={false}
                                    className="w-full h-full rounded-xl object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  key={k}
                                  className="h-44 md:h-56 w-56 md:w-72 shrink-0 rounded-2xl border border-dashed border-line-soft flex items-center justify-center"
                                >
                                  <span className="font-hand text-xl text-soft">{b.placeholderNote}</span>
                                </div>
                              ),
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/**
 * RootedShowcase — section 4 (dark). Her shipped app, Rooted (rootedplant.org).
 *
 * Two parts, both taken from the product's own marketing surfaces:
 *  1. The eight designed App Store screenshots in a slow continuous marquee
 *     (duplicated list + CSS keyframe loop; the global reduced-motion rule
 *     freezes it, leaving a static row).
 *  2. The live site's "How it works" trio: three deep-green step cards with
 *     the exact copy from rootedplant.org's second section.
 */
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'
import { UnderlineAccent } from '../primitives/UnderlineAccent'
import { PillButton } from '../primitives/PillButton'

const SHOTS = Array.from({ length: 8 }, (_, i) => `/rooted/shot-${String(i + 1).padStart(2, '0')}.webp`)

export function RootedShowcase() {
  const r = draft.rooted
  return (
    <section aria-label={r.ariaLabel} className="force-dark bg-surface-0 border-t border-line-soft overflow-x-clip">
      <style>{`
        @keyframes rooted-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] pt-24 md:pt-32 flex flex-col gap-4">
        <SectionTag>{r.tag}</SectionTag>
        <h2 className="font-serif-display font-semibold text-strong tracking-tight leading-[1.05] text-[clamp(2rem,4.2vw,3.4rem)] max-w-4xl">
          {r.headline.map((seg, i) =>
            seg.underline ? (
              <UnderlineAccent key={i}>{seg.text}</UnderlineAccent>
            ) : (
              <span key={i}>{seg.text}</span>
            ),
          )}
        </h2>
        <p className="font-sans text-lg text-soft max-w-2xl">{r.subline}</p>
      </div>

      {/* App Store screenshot marquee, with the site's black edge fades */}
      <div className="mt-14 relative overflow-hidden" role="img" aria-label={r.shotsAriaLabel}>
        {/* side vignettes: screenshots emerge from black on both edges */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[24vw] z-10 bg-gradient-to-r from-[#0b0c0e] via-[#0b0c0e]/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-[24vw] z-10 bg-gradient-to-l from-[#0b0c0e] via-[#0b0c0e]/75 to-transparent"
        />
        <div
          className="flex gap-8 w-max pr-8"
          style={{ animation: 'rooted-marquee 55s linear infinite' }}
        >
          {[...SHOTS, ...SHOTS].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              width={480}
              height={1039}
              loading="lazy"
              draggable={false}
              className="h-[440px] md:h-[70vh] md:max-h-[680px] w-auto rounded-2xl border border-line-soft shadow-[var(--shadow-card)]"
            />
          ))}
        </div>
      </div>

      {/* How it works — the live site's second section, verbatim */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-20 md:py-24 flex flex-col gap-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {r.steps.map((st) => (
            <article
              key={st.step}
              className="flex flex-col gap-4 rounded-2xl p-7 bg-[#16281c] border border-[#f5f0e8]/10"
            >
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#f5f0e8]/60">
                {st.step}
              </p>
              <h3 className="font-sans font-semibold text-xl tracking-tight text-[#f5f0e8]">
                {st.title}
              </h3>
              <p className="font-sans text-[15px] leading-relaxed text-[#f5f0e8]/85">{st.body}</p>
            </article>
          ))}
        </div>

        <div>
          <PillButton href={r.ctaHref} variant="outline" ariaLabel={r.ctaLabel}>
            {r.ctaLabel}
          </PillButton>
        </div>
      </div>
    </section>
  )
}

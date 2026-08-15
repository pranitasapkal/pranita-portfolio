/**
 * Writing — single card linking to Medium post.
 * External link, opens in new tab with rel="noopener noreferrer".
 */
import { ArrowCircle } from '../primitives/ArrowCircle'
import { PillTag } from '../primitives/PillTag'
import { site } from '../../content/site'

export function Writing() {
  const { eyebrow, essay } = site.writing
  return (
    <section
      className="bg-ink-0 border-t border-line py-20 md:py-24 px-6 md:px-12"
    >
      <div className="max-w-[1200px] mx-auto">
        <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mb-10">
          {eyebrow}
        </p>

        <a
          href={essay.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start justify-between gap-6 bg-ink-1 border border-line rounded-xl p-6 md:p-8
                     hover:border-signal/30 transition-colors duration-200 max-w-2xl
                     focus-visible:outline-signal focus-visible:outline-2"
          aria-label={essay.ariaLabel}
        >
          <div className="flex flex-col gap-3 min-w-0">
            <PillTag>{essay.tag}</PillTag>
            <h3 className="font-display font-black text-xl md:text-2xl text-text-hi leading-snug tracking-tight">
              {essay.title}
            </h3>
            <p className="font-body text-sm text-text-lo leading-relaxed max-w-md">
              {essay.blurb}
            </p>
            <span className="font-mono text-[10px] text-text-lo tracking-wider">
              {essay.source}
            </span>
          </div>
          <ArrowCircle size={44} className="shrink-0 mt-1 text-text-hi" />
        </a>
      </div>
    </section>
  )
}

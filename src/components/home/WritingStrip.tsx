/**
 * WritingStrip — "INDEPENDENT WRITING" (Sandeep ref): a single serif quote
 * card linking to the real Medium essay. Whole card is the link.
 */
import { site } from '../../content/site'
import { draft } from '../../content/site-v2-draft'
import { SectionTag } from '../primitives/SectionTag'
import { MetaLine } from '../primitives/MetaLine'

export function WritingStrip() {
  const essay = site.writing.essay
  return (
    <section aria-label={draft.writing.tag} className="force-dark bg-surface-0">
      <div className="max-w-[1800px] mx-auto px-6 md:px-[6vw] py-24 md:py-32 flex flex-col gap-8">
        <SectionTag>{draft.writing.tag}</SectionTag>
        <a
          href={essay.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={essay.ariaLabel}
          className="group rounded-3xl bg-accent-deep text-accent-ink p-10 md:p-14 flex flex-col gap-6 max-w-3xl transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1"
        >
          <p className="font-serif-display font-semibold leading-[1.15] text-[clamp(1.5rem,3.2vw,2.4rem)]">
            “{essay.title}”
          </p>
          <p className="font-sans text-[15px] opacity-90 leading-relaxed">{essay.blurb}</p>
          <MetaLine parts={[essay.tag, essay.source]} className="!text-current opacity-80" />
        </a>
      </div>
    </section>
  )
}

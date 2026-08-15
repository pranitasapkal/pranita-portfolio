/**
 * SecondaryWork — id="secondary-work". Dark section, compact cards.
 * No detail pages — display only. Five entries: 2 Valmo + 3 pre-Meesho.
 * Pre-Meesho cards carry an "EARLIER WORK" PillTag.
 */
import { SectionLabel } from '../primitives/SectionLabel'
import { PillTag } from '../primitives/PillTag'
import { site } from '../../content/site'
import type { SecondaryCard } from '../../content/site'

function WorkCard({ card }: { card: SecondaryCard }) {
  return (
    <div className="flex flex-col gap-3 bg-ink-1 border border-line rounded-xl p-5 md:p-6">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {card.earlier && (
          <PillTag className="border-signal/30 text-signal/60 text-[9px]">
            {site.secondaryWork.earlierTag}
          </PillTag>
        )}
        {card.tags.map((t) => (
          <PillTag key={t} className="text-[10px]">{t}</PillTag>
        ))}
      </div>
      {/* Title */}
      <h3 className="font-display font-black text-lg md:text-xl text-text-hi leading-snug tracking-tight">
        {card.title}
      </h3>
      {/* Description */}
      <p className="font-body text-sm text-text-lo leading-relaxed">
        {card.desc}
      </p>
    </div>
  )
}

export function SecondaryWork() {
  return (
    <section
      className="bg-ink-0 border-t border-line py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel
          number={site.secondaryWork.sectionNumber}
          label={site.secondaryWork.sectionLabel}
          className="mb-14"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {site.secondaryWork.items.map((card) => (
            <WorkCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

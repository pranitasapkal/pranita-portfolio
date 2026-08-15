/**
 * SecondaryWork — id="secondary-work". Dark section, compact cards.
 * No detail pages — display only. Five entries: 2 Valmo + 3 pre-Meesho.
 * Pre-Meesho cards carry an "EARLIER WORK" PillTag.
 */
import { SectionLabel } from '../primitives/SectionLabel'
import { PillTag } from '../primitives/PillTag'

interface SecondaryCard {
  title: string
  desc: string
  tags: string[]
  earlier?: boolean
}

const SECONDARY_WORK: SecondaryCard[] = [
  {
    title: 'Dispute-flow Redesign',
    desc: 'Hundreds of disputes weekly — reordered by real frequency and made proof-gated. Removed the assumption that every dispute type deserves equal visual weight.',
    tags: ['Valmo', 'Mobile', 'Transporter-facing'],
  },
  {
    title: 'Transporter Trips Panel',
    desc: 'Five-tab trip lifecycle — Pending, Upcoming, In-Transit, Completed, Cancelled — with live GPS states and one primary CTA per row throughout.',
    tags: ['Valmo', 'Desktop panel', 'Lifecycle UX'],
  },
  {
    title: 'Tibil Website',
    desc: 'End-to-end product website design for a B2B fintech startup — information architecture, visual system, and responsive layout.',
    tags: ['Website', 'B2B'],
    earlier: true,
  },
  {
    title: 'Evaluationz Website',
    desc: 'Brand and product website for an HR-tech platform. Designed the full component library and led visual direction.',
    tags: ['Website', 'HR-tech'],
    earlier: true,
  },
  {
    title: 'Huntment Ride',
    desc: 'Multi-service ride-hailing app concept covering ride booking, package delivery, and rental modes within a single flow architecture.',
    tags: ['Mobile app', 'Multi-service'],
    earlier: true,
  },
]

function WorkCard({ card }: { card: SecondaryCard }) {
  return (
    <div className="flex flex-col gap-3 bg-ink-1 border border-line rounded-xl p-5 md:p-6">
      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {card.earlier && (
          <PillTag className="border-signal/30 text-signal/60 text-[9px]">EARLIER WORK</PillTag>
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
        <SectionLabel number="03" label="MORE WORK" className="mb-14" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SECONDARY_WORK.map((card) => (
            <WorkCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

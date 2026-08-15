/**
 * TldrBlock — "60-SECOND READ" labeled block immediately under hero.
 * Problem sentence, 3 StatCallouts from outcomes, summary paragraph.
 * Visually distinct: ink-1 card with signal hairline top border.
 */
import { SectionLabel } from '../primitives/SectionLabel'
import { Asterisk } from '../primitives/Asterisk'

interface TldrBlockProps {
  problem: string
  outcomes: string[]
  summary: string
  stats?: { value: string; fuzzed?: boolean }[]
}

export function TldrBlock({ problem, outcomes, summary, stats }: TldrBlockProps) {
  // Per-case curated display values; index marks when a case provides none.
  const outcomeStats = outcomes.slice(0, 3).map((label, i) => ({
    value: stats?.[i]?.value ?? `0${i + 1}`,
    fuzzed: stats?.[i]?.fuzzed ?? false,
    label,
  }))

  return (
    <section
      className="w-full border-t-2 border-signal bg-ink-1"
      aria-label="60-second read"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-10">
        <SectionLabel number="00" label="60-second read" />

        {/* Problem */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widest uppercase text-text-lo">
            The problem
          </span>
          <p className="font-serif italic text-xl md:text-2xl text-text-hi leading-snug max-w-[60ch]">
            {problem}
          </p>
        </div>

        {/* Outcome stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-line pt-8">
          {outcomeStats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-mono text-signal text-3xl md:text-4xl font-medium leading-none tabular-nums">
                {stat.value}
                {stat.fuzzed && <Asterisk />}
              </span>
              <span className="font-body text-text-lo text-sm leading-snug max-w-[24ch]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <p className="font-body text-text-hi leading-relaxed text-base max-w-[65ch] border-t border-line pt-8">
          {summary}
        </p>
      </div>
    </section>
  )
}

/**
 * StatRow block — horizontal row of StatCallout items.
 * Renders 1–4 stats with signal values and mono labels.
 */
import { StatCallout } from '../../primitives/StatCallout'
import type { StatItem } from '../../../content/types'

interface StatRowProps {
  stats: StatItem[]
}

export function StatRow({ stats }: StatRowProps) {
  return (
    <div
      className="flex flex-wrap gap-8 py-6 border-y border-line"
      role="group"
      aria-label="Key metrics"
    >
      {stats.map((stat, i) => (
        <StatCallout
          key={i}
          value={stat.value}
          label={stat.label}
          fuzzed={stat.fuzzed}
        />
      ))}
    </div>
  )
}

/**
 * HeroStats — giant stat trio/row (ADR-002). Reference: Ashish Ranjan's
 * "4% → 7% → +75%" band: numbers huge, labels quiet, optional sub-note.
 */
import { useReveal } from './useReveal'

interface HeroStatsProps {
  items: { value: string; label: string; sub?: string }[]
}

/* Compact tinted tiles, one reference accent each (Manav, 2026-08-16).
   Values use the text-safe -deep variants; tints are 8% washes of the raws. */
const TILE = [
  { value: 'text-pop-blue', bg: 'bg-pop-blue/8' },
  { value: 'text-pop-red-deep', bg: 'bg-pop-red/8' },
  { value: 'text-pop-green-deep', bg: 'bg-pop-green/8' },
  { value: 'text-pop-purple-deep', bg: 'bg-pop-purple/8' },
  { value: 'text-pop-yellow-deep', bg: 'bg-pop-yellow/10' },
]

export function HeroStats({ items }: HeroStatsProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="grid gap-4 py-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        const tone = TILE[i % TILE.length]
        return (
          <div
            key={i}
            className={`flex flex-col gap-1.5 min-w-0 rounded-2xl border border-line p-5 md:p-6 ${tone.bg}`}
          >
            <span
              className={`font-display font-black tracking-tight ${tone.value} text-3xl md:text-4xl leading-none break-words max-w-full`}
            >
              {it.value}
            </span>
            <span className="font-body font-medium text-sm text-text-hi">{it.label}</span>
            {it.sub && <span className="font-mono text-xs text-text-lo">{it.sub}</span>}
          </div>
        )
      })}
    </div>
  )
}

/**
 * HeroStats — giant stat trio/row (ADR-002). Reference: Ashish Ranjan's
 * "4% → 7% → +75%" band: numbers huge, labels quiet, optional sub-note.
 */
import { useReveal } from './useReveal'

interface HeroStatsProps {
  items: { value: string; label: string; sub?: string }[]
}

export function HeroStats({ items }: HeroStatsProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className="grid gap-10 py-10 md:py-14 text-center"
      style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))` }}
    >
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-2 min-w-0">
          <span className="font-display font-black tracking-tight text-signal text-4xl md:text-6xl lg:text-7xl leading-none break-words max-w-full">
            {it.value}
          </span>
          <span className="font-body text-sm md:text-base text-text-hi">{it.label}</span>
          {it.sub && <span className="font-mono text-xs text-text-lo">{it.sub}</span>}
        </div>
      ))}
    </div>
  )
}

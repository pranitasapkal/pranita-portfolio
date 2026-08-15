/**
 * TimelineBlock — horizontal iteration/roadmap timeline (ADR-002).
 * Reference: PlanIQ's sprint roadmap — gradient segments with pills
 * alternating above/below the track.
 */
import { useReveal } from './useReveal'

interface TimelineBlockProps {
  items: { label: string; sub?: string }[]
}

export function TimelineBlock({ items }: TimelineBlockProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="py-6 overflow-x-auto">
      <ol className="flex items-stretch gap-0 min-w-[640px]">
        {items.map((it, i) => {
          const above = i % 2 === 0
          const last = i === items.length - 1
          return (
            <li key={i} className="flex-1 flex flex-col items-center gap-0 min-w-0">
              {/* pill above */}
              <div className={`h-16 flex items-end pb-2 ${above ? '' : 'invisible'}`}>
                <Pill label={it.label} sub={it.sub} final={last} />
              </div>
              {/* track segment */}
              <div className="w-full flex items-center">
                <div
                  className="h-2.5 w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, rgba(255,181,71,${0.25 + (i / Math.max(items.length - 1, 1)) * 0.75}) 0%, rgba(255,181,71,${0.25 + ((i + 1) / Math.max(items.length - 1, 1)) * 0.75}) 100%)`,
                  }}
                  aria-hidden="true"
                />
                {!last && <div className="w-3 shrink-0" aria-hidden="true" />}
              </div>
              {/* pill below */}
              <div className={`h-16 flex items-start pt-2 ${above ? 'invisible' : ''}`}>
                <Pill label={it.label} sub={it.sub} final={last} />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Pill({ label, sub, final }: { label: string; sub?: string; final?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 rounded-lg border px-3 py-1.5 text-center max-w-[150px] ${
        final ? 'border-signal bg-signal/10' : 'border-line bg-ink-1'
      }`}
    >
      <span className={`font-mono text-[11px] tracking-wide ${final ? 'text-signal' : 'text-text-hi'}`}>
        {label}
      </span>
      {sub && <span className="font-mono text-[10px] text-text-lo">{sub}</span>}
    </div>
  )
}

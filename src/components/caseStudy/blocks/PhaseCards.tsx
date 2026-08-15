/**
 * PhaseCards — process-phase / level cards with tag pills (ADR-002).
 * Reference: PlanIQ's "Problem Discovery / Problem Definition …" card grid.
 */
import { useReveal } from './useReveal'

interface PhaseCardsProps {
  items: { step?: string; title: string; body: string; tags?: string[] }[]
}

export function PhaseCards({ items }: PhaseCardsProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-4">
      {items.map((it, i) => (
        <article
          key={i}
          className="flex flex-col gap-4 p-6 rounded-xl border border-line bg-ink-1 hover:border-signal/30 transition-colors duration-300"
        >
          {it.step && (
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-line px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-text-lo">
                {it.step}
              </span>
            </span>
          )}
          <h3 className="font-display font-black text-xl text-text-hi tracking-tight">
            {it.title}
          </h3>
          <p className="font-body text-sm text-text-lo leading-relaxed">{it.body}</p>
          {it.tags && it.tags.length > 0 && (
            <div className="mt-auto pt-2 flex flex-wrap gap-2">
              {it.tags.map((t, j) => (
                <span
                  key={j}
                  className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-wide ${
                    j === 0
                      ? 'bg-signal/15 text-signal'
                      : 'border border-line text-text-lo'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

/**
 * WordList — big vertical word list with one highlighted row (ADR-002).
 * Reference: ASM/Vaultix value-prop list ("Centralized visibility / Attack
 * surface monitoring / …") where the active row is dark and the rest recede.
 */
import { useReveal } from './useReveal'

interface WordListProps {
  title?: string
  items: { word: string; note?: string }[]
  highlight?: number
}

export function WordList({ title, items, highlight = 0 }: WordListProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="flex flex-col gap-6 py-4">
      {title && (
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-text-lo">{title}</span>
      )}
      <ul className="flex flex-col">
        {items.map((it, i) => {
          const active = i === highlight
          return (
            <li
              key={i}
              className={`md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,40ch)] md:items-baseline flex flex-col gap-1 md:gap-x-10 py-4 border-b border-line ${
                active ? '' : 'opacity-60'
              }`}
            >
              <span
                className={`font-display font-black tracking-tight text-xl md:text-3xl ${
                  active ? 'text-signal' : 'text-text-hi'
                }`}
              >
                {active && <span aria-hidden="true">→ </span>}
                {it.word}
              </span>
              {it.note && (
                <span className="font-body text-sm text-text-lo leading-relaxed md:max-w-[42ch]">
                  {it.note}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

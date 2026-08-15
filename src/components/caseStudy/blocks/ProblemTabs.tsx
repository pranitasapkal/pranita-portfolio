/**
 * ProblemTabs — a problem with several facets, one visible at a time (ADR-004).
 *
 * Scaffolding for the visual rebuild: correct structure and accessibility, plain styling.
 * Tabs follow the WAI-ARIA tabs pattern — roving tabindex, arrow-key navigation, and the
 * panel labelled by its tab, so this is usable by keyboard before anyone restyles it.
 */
import { useId, useRef, useState } from 'react'
import { useReveal } from './useReveal'
import { Text } from './Text'

interface ProblemTabsProps {
  items: { label: string; body: string }[]
}

export function ProblemTabs({ items }: ProblemTabsProps) {
  const ref = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (!items.length) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1
    let next: number | null = null
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <div role="tablist" aria-label="Facets of the problem" className="flex flex-wrap gap-2" onKeyDown={onKeyDown}>
        {items.map((item, i) => {
          const selected = i === active
          return (
            <button
              key={item.label}
              ref={(el) => { tabRefs.current[i] = el }}
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={[
                'font-mono text-xs tracking-wider rounded-full px-4 py-2 border transition-colors duration-200',
                selected
                  ? 'bg-signal text-ink-0 border-transparent'
                  : 'text-text-lo border-line hover:text-text-hi hover:border-text-lo',
              ].join(' ')}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item, i) => (
        <div
          key={item.label}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
        >
          {/* Rendered through Text so a tab body behaves like every other body:
              blank lines become paragraphs, and **bold** / {*} markers work. */}
          <Text body={item.body} />
        </div>
      ))}
    </div>
  )
}

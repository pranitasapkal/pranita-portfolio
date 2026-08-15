/**
 * BeforeAfter — labelled toggle between the state before the work and after it (ADR-004).
 *
 * Both images stay in the DOM and are swapped by `hidden`, so the browser has already
 * decoded the second one before the toggle is pressed — no flash on switch. The control
 * is a real two-button group with pressed state, not a styled div.
 */
import { useState } from 'react'
import { useReveal } from './useReveal'

interface Side {
  src: string
  alt: string
  label: string
}

interface BeforeAfterProps {
  before: Side
  after: Side
  caption?: string
}

export function BeforeAfter({ before, after, caption }: BeforeAfterProps) {
  const ref = useReveal<HTMLElement>()
  const [showAfter, setShowAfter] = useState(false)
  const sides: [Side, Side] = [before, after]

  return (
    <figure ref={ref} className="flex flex-col gap-4 m-0">
      <div className="flex gap-2 self-center rounded-full border border-line p-1">
        {sides.map((side, i) => {
          const active = (i === 1) === showAfter
          return (
            <button
              key={side.label}
              type="button"
              aria-pressed={active}
              onClick={() => setShowAfter(i === 1)}
              className={[
                'font-mono text-xs tracking-wider rounded-full px-5 py-1.5 transition-colors duration-200',
                active ? 'bg-signal text-ink-0' : 'text-text-lo hover:text-text-hi',
              ].join(' ')}
            >
              {side.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl overflow-hidden border border-line bg-ink-1">
        {sides.map((side, i) => (
          <img
            key={side.src}
            src={side.src}
            alt={side.alt}
            hidden={(i === 1) !== showAfter}
            loading="lazy"
            className="w-full h-auto block"
          />
        ))}
      </div>

      {caption && (
        <figcaption className="font-mono text-xs text-text-lo text-center">{caption}</figcaption>
      )}
    </figure>
  )
}

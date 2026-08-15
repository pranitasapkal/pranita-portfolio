/**
 * InsightNotes — research insights as a sticky-note board (ADR-004).
 * Each note is one declarative sentence; the board is a list, not a decoration,
 * so it is marked up as one and reads correctly to a screen reader.
 */
import { useReveal } from './useReveal'

interface InsightNotesProps {
  title?: string
  notes: string[]
}

export function InsightNotes({ title, notes }: InsightNotesProps) {
  const ref = useReveal<HTMLDivElement>()
  if (!notes.length) return null

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {title && (
        <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase">{title}</p>
      )}
      <ul
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 list-none p-6 md:p-8 rounded-2xl"
        style={{
          backgroundColor: 'var(--color-ink-1)',
          backgroundImage:
            'radial-gradient(circle, rgba(237,239,243,0.10) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {notes.map((note) => (
          <li
            key={note}
            className="rounded-sm px-4 py-4 font-body text-sm leading-relaxed shadow-sm"
            style={{ backgroundColor: 'var(--color-signal)', color: 'var(--color-ink-0)' }}
          >
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * AnnotatedShot — one screen plus numbered callouts, each naming a change and why (ADR-004).
 *
 * The callouts are a numbered list beside the image rather than absolutely-positioned pins:
 * pins break at small widths and are unreadable to a screen reader. The numbering carries
 * the association, so the block degrades to a legible list on a narrow screen.
 */
import { useReveal } from './useReveal'

interface AnnotatedShotProps {
  src: string
  alt: string
  caption?: string
  notes: { title?: string; body: string }[]
}

export function AnnotatedShot({ src, alt, caption, notes }: AnnotatedShotProps) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref} className="grid lg:grid-cols-[3fr_2fr] gap-6 lg:gap-10 items-start">
      <figure className="m-0 flex flex-col gap-3">
        <div className="rounded-2xl overflow-hidden border border-line bg-ink-1">
          <img src={src} alt={alt} loading="lazy" className="w-full h-auto block" />
        </div>
        {caption && (
          <figcaption className="font-mono text-xs text-text-lo">{caption}</figcaption>
        )}
      </figure>

      <ol className="flex flex-col gap-5 list-none p-0 m-0">
        {notes.map((note, i) => (
          <li key={note.body} className="flex gap-3">
            <span
              className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-signal text-ink-0 font-mono text-[11px] tabular-nums"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              {note.title && (
                <p className="font-body font-medium text-sm text-text-hi leading-snug">
                  {note.title}
                </p>
              )}
              <p className="font-body text-sm text-text-lo leading-relaxed">{note.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

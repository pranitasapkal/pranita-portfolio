/**
 * NdaNote — the NDA boundary, stated openly rather than implied by omission (ADR-004).
 * Used where a number exists but belongs to a wider programme, or cannot be published at all.
 */
import { useReveal } from './useReveal'

interface NdaNoteProps {
  title: string
  body: string
}

export function NdaNote({ title, body }: NdaNoteProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <aside
      ref={ref}
      className="rounded-2xl border border-dashed border-line bg-ink-1 px-6 py-6 md:px-8 md:py-7"
    >
      <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mb-3">{title}</p>
      <p className="font-body text-sm md:text-base text-text-lo leading-relaxed max-w-3xl">{body}</p>
    </aside>
  )
}

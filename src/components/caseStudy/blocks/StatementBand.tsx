/**
 * StatementBand — full-width band carrying the problem statement / how-might-we (ADR-004).
 * The one place in a chapter where the page stops and states the question it is answering.
 */
import { useReveal } from './useReveal'

interface StatementBandProps {
  eyebrow: string
  statement: string
}

export function StatementBand({ eyebrow, statement }: StatementBandProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className="rounded-2xl border border-signal/25 bg-signal/5 px-6 py-8 md:px-10 md:py-10">
      <p className="font-mono text-[10px] text-signal tracking-[0.25em] uppercase mb-4">{eyebrow}</p>
      <p className="font-display font-black text-xl md:text-3xl text-text-hi leading-snug tracking-tight max-w-3xl">
        {statement}
      </p>
    </div>
  )
}

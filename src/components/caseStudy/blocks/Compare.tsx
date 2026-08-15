/**
 * Compare block — before / after two-column card pair.
 */
interface CompareProps {
  before: { label: string; body: string }
  after: { label: string; body: string }
}

export function Compare({ before, after }: CompareProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line rounded-lg overflow-hidden border border-line">
      <div className="bg-ink-1 p-6 flex flex-col gap-3">
        <span className="font-mono text-xs tracking-widest uppercase text-text-lo">
          {before.label}
        </span>
        <p className="font-body text-text-hi leading-relaxed text-sm">{before.body}</p>
      </div>
      <div className="bg-ink-1 p-6 flex flex-col gap-3 border-l-0 md:border-l border-line">
        <span className="font-mono text-xs tracking-widest uppercase text-signal">
          {after.label}
        </span>
        <p className="font-body text-text-hi leading-relaxed text-sm">{after.body}</p>
      </div>
    </div>
  )
}

/**
 * MetaLine — the mono small-caps meta layer (`VALMO · DOMAIN · 2025`).
 * Research pattern #2: a systemized micro-type layer separate from body copy.
 * Optional status badge (`LIVE`, `IN BUILD`) per the Debodyuti ref.
 */
interface MetaLineProps {
  parts: string[]
  status?: string
  /** 'soft' inherits surface context; 'band' renders on the dark folds. */
  tone?: 'soft' | 'band'
  className?: string
}

export function MetaLine({ parts, status, tone = 'soft', className = '' }: MetaLineProps) {
  const text = tone === 'band' ? 'text-band-soft' : 'text-soft'
  return (
    <p
      className={`font-mono text-[11px] tracking-[0.18em] uppercase ${text} flex items-center flex-wrap gap-x-2 gap-y-1 ${className}`}
    >
      {parts.map((p, i) => (
        <span key={p + i} className="flex items-center gap-x-2">
          {i > 0 && <span aria-hidden="true">·</span>}
          <span>{p}</span>
        </span>
      ))}
      {status && (
        <span className="ml-1 rounded-full border border-current px-2 py-0.5 text-[9px] tracking-[0.2em]">
          {status}
        </span>
      )}
    </p>
  )
}

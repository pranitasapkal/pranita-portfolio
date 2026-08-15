/**
 * Rejected block — "what I rejected and why" list.
 * Each item shows a struck-through route-line motif for the pattern,
 * and a reason in text-lo.
 */
interface RejectedItem {
  pattern: string
  reason: string
}

interface RejectedProps {
  items: RejectedItem[]
}

export function Rejected({ items }: RejectedProps) {
  return (
    <div className="flex flex-col gap-0 border border-line rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-ink-2 border-b border-line">
        <span className="font-mono text-xs tracking-widest uppercase text-text-lo">
          What I rejected
        </span>
      </div>
      <ul className="divide-y divide-line">
        {items.map((item, i) => (
          <li key={i} className="flex flex-col gap-1.5 px-5 py-4 bg-ink-1">
            <div className="flex items-center gap-3">
              {/* Route-line strike motif */}
              <svg width="24" height="10" viewBox="0 0 24 10" aria-hidden="true" className="shrink-0 text-text-lo/40">
                <line x1="0" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="22" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
              <span className="font-mono text-sm text-text-lo line-through decoration-text-lo/40">
                {item.pattern}
              </span>
            </div>
            <p className="font-body text-sm text-text-lo/80 leading-relaxed pl-9">
              {item.reason}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Numbered mono badge row: dark circle with number + pill label.
 * Example: "01 / SELECTED SYSTEMS"
 */
interface SectionLabelProps {
  number: string
  label: string
  className?: string
}

export function SectionLabel({ number, label, className = '' }: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={`Section ${number}: ${label}`}
    >
      {/* Number circle */}
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-ink-2 border border-line font-mono text-xs text-text-lo shrink-0">
        {number}
      </span>
      {/* Divider + label pill */}
      <span className="flex items-center gap-2">
        <span className="font-mono text-text-lo text-xs">/</span>
        <span className="font-mono text-xs tracking-widest uppercase text-text-lo border border-line rounded-full px-3 py-0.5">
          {label}
        </span>
      </span>
    </div>
  )
}

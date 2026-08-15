/**
 * Small mono tag pill with border-line stroke.
 */
interface PillTagProps {
  children: React.ReactNode
  className?: string
}

export function PillTag({ children, className = '' }: PillTagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full border border-line font-mono text-xs text-text-lo tracking-wider ${className}`}
    >
      {children}
    </span>
  )
}

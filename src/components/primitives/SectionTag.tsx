/**
 * SectionTag — small-caps mono section label ("SELECTED WORK", "HOW I WORK").
 * Optionally prefixed by a small inline mark (e.g. the Figma logo slot).
 */
import type { ReactNode } from 'react'

interface SectionTagProps {
  children: ReactNode
  mark?: ReactNode
  tone?: 'soft' | 'band'
  className?: string
}

export function SectionTag({ children, mark, tone = 'soft', className = '' }: SectionTagProps) {
  const text = tone === 'band' ? 'text-band-soft' : 'text-soft'
  return (
    <p
      className={`font-mono text-[11px] font-medium tracking-[0.22em] uppercase ${text} flex items-center gap-2 ${className}`}
    >
      {mark && (
        <span aria-hidden="true" className="inline-flex">
          {mark}
        </span>
      )}
      {children}
    </p>
  )
}

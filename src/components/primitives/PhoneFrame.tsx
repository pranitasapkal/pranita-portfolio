/**
 * CSS phone device frame.
 * Rounded-[2rem] with notch bar. Children = screenshot img slot.
 */
import type { ReactNode } from 'react'

interface PhoneFrameProps {
  children: ReactNode
  className?: string
}

export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden border border-line bg-ink-1 shadow-2xl ${className}`}
      style={{ maxWidth: 320 }}
    >
      {/* Notch bar */}
      <div
        className="flex items-center justify-center h-7 bg-ink-2 border-b border-line"
        aria-hidden="true"
      >
        <span className="w-16 h-1.5 rounded-full bg-ink-0" />
      </div>
      {/* Content slot */}
      <div className="w-full overflow-hidden">{children}</div>
      {/* Home indicator */}
      <div
        className="flex items-center justify-center h-6 bg-ink-2 border-t border-line"
        aria-hidden="true"
      >
        <span className="w-24 h-1 rounded-full bg-line" />
      </div>
    </div>
  )
}

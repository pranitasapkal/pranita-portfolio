/**
 * CSS browser device frame.
 * Rounded-xl chrome bar with 3 dots + URL-ish mono slug.
 * Children = screenshot img slot.
 */
import type { ReactNode } from 'react'

interface BrowserFrameProps {
  slug?: string
  children: ReactNode
  className?: string
}

export function BrowserFrame({ slug = 'pranita.design', children, className = '' }: BrowserFrameProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-line bg-ink-1 shadow-2xl ${className}`}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-ink-2 border-b border-line">
        {/* Traffic lights */}
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        {/* URL bar */}
        <div className="flex-1 flex justify-center">
          <span className="font-mono text-xs text-text-lo bg-ink-1 rounded px-3 py-1 border border-line max-w-xs truncate">
            {slug}
          </span>
        </div>
      </div>
      {/* Content slot */}
      <div className="w-full overflow-hidden">{children}</div>
    </div>
  )
}

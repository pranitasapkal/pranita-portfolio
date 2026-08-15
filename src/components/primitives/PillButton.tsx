/**
 * PillButton — v2 pill CTA. Solid (dark on light / light on dark surfaces via
 * semantic tokens) and outline variants, per the Sandeep hero ref.
 * Renders <a> when href is given, <button> otherwise.
 */
import type { ReactNode, MouseEventHandler } from 'react'

interface PillButtonProps {
  children: ReactNode
  variant?: 'solid' | 'outline'
  href?: string
  onClick?: MouseEventHandler
  download?: boolean
  ariaLabel?: string
  className?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans font-semibold text-[15px] leading-none transition-colors duration-200 select-none'

const VARIANTS = {
  solid: 'bg-strong text-surface-0 hover:bg-strong/85',
  outline: 'border border-line-soft text-strong bg-surface-2 hover:border-strong/40',
} as const

export function PillButton({
  children,
  variant = 'solid',
  href,
  onClick,
  download,
  ariaLabel,
  className = '',
}: PillButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`
  if (href) {
    return (
      <a href={href} onClick={onClick} download={download} aria-label={ariaLabel} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  )
}

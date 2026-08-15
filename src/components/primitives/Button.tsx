/**
 * Pill button with TEXT-ROLL hover effect.
 * Duplicated label in overflow-hidden flex-col translates -50% on hover.
 * Variants: solid (bg-signal text-ink-0) | ghost (border-line text-text-hi).
 * Renders <a> when href is provided, <button> otherwise.
 * Focus-visible ring preserved via global :focus-visible in base.css.
 */
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'solid' | 'ghost'

interface ButtonBaseProps {
  variant?: ButtonVariant
  className?: string
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: 'bg-signal text-ink-0 border-transparent hover:bg-signal/90',
  ghost: 'bg-transparent text-text-hi border-line hover:border-text-lo',
}

function Inner({ children }: { children: React.ReactNode }) {
  return (
    /* overflow-hidden clips to one row height */
    <span className="flex overflow-hidden h-[1.2em] items-start pointer-events-none select-none">
      {/* flex-col stack: visible copy on top, hidden copy below */}
      <span
        className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2"
        aria-hidden="true"
      >
        <span className="leading-[1.2em]">{children}</span>
        <span className="leading-[1.2em]">{children}</span>
      </span>
    </span>
  )
}

export function Button({ variant = 'solid', className = '', children, ...rest }: ButtonProps) {
  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono tracking-wider border transition-colors duration-200'
  const variantClass = VARIANT_CLASSES[variant]
  const combined = `${base} ${variantClass} ${className}`

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as ButtonAsAnchor
    return (
      <a href={href} className={combined} {...anchorRest}>
        <Inner>{children}</Inner>
      </a>
    )
  }

  const buttonRest = rest as ButtonAsButton
  return (
    <button className={combined} {...buttonRest}>
      <Inner>{children}</Inner>
    </button>
  )
}

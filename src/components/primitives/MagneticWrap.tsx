/**
 * Magnetic hover wrapper.
 * Tracks cursor within bounding rect + padding radius, translates element
 * toward cursor. Inert under prefers-reduced-motion and on touch devices.
 *
 * strength: divisor applied to cursor delta (higher = weaker pull, default 3).
 */
import { useRef, useCallback, type ReactNode } from 'react'

interface MagneticWrapProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticWrap({ children, strength = 3, className = '' }: MagneticWrapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  // Check once at component level (values don't change during lifetime)
  const isTouch =
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = wrapRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / strength
      const dy = (e.clientY - cy) / strength
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
      el.style.transition = 'transform 0.3s ease-out'
    },
    [strength],
  )

  const handleMouseLeave = useCallback(() => {
    const el = wrapRef.current
    if (!el) return
    el.style.transform = 'translate3d(0, 0, 0)'
    el.style.transition = 'transform 0.6s ease-in-out'
  }, [])

  if (isTouch || prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

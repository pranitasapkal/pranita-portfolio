/**
 * DragCard — the hero's interactive card deck (Sandeep "drag to solve" ref).
 *
 * A small stack of typographic cards. The top card can be dragged with a fine
 * pointer; release past a threshold flings it off and it re-enters at the back
 * of the deck. Two chip actions: Peek (fans the deck open briefly) and Shuffle
 * (cycles to the next card). Placeholder art is typographic — Pranita swaps
 * the deck content (or images) later via site-v2-draft.ts.
 *
 * Reduced motion / touch: dragging is disabled; the deck renders as a static
 * stack and Shuffle still works as an instant, discrete state change.
 */
import { useRef, useState, useCallback } from 'react'
import { gsap } from '../../lib/gsap'
import { EASE } from '../../lib/motion'
import { useHasFinePointer, usePrefersReducedMotion } from '../../lib/useMediaQuery'
import { draft } from '../../content/site-v2-draft'
import type { DeckCard } from '../../content/site-v2-draft'

const TONES: Record<DeckCard['tone'], string> = {
  paper: 'bg-surface-2 text-strong border border-line-soft',
  ink: 'bg-band text-band-text border border-band-line',
  accent: 'bg-accent text-accent-ink border border-transparent',
}

/** Static offsets for the cards behind the top one. */
const STACK = [
  { x: 0, y: 0, r: 0 },
  { x: 10, y: 8, r: 2.5 },
  { x: -8, y: 14, r: -2 },
  { x: 4, y: 20, r: 1 },
]

const FLING_THRESHOLD = 90

export function DragCard() {
  const { deck, dragHint, peekLabel, shuffleLabel, deckAriaLabel } = draft.hero
  const [order, setOrder] = useState(() => deck.map((_, i) => i))
  const hostRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startY: number; dragging: boolean }>({
    startX: 0,
    startY: 0,
    dragging: false,
  })

  const finePointer = useHasFinePointer()
  const reduced = usePrefersReducedMotion()
  const interactive = finePointer && !reduced

  const cycle = useCallback(() => {
    setOrder((o) => [...o.slice(1), o[0]])
  }, [])

  const shuffle = useCallback(() => {
    const el = topRef.current
    if (!interactive || !el) {
      cycle()
      return
    }
    gsap.to(el, {
      x: 140,
      y: -30,
      rotate: 9,
      opacity: 0,
      duration: 0.28,
      ease: EASE,
      onComplete: () => {
        cycle()
        gsap.set(el, { x: 0, y: 0, rotate: 0, opacity: 1 })
        gsap.from(el, { scale: 0.94, duration: 0.3, ease: EASE })
      },
    })
  }, [interactive, cycle])

  const peek = useCallback(() => {
    const host = hostRef.current
    if (!host) return
    const cards = host.querySelectorAll<HTMLElement>('[data-deck-card]')
    if (!interactive) return
    gsap.to(cards, {
      x: (i) => STACK[Math.min(i, STACK.length - 1)].x + i * 26,
      rotate: (i) => STACK[Math.min(i, STACK.length - 1)].r + i * 3,
      duration: 0.35,
      ease: EASE,
      stagger: 0.02,
      onComplete: () => {
        gsap.to(cards, {
          x: (i) => STACK[Math.min(i, STACK.length - 1)].x,
          rotate: (i) => STACK[Math.min(i, STACK.length - 1)].r,
          delay: 0.55,
          duration: 0.4,
          ease: EASE,
        })
      },
    })
  }, [interactive])

  // ── Pointer drag on the top card (fine pointers only) ──────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!interactive) return
      const el = topRef.current
      if (!el) return
      el.setPointerCapture(e.pointerId)
      dragState.current = { startX: e.clientX, startY: e.clientY, dragging: true }
    },
    [interactive],
  )

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = dragState.current
    const el = topRef.current
    if (!s.dragging || !el) return
    const dx = e.clientX - s.startX
    const dy = e.clientY - s.startY
    gsap.set(el, { x: dx, y: dy, rotate: dx / 18 })
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = dragState.current
      const el = topRef.current
      if (!s.dragging || !el) return
      s.dragging = false
      const dx = e.clientX - s.startX
      const dy = e.clientY - s.startY
      if (Math.hypot(dx, dy) > FLING_THRESHOLD) {
        gsap.to(el, {
          x: dx * 2.4,
          y: dy * 2.4,
          rotate: dx / 8,
          opacity: 0,
          duration: 0.3,
          ease: EASE,
          onComplete: () => {
            cycle()
            gsap.set(el, { x: 0, y: 0, rotate: 0, opacity: 1 })
            gsap.from(el, { scale: 0.94, duration: 0.3, ease: EASE })
          },
        })
      } else {
        gsap.to(el, { x: 0, y: 0, rotate: 0, duration: 0.45, ease: 'elastic.out(1, 0.6)' })
      }
    },
    [cycle],
  )

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        ref={hostRef}
        role="group"
        aria-label={deckAriaLabel}
        className="relative w-[300px] h-[340px] md:w-[340px] md:h-[380px]"
      >
        {/* Render back-to-front so the first card in `order` paints on top. */}
        {[...order].reverse().map((cardIdx, revPos) => {
          const pos = order.length - 1 - revPos // 0 = top
          const card = deck[cardIdx]
          const off = STACK[Math.min(pos, STACK.length - 1)]
          const isTop = pos === 0
          return (
            <div
              key={cardIdx}
              data-deck-card
              ref={isTop ? topRef : undefined}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
              className={`absolute inset-0 rounded-3xl p-7 flex flex-col justify-between shadow-[var(--shadow-card)] ${TONES[card.tone]} ${
                isTop && interactive ? 'cursor-grab active:cursor-grabbing touch-none' : ''
              }`}
              style={{
                transform: `translate(${off.x}px, ${off.y}px) rotate(${off.r}deg)`,
                zIndex: 10 - pos,
              }}
            >
              <p className="font-hand text-xl opacity-80">{card.kicker}</p>
              <p className="font-serif-display text-[26px] md:text-[30px] leading-[1.15] font-medium">
                {card.line}
              </p>
              {isTop && interactive && (
                <p aria-hidden="true" className="font-hand text-lg opacity-60 self-end -rotate-3">
                  {dragHint} ↗
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* mt clears the back cards' stack offsets (+20px) and their shadows */}
      <div className="flex gap-3 mt-9">
        {interactive && (
          <button
            type="button"
            onClick={peek}
            className="rounded-full border border-line-soft bg-surface-2 px-4 py-1.5 font-sans text-[13px] font-semibold text-strong hover:border-strong/40 transition-colors duration-200"
          >
            {peekLabel}
          </button>
        )}
        <button
          type="button"
          onClick={shuffle}
          className="rounded-full border border-line-soft bg-surface-2 px-4 py-1.5 font-sans text-[13px] font-semibold text-strong hover:border-strong/40 transition-colors duration-200"
        >
          {shuffleLabel}
        </button>
      </div>
    </div>
  )
}

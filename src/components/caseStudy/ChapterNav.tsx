/**
 * ChapterNav — chapter step navigation.
 * Desktop: sticky left rail, signal node for active step, ScrollTrigger-driven.
 * Mobile: horizontal scrollable chip bar (sticky under main header).
 * Anchor links #step-N, keyboard focusable, aria-current="step" on active.
 */
import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from '../../lib/gsap'
import type { Chapter } from '../../content/types'

interface ChapterNavProps {
  chapters: Chapter[]
}

export function ChapterNav({ chapters }: ChapterNavProps) {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? '')
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const triggers = chapters.map((chapter) => {
      const el = document.getElementById(`step-${chapter.step}`)
      if (!el) return null

      return ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => setActiveId(chapter.id),
        onEnterBack: () => setActiveId(chapter.id),
      })
    })

    return () => {
      triggers.forEach((t) => t?.kill())
    }
  }, { scope: navRef, dependencies: [chapters] })

  return (
    <>
      {/* ── Desktop sticky rail ── */}
      <nav
        ref={navRef}
        aria-label="Chapter navigation"
        className="hidden lg:flex flex-col gap-0.5 sticky top-24 self-start min-w-[200px] max-w-[220px]"
      >
        {chapters.map((chapter) => {
          const isActive = activeId === chapter.id
          return (
            <a
              key={chapter.id}
              href={`#step-${chapter.step}`}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'group flex items-start gap-3 py-2 px-2 rounded-md transition-colors duration-200',
                isActive ? 'text-text-hi' : 'text-text-lo hover:text-text-hi',
              ].join(' ')}
            >
              {/* Node indicator */}
              <span
                className={[
                  'mt-1 w-2 h-2 rounded-full shrink-0 transition-all duration-300',
                  isActive
                    ? 'bg-signal ring-4 ring-signal/20'
                    : 'bg-line group-hover:bg-text-lo',
                ].join(' ')}
                aria-hidden="true"
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase opacity-60">
                  STEP {String(chapter.step).padStart(2, '0')}
                </span>
                <span className="font-mono text-xs leading-snug">{chapter.title}</span>
              </span>
            </a>
          )
        })}
      </nav>

      {/* ── Mobile horizontal chip bar ── */}
      <nav
        aria-label="Chapter navigation"
        className="lg:hidden sticky top-[60px] z-30 bg-ink-0/90 backdrop-blur-md border-b border-line"
      >
        <div className="overflow-x-auto scrollbar-none py-2 px-4">
          <div className="flex gap-2 min-w-max">
            {chapters.map((chapter) => {
              const isActive = activeId === chapter.id
              return (
                <a
                  key={chapter.id}
                  href={`#step-${chapter.step}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={[
                    'shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs transition-all duration-200',
                    isActive
                      ? 'border-signal/60 text-text-hi bg-signal/10'
                      : 'border-line text-text-lo hover:text-text-hi hover:border-text-lo',
                  ].join(' ')}
                >
                  <span className="opacity-50">{String(chapter.step).padStart(2, '0')}</span>
                  <span>{chapter.title}</span>
                </a>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}

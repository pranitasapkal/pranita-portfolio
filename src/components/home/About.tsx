/**
 * About — id="about".
 * Two-column on desktop: ScrollFadeParagraph left + numbered services list right.
 * Services list: hairline-separated rows, mono number, hover shifts padding-left
 * with a signal accent pip.
 */
import { ScrollFadeParagraph } from '../primitives/ScrollFadeParagraph'
import { site } from '../../content/site'

export function About() {
  return (
    <section
      id="about"
      className="bg-ink-0 border-t border-line py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-start">
        {/* Left — scroll-fade paragraphs */}
        <div>
          {site.about.paragraphs.map((para, i) => (
            <ScrollFadeParagraph
              key={i}
              className={`text-xl md:text-2xl text-text-hi leading-relaxed font-body${i > 0 ? ' mt-6' : ''}`}
            >
              {para}
            </ScrollFadeParagraph>
          ))}
        </div>

        {/* Right — services list */}
        <div className="flex flex-col">
          <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mb-4">
            {site.about.servicesHeading}
          </p>
          {site.about.services.map(({ num, label, desc }) => (
            <div
              key={num}
              className={[
                'group flex flex-col gap-1.5',
                'border-t border-line',
                'py-5',
                'pl-0 hover:pl-3',
                'transition-[padding-left] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]',
                'cursor-default',
              ].join(' ')}
            >
              <div className="flex items-baseline gap-3">
                {/* Accent pip */}
                <span
                  className="w-0 group-hover:w-1.5 h-1.5 rounded-full bg-signal shrink-0 self-center
                             transition-[width] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs text-signal tabular-nums">{num}</span>
                <span className="font-body text-text-hi text-base font-medium">{label}</span>
              </div>
              <p className="font-body text-text-lo text-sm leading-relaxed pl-6 md:pl-8 max-w-sm">
                {desc}
              </p>
            </div>
          ))}
          {/* Bottom hairline */}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  )
}

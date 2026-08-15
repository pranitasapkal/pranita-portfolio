/**
 * About — id="about".
 * Two-column on desktop: ScrollFadeParagraph left + numbered services list right.
 * Services list: hairline-separated rows, mono number, hover shifts padding-left
 * with a signal accent pip.
 */
import { ScrollFadeParagraph } from '../primitives/ScrollFadeParagraph'

const SERVICES = [
  { num: '01', label: 'Ops workbenches', desc: 'Dense situational-awareness panels for planners who need to see across a whole network at once.' },
  { num: '02', label: 'Contract lifecycle systems', desc: 'End-to-end flow design from assignment through alignment, freeze, and handoff to vendor contracts.' },
  { num: '03', label: 'Low-literacy mobile & panel UX', desc: 'Transporter-facing interfaces designed for literal readers, one-handed use, and poor network conditions.' },
  { num: '04', label: 'Design-ops tooling', desc: 'Figma plugins and audit scripts that automate compliance, state coverage, and handoff spec work.' },
]

export function About() {
  return (
    <section
      id="about"
      className="bg-ink-0 border-t border-line py-24 md:py-32 px-6 md:px-12"
    >
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-start">
        {/* Left — scroll-fade paragraph */}
        <div>
          <ScrollFadeParagraph
            className="text-xl md:text-2xl text-text-hi leading-relaxed font-body"
          >
            I design dense ops workbenches for logistics planners who need complete situational awareness in seconds, and low-literacy transporter interfaces for delivery partners who trust the screen literally.
          </ScrollFadeParagraph>
          <ScrollFadeParagraph
            className="text-xl md:text-2xl text-text-hi leading-relaxed font-body mt-6"
          >
            My work is about operating models — decision loops, alignment rituals, permission structures — not just screen design. Every case study here documents a system, not a surface.
          </ScrollFadeParagraph>
          <ScrollFadeParagraph
            className="text-xl md:text-2xl text-text-hi leading-relaxed font-body mt-6"
          >
            I also build the tools I use: eight Figma plugins, run daily on production files, that automate the audit work I would otherwise do by hand.
          </ScrollFadeParagraph>
        </div>

        {/* Right — services list */}
        <div className="flex flex-col">
          <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mb-4">
            What I do
          </p>
          {SERVICES.map(({ num, label, desc }) => (
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

/**
 * ProcessStrip — id="process". 8 UX steps as a connected node route.
 * Horizontal scrollable on mobile via overflow-x-auto on the track wrapper.
 * Nodes: filled signal circles; connectors: dashed lines.
 * Step numbers are genuine sequence markers — the 8-step process IS sequential.
 */

import { site } from '../../content/site'

const STEPS = site.process.steps

export function ProcessStrip() {
  return (
    <section
      id="process"
      className="bg-ink-0 border-t border-line py-24 md:py-28 px-0"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-[10px] text-text-lo tracking-[0.25em] uppercase mb-3">
            {site.process.eyebrow}
          </p>
          <p className="font-serif italic text-text-lo text-base md:text-lg max-w-md leading-relaxed">
            {site.process.intro}
          </p>
        </div>
      </div>

      {/* Scrollable node route */}
      <div
        className="overflow-x-auto pb-4"
        role="list"
        aria-label={site.process.listAriaLabel}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-start px-6 md:px-12 min-w-max">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="flex items-start shrink-0"
              role="listitem"
            >
              {/* Node + label */}
              <div className="flex flex-col items-center gap-3 w-28 md:w-32">
                {/* Signal node */}
                <div
                  className="w-8 h-8 rounded-full bg-signal flex items-center justify-center shrink-0"
                  aria-hidden="true"
                >
                  <span className="font-mono text-[10px] text-ink-0 font-medium tabular-nums">
                    {step.num}
                  </span>
                </div>
                {/* Step label */}
                <p className="font-mono text-[10px] text-text-lo tracking-wider text-center leading-snug whitespace-pre-line">
                  {step.label}
                </p>
              </div>

              {/* Connector — hidden after last node */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center self-start mt-4 shrink-0" aria-hidden="true">
                  {/* Dashed connector SVG — 48px wide */}
                  <svg
                    width="48"
                    height="12"
                    viewBox="0 0 48 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 6 L48 6"
                      stroke="var(--color-text-lo)"
                      strokeWidth="1"
                      strokeDasharray="3 4"
                      strokeOpacity="0.5"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

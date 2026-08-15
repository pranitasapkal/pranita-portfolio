/**
 * Flow block — step sequence rendered as a vertical node→node route line.
 * Each step is a labeled node; the connecting line uses the dashed arc motif.
 */
interface FlowProps {
  steps: string[]
}

export function Flow({ steps }: FlowProps) {
  return (
    <ol className="flex flex-col gap-0" aria-label="Process flow">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <li key={i} className="flex gap-4">
            {/* Node + connector column */}
            <div className="flex flex-col items-center shrink-0 w-6" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-signal mt-1 shrink-0 ring-4 ring-signal/10" />
              {!isLast && (
                <span className="flex-1 w-px bg-gradient-to-b from-signal/30 to-line mt-1" />
              )}
            </div>
            {/* Step content */}
            <div className={`flex flex-col gap-1 pb-6 ${isLast ? 'pb-0' : ''}`}>
              <span className="font-mono text-[10px] tracking-widest uppercase text-text-lo">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-body text-text-hi text-sm leading-relaxed max-w-[55ch]">
                {step}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

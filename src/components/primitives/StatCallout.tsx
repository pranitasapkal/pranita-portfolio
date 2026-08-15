/**
 * Stat block: large mono value in signal + small label in text-lo.
 * fuzzed prop appends the brand asterisk superscript.
 */
import { Asterisk } from './Asterisk'

interface StatCalloutProps {
  value: string
  label: string
  fuzzed?: boolean
  className?: string
}

export function StatCallout({ value, label, fuzzed = false, className = '' }: StatCalloutProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-mono text-signal text-4xl md:text-5xl font-medium leading-none tabular-nums">
        {value}
        {fuzzed && <Asterisk />}
      </span>
      <span className="font-mono text-text-lo text-xs tracking-wider uppercase">
        {label}
      </span>
    </div>
  )
}

/**
 * Brand asterisk mark — fuzzed-metric indicator.
 * Renders as <sup> with aria-label and tooltip.
 */
export function Asterisk() {
  return (
    <sup
      className="font-mono text-signal"
      aria-label="fuzzed metric"
      title="Directionally accurate; intentionally fuzzed."
    >
      *
    </sup>
  )
}

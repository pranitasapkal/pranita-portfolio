/**
 * Quote block — large serif italic pull-quote with optional attribution.
 */
interface QuoteProps {
  text: string
  attribution?: string
}

export function Quote({ text, attribution }: QuoteProps) {
  return (
    <blockquote className="relative pl-6 border-l-2 border-signal flex flex-col gap-3 my-2">
      <p className="font-serif italic text-xl text-text-hi leading-relaxed max-w-[55ch]">
        "{text}"
      </p>
      {attribution && (
        <cite className="font-mono text-xs text-text-lo tracking-wider not-italic">
          — {attribution}
        </cite>
      )}
    </blockquote>
  )
}

/**
 * Text block — renders body string as paragraphs.
 * Splits on \n\n for paragraphs.
 * Inline markers: {*} → <Asterisk />, [UT-FINDINGS:…] → "content pending" PillTag,
 * **bold** → <strong />.
 */
import type { ReactNode } from 'react'
import { Asterisk } from '../../primitives/Asterisk'
import { PillTag } from '../../primitives/PillTag'

const TOKEN_RE = /(\{\*\}|\[UT-FINDINGS:[^\]]*\]|\*\*[^*]+\*\*)/g

function renderInline(text: string): ReactNode[] {
  return text.split(TOKEN_RE).map((part, i) => {
    if (part === '{*}') return <Asterisk key={i} />
    if (part.startsWith('[UT-FINDINGS:')) {
      return (
        <PillTag key={i} className="mx-1 opacity-50">
          content pending
        </PillTag>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-text-hi font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

interface TextProps {
  body: string
}

export function Text({ body }: TextProps) {
  const paragraphs = body.split(/\n\n+/)
  return (
    <div className="flex flex-col gap-5">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="font-body text-text-hi leading-[1.7] text-lg md:text-xl"
        >
          {renderInline(para)}
        </p>
      ))}
    </div>
  )
}

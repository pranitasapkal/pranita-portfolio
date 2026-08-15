/**
 * ImageBlock — browser/phone/none frame wrappers.
 * When placeholder=true or the img 404s, renders a styled "asset pending" frame
 * showing the alt text instead of a broken image.
 */
import { useState } from 'react'
import { BrowserFrame } from '../../primitives/BrowserFrame'
import { PhoneFrame } from '../../primitives/PhoneFrame'

interface ImageBlockProps {
  frame: 'browser' | 'phone' | 'none'
  src: string
  alt: string
  caption?: string
  slug?: string
  placeholder?: boolean
}

function PendingFrame({ alt }: { alt: string }) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center gap-3 py-16 px-8 bg-ink-1 border border-dashed border-line rounded"
      aria-label={alt}
    >
      <span className="font-mono text-xs tracking-widest uppercase text-text-lo/60">
        asset pending
      </span>
      <span className="font-body text-sm text-text-lo text-center max-w-[40ch] leading-relaxed">
        {alt}
      </span>
    </div>
  )
}

function Img({ src, alt, placeholder }: { src: string; alt: string; placeholder?: boolean }) {
  const [errored, setErrored] = useState(false)

  if (placeholder || errored) {
    return <PendingFrame alt={alt} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-full block"
      onError={() => setErrored(true)}
    />
  )
}

export function ImageBlock({ frame, src, alt, caption, slug, placeholder }: ImageBlockProps) {
  const inner = <Img src={src} alt={alt} placeholder={placeholder} />

  let framed: React.ReactNode
  if (frame === 'browser') {
    framed = <BrowserFrame slug={slug ?? 'pranita.design'}>{inner}</BrowserFrame>
  } else if (frame === 'phone') {
    framed = <PhoneFrame>{inner}</PhoneFrame>
  } else {
    framed = <div className="rounded-lg overflow-hidden">{inner}</div>
  }

  return (
    <figure className="flex flex-col gap-3 my-2">
      {framed}
      {caption && (
        <figcaption className="font-mono text-xs text-text-lo tracking-wide text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

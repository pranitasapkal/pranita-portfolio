/**
 * ImageBlock — browser/phone/none frame wrappers.
 * When placeholder=true or the img 404s, renders a styled "asset pending" frame
 * showing the alt text instead of a broken image.
 */
import { useState } from 'react'
import { BrowserFrame } from '../../primitives/BrowserFrame'
import { PhoneFrame } from '../../primitives/PhoneFrame'
import manifest from '../../../lib/image-manifest.json'

// JSON imports widen tuples to number[], so read defensively rather than asserting a tuple.
const dimensions: Record<string, number[]> = manifest

/**
 * Case-study images are authored as `.png` paths in src/content/. `npm run optimize-images`
 * emits a WebP beside every one of them (~76% smaller across the set), so we serve the WebP
 * and keep the PNG as the <picture> fallback. The content lane keeps writing .png and never
 * has to know. If the WebP is missing, the fallback simply wins.
 */
function webpFor(src: string) {
  return src.replace(/\.png$/i, '.webp')
}

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

  const dim = dimensions[src]

  return (
    <picture>
      <source srcSet={webpFor(src)} type="image/webp" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        // Reserving the box stops the decode from shifting layout, which in turn stops
        // ScrollTrigger start positions drifting on a slow connection.
        {...(dim?.length === 2 ? { width: dim[0], height: dim[1] } : {})}
        className="w-full h-auto block"
        onError={() => setErrored(true)}
      />
    </picture>
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
    // Caption leads the frame (Manav, 2026-08-16): the key decision reads first,
    // then the screen proves it — sitting on a solid soft-cobalt panel, the
    // reference's subtle-yet-pop presentation.
    <figure className="flex flex-col gap-3 my-2">
      {caption && (
        <figcaption className="font-body font-medium text-base text-text-hi">
          {caption}
        </figcaption>
      )}
      <div className="rounded-3xl bg-pop-blue/8 p-5 md:p-8">{framed}</div>
    </figure>
  )
}

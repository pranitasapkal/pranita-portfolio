/**
 * Sets document.title + meta description per page via useEffect.
 * No SSR needed; this runs only in the browser.
 */
import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
}

export function SEOHead({ title, description }: SEOHeadProps) {
  useEffect(() => {
    document.title = title

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)
  }, [title, description])

  return null
}

/**
 * CaseStudyPage — route /work/:slug
 * Looks up slug in the case registry; falls back to NotFound for unknown slugs.
 * Scrolls to top on slug change.
 *
 * The `.v1-paper` wrapper re-declares the v1 token names with light values, so
 * case pages render on white while every block component keeps using the v1
 * utilities unchanged. Pranita's call, 2026-08-16: case studies on white, home
 * page untouched. Swap back to `.v1-ink` to return them to the dark system.
 */
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { caseStudies } from '../content/cases/index'
import { CaseLayout } from '../components/caseStudy/CaseLayout'
import { EditorialCaseLayout } from '../components/caseStudy/EditorialCaseLayout'

function NotFound() {
  return (
    <main
      id="main"
      className="min-h-screen flex flex-col items-center justify-center gap-8 p-8"
    >
      <p className="font-mono text-text-lo text-xs tracking-[0.3em] uppercase">404</p>
      <h1 className="font-display font-black text-4xl md:text-6xl text-text-hi text-center">
        CASE NOT FOUND
      </h1>
      <a
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-mono tracking-wider border bg-signal text-ink-0 border-transparent hover:bg-signal/90 transition-colors duration-200"
      >
        Return to base
      </a>
    </main>
  )
}

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  const cs = slug ? caseStudies[slug] : undefined

  return (
    <div className="v1-paper bg-ink-0 text-text-hi font-body min-h-screen">
      {!cs ? (
        <NotFound />
      ) : cs.layout === 'editorial' ? (
        <EditorialCaseLayout cs={cs} />
      ) : (
        <CaseLayout cs={cs} />
      )}
    </div>
  )
}

/**
 * CaseStudyPage — route /work/:slug
 * Looks up slug in the case registry; falls back to NotFound for unknown slugs.
 * Scrolls to top on slug change.
 *
 * The `.v1-ink` wrapper pins these pages to the v1 dark ink system regardless
 * of the site theme — the v2 light-first tokens moved the body onto semantic
 * surfaces, and case pages are out of scope for the v2 restyle (ADR-004).
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
    <div className="v1-ink bg-ink-0 text-text-hi font-body min-h-screen">
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
